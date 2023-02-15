import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "",
      accounts: []
    }
  },
  etherscan: {
    apiKey:""
  }
};

export default config;
