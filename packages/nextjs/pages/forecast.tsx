import React, { useState, useEffect, use } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { formatEther } from "ethers/lib/utils.js";
import Chart from 'chart.js';

const NEXT_PUBLIC_API_SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY;

const Forecast: NextPage = () => {
  const [data, setData]: any = useState<any>();
  const account = useAccount();
  const address = account ? account.address : "";
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [blurOn, setBlurOn] = useState("")
  const [fee, setFee] = useState(0)
  const [close_chart, setCloseChart] = useState<any>()
  const [regression_chart, setRegressionChart] = useState<any>()
  const [autoselect_chart, setAutoSelectChart] = useState<any>()
  const [autoselect_ema_chart, setAutoSelectEmaChart] = useState<any>()
  const [rnn_chart, setRnnChart] = useState<any>()
  const [brnn0_chart, setBrnn0Chart] = useState<any>()
  const [brnn1_chart, setBrnn1Chart] = useState<any>()
  const [brnn2_chart, setBrnn2Chart] = useState<any>()
  const [nbeats_chart, setNbeatsChart] = useState<any>()
  const [tcn_chart, setTcnChart] = useState<any>()
  const [trans_chart, setTransChart] = useState<any>()
  const [theta_chart, setThetaChart] = useState<any>()
  const [tft_chart, setTftChart] = useState<any>()
  const [datachart, setDataChart]: any = useState<any>();
  const [dataHistory, setDataHistory]: any = useState<any>();

  const txData = useTransactor(signer as ethers.Signer)
  const tiersUrl = "https://tiersapp.vercel.app/viewTier?addr=0xCe61B3ECeF196E5818D85d682Fcc171A622b4c8B"
  const tiersAddress = "0xCe61B3ECeF196E5818D85d682Fcc171A622b4c8B"
  const tiersAbi = [
    "function getSubscriptionStatus(address _addr) public view returns (bool)",
    "function subscribe() public payable",
    "function fee() public view returns (uint256)"
  ]
  const tiersContract = new ethers.Contract(tiersAddress, tiersAbi, signer || provider)
  const [isValidSubscription, setIsValidSubscription] = useState(false)

  const fetchIsValidSubscription = async () => {
    if (tiersContract && address) {
      const isValid = await tiersContract?.getSubscriptionStatus(address)
      setIsValidSubscription(isValid)
      console.log("isValidSubscription", isValid)
      return isValid
    }

  }

  const fetchFee = async () => {
    if (tiersContract) {
      const fee = await tiersContract?.fee()
      console.log("fee", fee)
      setFee(fee)
      return fee
    }
  }

  const subscribe = async () => {
    if (tiersContract) {
      const tx = await tiersContract?.subscribe({ value: fee })
      txData(tx.hash)
      console.log("tx", tx)
      return tx
    }
  }



  const fetchImage = async (filename: string) => {
    console.log("fetching image" + filename);
    const url = process.env.NEXT_PUBLIC_API_URL + "image/" + filename;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
        },
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      const imageElement = document.createElement(filename);
      console.log("imageUrl" + filename, imageUrl)
      return (
        <div>
          <Image
            src={imageUrl}
            alt={filename}
            width={500}
            height={300}
          />
        </div>
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApiHistory = async () => {
    console.log("fetching data");
    const url = process.env.NEXT_PUBLIC_API_URL + "data_history/";
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': String(NEXT_PUBLIC_API_SECRET_KEY)
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDataHistory(data);
      console.log("data history", (data))

    } catch (error) {
      console.error(error);
    }
  };


  const fetchApi = async () => {
    console.log("fetching data");
    const url = process.env.NEXT_PUBLIC_API_URL + "data/";
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': String(NEXT_PUBLIC_API_SECRET_KEY)
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setData(data);
      console.log("data", (data))

    } catch (error) {
      console.error(error);
    }
  };

  const getImages = async () => {

    setCloseChart(await fetchImage('close_chart'))
    setAutoSelectChart(await fetchImage('autoselect'))
    setAutoSelectEmaChart(await fetchImage('autoselect_ema'))
    setNbeatsChart(await fetchImage('nbeats'))
    setTcnChart(await fetchImage('tcn'))
    setThetaChart(await fetchImage('theta'))
    setTftChart(await fetchImage('tft'))
    setTransChart(await fetchImage('trans'))
    setRnnChart(await fetchImage('rnn'))
    setBrnn0Chart(await fetchImage('brnn0'))
    setBrnn1Chart(await fetchImage('brnn1'))
    setBrnn2Chart(await fetchImage('brnn2'))
    setRegressionChart(await fetchImage('linregr'))
  }


  const getValidSub = async function getValidSubscription() {
    const isValid = await fetchIsValidSubscription()
    if (isValid == false) {
      setBlurOn("blur")
    } else {
      setBlurOn("noblur")
    }
    await fetchFee()
    await fetchApi()
    await fetchApiHistory()
    await getImages()

    console.log(datachart)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getValidSub()
    }, 10000);
    return () => clearInterval(interval);
  });

  // Activate blur on address disconnect
  useEffect(() => {
    if (!signer || !address) {
      setBlurOn("blur")
    }
  }, [signer, address])

  useEffect(() => {
    if (signer) {
      getValidSub()
    }
  }, [signer])

  useEffect(() => {
    getImages()
  }, [])

  return (
    <div className="flex flex-col items-baseline my-100 mx-20">
      {!isValidSubscription ?
        <div className="card  text-center justify-center w-2/4 mx-auto bg-primary rounded-md p-5 border-2 shadow-md shadow-black" >
          You are not subscribed to the forecast service.
          < br />
          Please subcribe to the forecast service to view the forecast.
          < br />
          Montly Fee: {formatEther(fee)} MATIC
          < br />
          < br />
          <a className="btn btn-ghost" href={tiersUrl}> Go to Subscription Page </a>
          <button className="btn btn-ghost" onClick={subscribe}> Subscribe </button>
        </div >
        : null}
      {data ? (
        <div className={blurOn}>
          <div className="">
            <div className="text-4xl my-10 text-left">
              <div className="text-5xl font-bold">BTC-USD</div>
              {data && (
                <div className="text-lg font-base">last update: {data.date}</div>
              )}
              {close_chart && (
                <div className=" my-10">{close_chart}</div>
              )}
              <div className="text-4xl font-bold">FORECAST</div>
              <div className="text-xl font-semibold">5 days</div>
              <div className="text-lg">Close Price: {data?.close_price ? Number(data.close_price).toFixed(2) : null}</div>
              <div className="text-lg text-left">
                selected model: {data['selected model']}
                <br />
                predicted trend: {data['prediction signal']}
              </div>
            </div>
            <br />

            <div className="grid md:grid-cols-2 gap-5 xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 my-auto mb-10">
              <div className=" my-10">
                <div className="text-2xl font-bold">Linear Regression</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.linear_regression_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.linear_regression_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.linear_regression_signal}
                  </div>
                )}
                {regression_chart && (
                  <div className=" my-10">{regression_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">Autoselect</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.autoselect_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.autoselect_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.autoselect_signal}
                  </div>
                )}
                {autoselect_chart && (
                  <div className=" my-10">{autoselect_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">Autoselect EMA5</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.autoselect_ema_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.autoselect_ema_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.autoselect_ema_signal}
                  </div>
                )}
                {autoselect_ema_chart && (
                  <div className=" my-10">{autoselect_ema_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">RNN</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.rnn_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.rnn_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.rnn_signal}
                  </div>
                )}
                {rnn_chart && (
                  <div className=" my-10">{rnn_chart}</div>
                )}
              </div>

              <div className=" my-10">
                <div className="text-2xl font-bold">NBEATS</div>
                {data && (
                  <div className="text-lg font-base">
                    prediction: {Number(data.nbeats_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.nbeats_MAPE).toFixed(2)}%
                    <br />
                    {data.nbeats_signal}
                  </div>
                )}
                {nbeats_chart && (
                  <div className=" my-10">{nbeats_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">TCN</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.tcn_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.tcn_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.tcn_signal}
                  </div>
                )}
                {tcn_chart && (
                  <div className=" my-10">{tcn_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">TRANS</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.trans_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.trans_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.trans_signal}
                  </div>
                )}
                {trans_chart && (
                  <div className=" my-10">{trans_chart}</div>
                )}
              </div>

              <div className=" my-10">
                <div className="text-2xl font-bold">THETA</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.theta_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.theta_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.theta_signal}
                  </div>
                )}
                {theta_chart && (
                  <div className=" my-10  border-black p-2">{theta_chart}</div>
                )}
              </div>

              <div className=" my-10">
                <div className="text-2xl font-bold">TFT</div>
                {data && (
                  <div className="text-lg font-base">
                    predicted: {Number(data.tft_predicted_5D).toFixed(2)}
                    <br />
                    MAPE: {Number(data.tft_MAPE).toFixed(2)}%
                    <br />
                    signal: {data.tft_signal}
                  </div>
                )}
                {tft_chart && (
                  <div className=" my-10">{tft_chart}</div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">BRNN</div>
                {data && (
                  <div className="text-lg font-base">
                    prediction: {Number(data.brnn_predicted_5D).toFixed(2)}
                    <br />
                    signal: {data.brnn_signal}
                  </div>
                )}
                <div className="my-10">
                  {brnn0_chart && (
                    <div className=" my-10">{brnn0_chart}</div>
                  )}
                  {brnn1_chart && (
                    <div className=" my-10">{brnn1_chart}</div>
                  )}
                  {brnn2_chart && (
                    <div className=" my-10">{brnn2_chart}</div>
                  )}
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold my-5">LAST SIGNALS</h1>

            <div className="text-4xl my-10 text-left overflow-hidden overflow-y-scroll h-80 mb-5">
              {dataHistory && (
                dataHistory.map((item, index) => (
                  <div className="text-2xl font-base">
                    ------------------------
                    <p>{item.date}: {item['prediction signal']}</p>
                    <p>selected model: {item['selected model']}</p>
                    <p>MAPE: {item[String(item['selected model']) + "_MAPE"]} %</p>
                  </div>

                ))
              )}
              <div className="grid md:grid-cols-2 gap-5 xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 my-auto mb-10">
                <div className="text-4xl my-10 text-left ">
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold m-5">TECHNICAL ANALYSIS</div>

            <div className="grid text-4xl sm:grid-cols md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 my-10 text-left ">
              <div className=" my-10">
                <div className="text-2xl font-bold">TREND FOLLOW</div>
                {data && (
                  <div className="text-lg font-base">
                    signal: {data.trend_signal}
                  </div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">EMA 20/150</div>
                {data && (
                  <div className="text-lg font-base">
                    signal ema cross: {data.signal_EMA}
                    <br />
                    EMA150: {Number(data.ema_150).toFixed(2)}
                    <br />
                    EMA50: {Number(data.ema_50).toFixed(2)}
                    <br />
                    EMA20: {Number(data.ema_20).toFixed(2)}
                    <br />
                    EMA5: {Number(data.ema_5).toFixed(2)}
                  </div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">RSI 10/60</div>
                {data && (
                  <div className="text-lg font-base">
                    signal rsi cross: {data.signal_RSI_CROSS}
                    <br />
                    RSI10 {data.signal_RSI_10}
                    <br />
                    {Number(data.rsi_10).toFixed(0)}
                    <br />
                    RSI60 {data.signal_RSI_60}
                    <br />
                    {Number(data.rsi_60).toFixed(0)}
                  </div>
                )}
              </div>
              <div className=" my-10">
                <div className="text-2xl font-bold">STOCHRSI</div>
                {data && (
                  <div className="text-lg font-base">
                    signal: {data['Signal_STOCK_CROSS']}
                    <br />
                    d signal: {data['signal_STOCK_RSI_D']}
                    <br />
                    {Number(data.stochastic_20D).toFixed(0)}
                    <br />
                    k signal: {data['signal_STOCK_RSI_K']}
                    <br />
                    {Number(data.stochastic_20K).toFixed(0)}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : null
      }
    </div >

  );
};

export default Forecast;


