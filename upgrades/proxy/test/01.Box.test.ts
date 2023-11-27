import { expect } from "chai";
import { ethers, upgrades, getNamedAccounts } from "hardhat";
import { Contract } from "ethers";

describe("Test deploying only Box contract.", function () {
  let box: Contract;

  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");
    box = await Box.deploy();
    await box.deploymentTransaction().wait(1);
  });

  it("should retrieve value previously stored", async function () {
    await box.store(42);
    expect(await box.retrieve()).to.equal(42n);

    await box.store(100);

    expect(await box.retrieve()).to.equal(100n);
  });
});

describe("Test deploying Box contract with Proxy.", function () {
  let box: Contract;

  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");
    box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  });

  it("should retrieve value previously stored through Proxy", async function () {
    expect(await box.retrieve()).to.equal(42n);

    await box.store(100);
    expect(await box.retrieve()).to.equal(100n);
  });
});

describe("Test deploying only Box V2 contract.", function () {
  let boxV2: Contract;

  beforeEach(async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    boxV2 = await BoxV2.deploy();
    await boxV2.deploymentTransaction().wait(1);
  });

  it("should retrieve value previously stored", async function () {
    await boxV2.store(42);
    expect(await boxV2.retrieve()).to.equal(42n);

    await boxV2.store(100);
    expect(await boxV2.retrieve()).to.equal(100n);
  });

  it("should increment value correctly", async function () {
    await boxV2.store(42);
    await boxV2.increment();
    expect(await boxV2.retrieve()).to.equal(43n);
  });
});

describe("Test the Proxy upgrade from Box to BoxV2.", function () {
  let box: Contract;

  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");

    box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  });

  it("should change the implementation address from before update", async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    let implemAddrBefore = await upgrades.erc1967.getImplementationAddress(await box.getAddress());
    box = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);
    let implemAddrAfter = await upgrades.erc1967.getImplementationAddress(await box.getAddress());

    // console.log("Box addr", implemAddrBefore, "BoxV2 addr", implemAddrAfter);

    expect(implemAddrBefore).to.not.equal(implemAddrAfter);
  });

  it("should keep the same proxy address as before update", async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    let boxBefore = box;
    let boxAfter = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);

    // console.log("Box addr", await boxBefore.getAddress(), "BoxV2 addr", await boxAfter.getAddress());

    expect(await boxBefore.getAddress()).to.equal(await boxAfter.getAddress());
  });

  it("should keep the same proxy storage as before update", async function () {
    const BoxV2 = await ethers.getContractFactory("BoxV2");

    await box.store(111);
    let storageBefore = await box.retrieve();

    box = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);
    let storageAfter = await box.retrieve();

    expect(storageBefore).to.equal(storageAfter);
  });

  // it("should correctly add the new BoxV2 increment() function after update", async function () {
  //   const BoxV2 = await ethers.getContractFactory("BoxV2");

  //   // expect(await box["increment()"]).to.equal(5);

  //   box = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);

  //   await expect(box["increment()"]).to.not.be.reverted;
  // });
});

describe("Test deploying Box V2 contract with Proxy.", function () {
  let box: Contract;

  beforeEach(async function () {
    const Box = await ethers.getContractFactory("Box");
    const BoxV2 = await ethers.getContractFactory("BoxV2");

    box = await upgrades.deployProxy(Box, [42], { initializer: "store" });

    box = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);
  });

  it("should retrieve value previously stored and increment correctly", async function () {
    expect(await box.retrieve()).to.equal(42n);

    await box.increment();
    expect(await box.retrieve()).to.equal(43n);

    await box.store(100);
    expect(await box.retrieve()).to.equal(100n);
  });
});
