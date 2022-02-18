# Catheon  Contracts (catheon, staked catheon, staking)

Create a flexible pool Solidity smart contract based on the following criteria:

- 8 weeks staking period / 56 days

- Users can unlock tokens but if before 8 weeks there is a 20% fee

Fee goes into the pool for other claimants

- When staking user receives xTokens

xToken is a pool share token, no intrinsic value

When a user stakes n tokens, they receive  xTokens equal to n * (xTokens_supply / token_pool_amount)

When you unstake n xTokens , they receive an amount of tokens equal to n * (token_pool_amount / xTokens_supply), and the xTokens are burnt
Try running some of the following tasks:

```shell
npm install
npx hardhat test
npx hardhat run --network testnet scripts/0_authority_deploys.js
npx hardhat run --network testnet scripts/1_token_deploys.js

```

# .env Example

ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=
ROPSTEN_URL=https://ropsten.infura.io/v3/{API_KEY}
BSC_TESTNET_URL=https://speedy-nodes-nyc.moralis.io/{YOUR_KEY}/bsc/testnet
PRIVATE_KEY=

