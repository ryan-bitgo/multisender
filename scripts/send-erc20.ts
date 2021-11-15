import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import hre from 'hardhat'
import type { MultiSender, IERC20 } from '../typechain-types';

async function main() {
  const MultiSender = await hre.ethers.getContractFactory('MultiSender')
  const MULTISENDER_PROXY = process.env.MULTISENDER_PROXY ?? ''
  const multiSender = MultiSender.attach(MULTISENDER_PROXY) as MultiSender;

  const tokenAddress = '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60';
  const token = (await hre.ethers.getContractAt(
    'IERC20',
    tokenAddress,
  )) as IERC20;

  await (await token.approve(MULTISENDER_PROXY, '999999999999999')).wait();

  console.log(
    await multiSender.sendERC20(
      [tokenAddress, tokenAddress],
      [1, 1],
      [
        '0x83e4447ca37176a8476f4e4ff4518f09d0d2f907',
        '0xd6ee34bbca9212679558f7eaec33e4a88364d563',
      ],
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
