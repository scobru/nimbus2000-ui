import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const pool = "0x847b64f9d3a95e977d157866447a5c0a5dfa0ee5"; // WBTC/USDC Uni-v3 Polygon Pool
// uniswap v3 polygon swap router
const swapRouter = "0xe592427a0aece92de3edee1f18e0157c05861564";
// uniswap v3 oracle
const oracle = "0xBf5ec3570909D09D817F2AA4FD3Ad607090AaD46";
// usdc
const usdc = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
// wbtc
const wbtc = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
// operator
const operator = "0x58dF4b1E490d0380Eb273f87D6f4eD8d4EA0E1A6"; // nimbus2000 oracle.

const deployPriceConsumer: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  await deploy("Fund", {
    from: deployer,
    args: [pool, swapRouter, oracle, usdc, wbtc, operator],
    log: true,
  });
};

export default deployPriceConsumer;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployPriceConsumer.tags = ["Fund"];
