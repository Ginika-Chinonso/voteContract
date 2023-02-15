import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC,
      //@ts-ignore
      accounts: [process.env.ACC1_PKEY ,process.env.ACC2_PKEY, process.env.ACC3_PKEY,]
    }
  },
  etherscan: {
    apiKey:process.env.ETHERSCAN_RPC
  }
};

export default config;
