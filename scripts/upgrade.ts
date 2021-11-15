import hre from 'hardhat'

async function main() {
  const MultiSender = await hre.ethers.getContractFactory('MultiSender')
  const multiSender = await hre.upgrades.upgradeProxy(
    { address: '0xb0Eee63e7B8FE52953E218a19100565D9A005eF3' },
    MultiSender,
  )

  await multiSender.deployed()

  console.log('MultiSender deployed to:', multiSender.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
