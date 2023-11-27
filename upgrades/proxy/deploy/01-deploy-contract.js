const { network, ethers, upgrades } = require("hardhat");
const { verify } = require("@nomicfoundation/hardhat-verify");

module.exports = async function ({ deployments }) {
  const { deploy, log } = deployments;
  const args = [];

  const Box = await ethers.getContractFactory("Box");
  console.log("Deploying Box...");
  const box = await upgrades.deployProxy(Box, [42], { initializer: "store" });

  console.log(`PROXY_ADDRESS=${await box.getAddress()}`);
  console.log(`IMPLEMENTATION_ADDRESS=${await upgrades.erc1967.getImplementationAddress(await box.getAddress())}`);
  console.log(`ADMIN_CONTRACT_ADDRESS=${await upgrades.erc1967.getAdminAddress(await box.getAddress())}`);

  // utils/verify.js deployment (optional).
  const developmentChains = ["hardhat", "localhost"];
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(await box.getAddress(), args);
  }
  log("--------------------------------");
};

module.exports.tags = ["all", "contract"];
