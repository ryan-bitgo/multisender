# Bitgo Multisender

Simple multisender contract and scripts for sending:

1. Only ETH sends
2. Only ERC20 sends
3. ETH and ERC20 sends

## Setup

```sh
npm install
cp .env.example .env
```

Fill in the `GOERLI_PRIVATE_KEY` variable `.env`. `ETHERSCAN_API_KEY` and `ALCHEMY_PRIVATE_KEY` is not required for just sending txns.

Update the `send-example.csv`. For only ETH txns, just leave token address empty.

Run with `npx hardhat run scripts/send-from-csv.ts`
