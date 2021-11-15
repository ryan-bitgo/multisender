import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import hre from 'hardhat'
import type { MultiSender } from '../typechain-types/MultiSender'

async function main() {
  const MultiSender = await hre.ethers.getContractFactory('MultiSender')
  const MULTISENDER_PROXY = process.env.MULTISENDER_PROXY ?? ''
  const multiSender = MultiSender.attach(MULTISENDER_PROXY) as MultiSender

  const tx = await multiSender.sendETH(
    [1, 1],
    [
      '0x83e4447ca37176a8476f4e4ff4518f09d0d2f907',
      '0xd6ee34bbca9212679558f7eaec33e4a88364d563',
    ],
    { value: 2 },
  )
  console.log(tx.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
