import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import fs from 'fs-jetpack'
import parse = require("csv-parse/lib/sync");
import { BN } from 'ethereumjs-util';
import hre from 'hardhat'
import type { MultiSender, IERC20 } from '../typechain-types';
import Joi from 'joi'


const Schema = Joi.array().items(Joi.object({
  Destination: Joi.string(),
  Amount: Joi.string(),
  TokenAddress: Joi.string().optional().allow("")
}))

async function main() {
  const filePath = process.cwd() + "/" + process.env.CSV_FILE_PATH
  if (!filePath) {
    throw new Error('file path not specified')
  }
  const file = await fs.readAsync(filePath)
  if (!file) {
    throw new Error(`${filePath} does not exist`)
  }

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true
  })

  console.log("records");
  console.log(records);
  const validationResult = Schema.validate(records);
  if (validationResult.error) {
    throw new Error("invalid csv: " + validationResult.error)
  }

  const parsedRecords = records;

  let tokenAddresses = [];
  let amounts = [];
  let destinationAddresses = [];
  let totalWei = new BN(0);

  const MultiSender = await hre.ethers.getContractFactory('MultiSender')
  const MULTISENDER_PROXY = process.env.MULTISENDER_PROXY ?? ''
  const multiSender = MultiSender.attach(MULTISENDER_PROXY) as MultiSender;

  for (const record of parsedRecords) {
    const amount = new BN(record.Amount);
    amounts.push(amount.toString(10))
    destinationAddresses.push(record.Destination)

    if (record.TokenAddress) {
      tokenAddresses.push(record.TokenAddress);
    } else {
      tokenAddresses.push('0x0000000000000000000000000000000000000000');
      totalWei = totalWei.add(amount);
    }
  }

  for (const tokenAddress of new Set(tokenAddresses)) {
    if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
      const token = (await hre.ethers.getContractAt(
        'IERC20',
        tokenAddress,
      )) as IERC20;
      await (await token.approve(MULTISENDER_PROXY, '999999999999999')).wait();
    }
  }

  console.log(
    (await multiSender.sendETHAndERC20(
      tokenAddresses,
      amounts,
      destinationAddresses,
      { value: totalWei.toString(10) },
    )).hash,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
