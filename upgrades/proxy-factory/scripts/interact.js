const { ethers, run, network } = require("hardhat");

require("dotenv").config();

async function main() {
  console.log("--------------------------------");

  PROXY_ADDRESS = process.env.PROXY_ADDRESS;
  IMPLEMENTATION_ADDRESS = process.env.IMPLEMENTATION_ADDRESS;
  ADMIN_CONTRACT_ADDRESS = process.env.ADMIN_CONTRACT_ADDRESS;

  let proxyContract = await hre.ethers.getContractAt("MetaFactory", PROXY_ADDRESS);

  console.log("Creating MetaCoin contract...");
  await proxyContract.createMetacoin();
  console.log("MetaCoin created!");

  const MetaFactoryV2 = await ethers.getContractFactory("MetaFactoryV2");
  console.log("\nUpgrading contract...");
  proxyContract = await upgrades.upgradeProxy(await proxyContract.getAddress(), MetaFactoryV2);
  console.log("Contract successfully upgraded!");

  console.log("--------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
