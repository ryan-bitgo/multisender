import hre from 'hardhat'

async function main() {
  const MultiSender = await hre.ethers.getContractFactory('MultiSender')
  const multiSender = await hre.upgrades.deployProxy(MultiSender, []);

  await multiSender.deployed();

  console.log('MultiSender deployed to:', multiSender.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
