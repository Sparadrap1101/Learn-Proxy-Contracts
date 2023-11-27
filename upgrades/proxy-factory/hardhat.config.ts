import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy-ethers";
import "@openzeppelin/hardhat-upgrades";
import { config as configDotenv } from "dotenv";
import { resolve } from "path";

configDotenv({
  path: resolve(__dirname, "./.env"),
});

const mnemonic_deployer = process.env["MNEMONIC_DEPLOYER"];
const mnemonic_buyer = process.env["MNEMONIC_BUYER"];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      live: false,
      saveDeployments: false,
      tags: ["local"],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      accounts: {
        mnemonic: mnemonic_deployer,
      },
    },
    mumbai_buyer: {
      url: "https://rpc-mumbai.maticvigil.com",
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      accounts: {
        mnemonic: mnemonic_buyer,
      },
    },
  },

  namedAccounts: {
    deployer: {
      default: 0,
      localhost: "0x6cc23ad350E117adb574CB3A8F998AD7827a3700",
    },
    buyer: {
      default: 1,
      localhost: "0x7aD317d28C7291E8212a85C166dEb29df88bB389",
    },
  },
};
export default config;
