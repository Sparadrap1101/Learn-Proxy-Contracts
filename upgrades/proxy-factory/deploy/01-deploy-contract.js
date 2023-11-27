const { network, ethers, upgrades } = require("hardhat");
const { verify } = require("@nomicfoundation/hardhat-verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [];

  console.log("Deploying MetaFactory...");
  const MetaCoinFactory = await ethers.getContractFactory("MetaFactory", {
    from: deployer,
    args: args,
    log: true,
  });

  const metaCoinProxy = await upgrades.deployProxy(MetaCoinFactory, [], { initializer: "initialize" });

  console.log(`\nPROXY_ADDRESS=${await metaCoinProxy.getAddress()}`);
  console.log(
    `IMPLEMENTATION_ADDRESS=${await upgrades.erc1967.getImplementationAddress(await metaCoinProxy.getAddress())}`
  );
  console.log(`ADMIN_CONTRACT_ADDRESS=${await upgrades.erc1967.getAdminAddress(await metaCoinProxy.getAddress())}`);

  // utils/verify.js deployment (optional).
  const developmentChains = ["hardhat", "localhost"];
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(await metaCoinProxy.getAddress(), args);
  }
  log("--------------------------------");
};

module.exports.tags = ["all", "contract"];
