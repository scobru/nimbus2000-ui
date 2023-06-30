import { useEffect, useState } from "react";
import { Signer, ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import usdcAbi from "~~/abis/ERC20ABI.json";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";

export default function Fund() {
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const btcAddress = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();
  const signerAddress = account?.address;
  const txData = useTransactor(signer);
  const { data: fundContract } = useDeployedContractInfo("Fund");
  const [amount, setAmount] = useState("");
  const [shareBalance, setShareBalance] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("");
  const [oracleStatus, setOracleStatus] = useState("");
  const [status, setStatus] = useState("");
  const [sharesValuation, setSharesValuation] = useState("");
  const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer as Signer);
  const btcContract = new ethers.Contract(btcAddress, usdcAbi, signer as Signer);
  const [protocolFee, setProtocolFee] = useState("");
  let ctxFundInstance: ethers.Contract;

  if (fundContract && signer) {
    ctxFundInstance = new ethers.Contract(fundContract?.address, fundContract?.abi, signer || provider);
  }

  const resultSignal = (signal: string) => {
    if (signal == "BUY") {
      return (
        <>
          <button className="h-8 text-green-300 bg-green-600 px-2 rounded-md text-md  font-medium my-2">
            {signal}
          </button>
        </>
      );
    } else if (signal == "SELL") {
      return (
        <>
          <button className=" h-8 text-red-300 bg-red-600 px-2 rounded-md text-md  font-medium my-2">{signal}</button>
        </>
      );
    } else if (signal == "NEUTRAL") {
      return (
        <>
          <button className=" h-8 text-yellow-300 bg-yellow-600 px-2 rounded-md text-md  font-medium my-2">
            {signal}
          </button>
        </>
      );
    }
  };

  useEffect(() => {
    if (signer && signerAddress && usdcContract && account && ctxFundInstance) {
      const fetchUsdcBalance = async () => {
        try {
          const oracleStatus = await ctxFundInstance?.getStatus();
          setOracleStatus(oracleStatus);
          await handleShareBalance();
          usdcContract.connect(signer);
          btcContract.connect(signer);
          const balance = await usdcContract?.balanceOf(signerAddress);
          const balanceFundBtc = await btcContract?.balanceOf(fundContract?.address);
          const balanceFundUsdc = await usdcContract?.balanceOf(fundContract?.address);
          const totalSupply = await ctxFundInstance?.totalSupply();
          if (Number(oracleStatus) == 1) {
            const valuation = (Number(shareBalance) * 1e18 * balanceFundBtc) / totalSupply;
            valuation != 0 ? setSharesValuation(String((valuation * 1e10) / 1e18) + " BTC") : null;
          } else if (Number(oracleStatus) == 0) {
            const valuation = (Number(shareBalance) * 1e18 * balanceFundUsdc) / totalSupply;
            valuation != 0 ? setSharesValuation(String((valuation * 1e12) / 1e18) + " USDC") : null;
          }
          const _protocolFee = await ctxFundInstance?.protocolFee();
          setProtocolFee(ethers.utils.formatEther(_protocolFee));

          const formattedBalance = ethers.utils.formatUnits(balance, 6);
          setUsdcBalance(formattedBalance);

          console.log("balance", formattedBalance);
          console.log("balanceFundBtc", balanceFundBtc.toString());
          console.log("balanceFundUsdc", balanceFundUsdc.toString());
          console.log("totalSupply", totalSupply.toString());
          console.log("shareBalance", shareBalance);
          console.log("oracleStatus", oracleStatus);
          console.log("valuation", sharesValuation);
        } catch (error) {
          console.error("Error fetching USDC balance:", error);
        }
      };

      fetchUsdcBalance();
    }
  }, [signer, account, usdcContract, btcContract, fundContract, signerAddress, oracleStatus, shareBalance]);

  const handleApprove = async () => {
    try {
      const approveAmount = ethers.utils.parseUnits(amount, 6);
      const tx = await usdcContract.approve(fundContract?.address, approveAmount);
      await tx.wait();
      setStatus("Approval successful");
    } catch (error) {
      console.error("Error approving amount:", error);
      setStatus("Approval failed");
    }
  };

  const handleDeposit = async () => {
    try {
      const depositAmount = ethers.utils.parseEther(amount);
      txData(await ctxFundInstance.deposit(depositAmount, { value: await ctxFundInstance.protocolFee() }));
      setStatus("Deposit successful");
    } catch (error) {
      console.error("Error depositing amount:", error);
      setStatus("Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    try {
      const withdrawShares = ethers.utils.parseUnits(shareBalance, 18);
      txData(await ctxFundInstance.withdraw(withdrawShares));
      setStatus("Withdrawal successful");
    } catch (error) {
      console.error("Error withdrawing shares:", error);
      setStatus("Withdrawal failed");
    }
  };

  const handleShareBalance = async () => {
    try {
      const shares = await ctxFundInstance.balanceOf(signerAddress);
      setShareBalance(ethers.utils.formatUnits(shares, 18));
    } catch (error) {
      console.error("Error fetching share balance:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("deposit");

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 h-screen">
      <div className="max-w-md mx-auto dark:bg-white  rounded-xl shadow-lg  overflow-hidden md:max-w-2xl m-6">
        <div className="p-8 w-72 sm:w-80 md:w-96">
          <div className="mb-5">
            <label
              className={`tab h-20 text-center w-full font-semibold ${
                activeTab === "deposit" ? "bg-secondary text-primary-content" : "text-primary"
              } mr-2`}
              onClick={() => handleTabClick("deposit")}
            >
              Deposit
            </label>
            <label
              className={`tab h-20 text-center w-full font-semibold  ${
                activeTab === "withdraw" ? "bg-secondary text-primary-content" : "text-primary"
              }`}
              onClick={() => handleTabClick("withdraw")}
            >
              Withdraw
            </label>
          </div>
          {activeTab === "deposit" && (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Deposit USDC</h3>
              <div className="mb-4">
                <label className="text-primary">Fee: {protocolFee} MATIC</label>
                <input type="text" onChange={e => setAmount(e.target.value)} className="input input-bordered w-full" />
              </div>
              <button onClick={handleApprove} className="btn btn-primary mr-2">
                Approve
              </button>

              <button onClick={handleDeposit} className="btn btn-primary">
                Deposit
              </button>
            </>
          )}
          {activeTab === "withdraw" && (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Withdraw</h3>
              <div className="mb-4">
                <label>NIM2000 Balance:</label>
                <input
                  type="text"
                  onChange={e => setShareBalance(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <button onClick={handleWithdraw} className="btn btn-primary">
                Withdraw
              </button>
            </>
          )}

          <div className="mt-5">
            <div className="text-md text-gray-500">USDC</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900"> {usdcBalance}</h3>
            <div className="text-md text-gray-500">NIM2000</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{shareBalance}</h3>
            <div className="text-md text-gray-500">Valuation</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900"> {sharesValuation}</h3>
            <div className="text-md text-gray-500">Oracle</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {" "}
              {oracleStatus == 1 ? resultSignal("BUY") : resultSignal("SELL")}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
