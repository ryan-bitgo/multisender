import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import { HardhatUserConfig } from 'hardhat/types'

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@openzeppelin/hardhat-upgrades'
import '@nomiclabs/hardhat-etherscan'

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? ''
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY ?? ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? ''

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
/* task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
}); */

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: 'goerli',
  solidity: {
    version: '0.8.9',
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
}

export default config
