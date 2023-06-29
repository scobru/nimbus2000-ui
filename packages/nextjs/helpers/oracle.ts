import { ethers } from "ethers";
import ky from "ky";

const ORACLE_ABI = ["function lastUpdated() external view returns(uint256)", "function updatePrice(uint256)"];

const oracleAddress = "0x71B9B0F6C999CBbB0FeF9c92B80D54e4973214da"; // replace with real address

async function updateOraclePrice(provider: ethers.providers.Provider) {
  const oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider);

  let lastUpdated: number;
  try {
    lastUpdated = parseInt((await oracle.lastUpdated()).toString());
    console.log(`Last oracle update: ${lastUpdated}`);
  } catch (err) {
    console.error(`RPC call failed: ${err}`);
    return;
  }

  const nextUpdateTime = lastUpdated + 3600;
  const timestamp = (await provider.getBlock("latest")).timestamp;
  console.log(`Next oracle update: ${nextUpdateTime}`);

  if (timestamp < nextUpdateTime) {
    console.error("Time not elapsed");
    return;
  }

  const currency = "ethereum";
  let price = 0;
  try {
    const coingeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`;

    const priceData: { [key: string]: { usd: number } } = await ky
      .get(coingeckoApi, { timeout: 5_000, retry: 0 })
      .json();
    price = Math.floor(priceData[currency].usd);
  } catch (err) {
    console.error(`Coingecko call failed: ${err}`);
    return;
  }
  console.log(`Updating price: ${price}`);

  // create transaction data
  const transaction = {
    to: oracleAddress,
    data: oracle.interface.encodeFunctionData("updatePrice", [price]),
  };

  console.log(transaction);
}

// get default provider (set up your provider URL)
const provider = new ethers.providers.JsonRpcProvider(); // replace with your provider, e.g., ethers.providers.InfuraProvider
updateOraclePrice(provider);
