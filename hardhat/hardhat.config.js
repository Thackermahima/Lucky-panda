require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  // networks: {
  //   mumbai: {
  //     url : `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
  //     accounts: [PRIVATE_KEY]
  //   }
  // }
  networks: {
    testnet: {
      url: "https://bsc-testnet.bnbchain.org",
      chainId: 97,
      // gasPrice: 20000000000,
      accounts: [PRIVATE_KEY]
    },
  }
};