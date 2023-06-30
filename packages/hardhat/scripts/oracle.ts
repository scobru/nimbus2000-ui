import ky from "ky";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import axios from "axios";

const fetchApi = async (): Promise<string | void> => {
  const url: string = process.env.NEXT_PUBLIC_API_URL + "data/";
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
      },
    });

    const data = response.data;
    return data["prediction signal"];
  } catch (error) {
    console.error(error);
  }
};

async function main() {
  const signers = await ethers.getSigners();
  const oracleAddress = "0xBf5ec3570909D09D817F2AA4FD3Ad607090AaD46";
  const oracle = await ethers.getContractAt("SimpleOracle", oracleAddress, signers[0]);
  const provider = ethers.provider;
  const networkName = (await provider.getNetwork()).name;
  const response = await fetchApi();

  let result;
  let status;

  status = await oracle.getStatus();

  if (response == "BUY" && response) {
    console.log("BUY");
    result = 1;
  } else if (response == "SELL" && response) {
    console.log("SELL");
    result = 0;
  } else if (!response) {
    console.log("No response from API");
    return;
  }

  if (status == result) {
    console.log("Status already updated");
  } else {
    try {
      console.log("   Change Status ...");
      const transaction = await oracle.changeStatus(1);
      console.log("Transaction sent, waiting for it to be mined");
      await transaction.wait();
      console.log("Transaction mined");
    } catch (e) {
      console.log("Can't connect to network", networkName);
    }
    status = await oracle.getStatus();
    console.log("New Status: ", await status);
  }
}

async function runEveryMinute() {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
  setTimeout(runEveryMinute, 60 * 1000);
}

runEveryMinute();
