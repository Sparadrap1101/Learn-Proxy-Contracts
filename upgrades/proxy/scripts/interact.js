const { ethers, run, network } = require("hardhat");

require("dotenv").config();

async function main() {
  console.log("--------------------------------");

  PROXY_ADDRESS = process.env.PROXY_ADDRESS;
  IMPLEMENTATION_ADDRESS = process.env.IMPLEMENTATION_ADDRESS;
  ADMIN_CONTRACT_ADDRESS = process.env.ADMIN_CONTRACT_ADDRESS;

  let proxyContract = await hre.ethers.getContractAt("Box", PROXY_ADDRESS);

  await proxyContract.store(42);
  console.log("Box storage equals", (await proxyContract.retrieve()).toString());
  await proxyContract.store(100);
  console.log("Box storage now equals", (await proxyContract.retrieve()).toString());

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("\nUpgrading contract...");
  proxyContract = await upgrades.upgradeProxy(await proxyContract.getAddress(), BoxV2);
  console.log("Contract successfully upgraded!\n");

  await proxyContract.increment();
  console.log("Box storage has now been incremented to", (await proxyContract.retrieve()).toString());

  console.log("--------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
