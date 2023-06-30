/* eslint-disable @typescript-eslint/no-unused-vars */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployHttpRequestOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const [_, addr1] = await ethers.getSigners();

  await deploy("HttpRequestOracle", {
    from: deployer,
    args: [],
    log: true,
  });

  const httpRequestOracle = await hre.ethers.getContract("HttpRequestOracle", deployer);

  // Add  a default reporter for the ui
  // await priceOracle.updateReporter("0xCbdAa684708c13E7b85EBe3d3410DF02F8700808", true);

  // other reporters
  await httpRequestOracle.updateReporter(deployer, true);
  // await httpRequestOracle.updateReporter(addr1.address, true);
  // await priceOracle.transferOwnership("0xCbdAa684708c13E7b85EBe3d3410DF02F8700808");
};

export default deployHttpRequestOracle;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployHttpRequestOracle.tags = ["HttpRequestOracle"];