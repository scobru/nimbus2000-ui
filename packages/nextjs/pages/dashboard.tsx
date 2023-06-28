import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import type { NextPage } from "next";
import { useAccount, useProvider, useSigner } from "wagmi";
import CryptoChart from "~~/components/CryptoChart";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { resourceLimits } from "worker_threads";

const Dashboard: NextPage = () => {
  const [data, setData]: any = useState<any>();
  const account = useAccount();
  const address = account ? account.address : "";
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [blurOn, setBlurOn] = useState("");
  const [fee, setFee] = useState(0);
  const [close_chart, setCloseChart] = useState<any>();
  const [regression_chart, setRegressionChart] = useState<any>();
  const [autoselect_chart, setAutoSelectChart] = useState<any>();
  const [autoselect_ema_chart, setAutoSelectEmaChart] = useState<any>();
  const [rnn_chart, setRnnChart] = useState<any>();
  const [brnn0_chart, setBrnn0Chart] = useState<any>();
  const [brnn1_chart, setBrnn1Chart] = useState<any>();
  const [brnn2_chart, setBrnn2Chart] = useState<any>();
  const [anom0_chart, setAnom0Chart] = useState<any>();
  const [anom1_chart, setAnom1Chart] = useState<any>();
  const [anom2_chart, setAnom2Chart] = useState<any>();
  const [nhits_chart, setNhitsChart] = useState<any>();
  const [nbeats_chart, setNbeatsChart] = useState<any>();
  const [tcn_chart, setTcnChart] = useState<any>();
  const [trans_chart, setTransChart] = useState<any>();
  const [theta_chart, setThetaChart] = useState<any>();
  const [tft_chart, setTftChart] = useState<any>();
  const [datachart, setDataChart]: any = useState<any>();
  const [dataHistory, setDataHistory]: any = useState<any>();
  const [regr_chart, setRegrChart] = useState<any>();

  const txData = useTransactor(signer as ethers.Signer);
  const tiersUrl = "https://tiersapp.vercel.app/viewTier?addr=0xCe61B3ECeF196E5818D85d682Fcc171A622b4c8B";
  const tiersAddress = "0xCe61B3ECeF196E5818D85d682Fcc171A622b4c8B";
  const tiersAbi = [
    "function getSubscriptionStatus(address _addr) public view returns (bool)",
    "function subscribe() public payable",
    "function fee() public view returns (uint256)",
  ];
  const tiersContract = new ethers.Contract(tiersAddress, tiersAbi, signer || provider);
  const [isValidSubscription, setIsValidSubscription] = useState(false);

  const fetchIsValidSubscription = async () => {
    if (tiersContract && address) {
      const isValid = await tiersContract?.getSubscriptionStatus(address);
      setIsValidSubscription(isValid);
      console.log("isValidSubscription", isValid);
      return isValid;
    }
  };

  const fetchFee = async () => {
    if (tiersContract) {
      const fee = await tiersContract?.fee();
      console.log("fee", fee);
      setFee(fee);
      return fee;
    }
  };

  const subscribe = async () => {
    if (tiersContract) {
      const result = txData(
        tiersContract?.subscribe({ value: fee })
      );
      console.log("tx", result);
      return result;
    }
  };

  const fetchImage = async (filename: string) => {
    console.log("fetching image" + filename);
    const url = process.env.NEXT_PUBLIC_API_URL + "image/" + filename;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      // const imageElement = document.createElement(filename);
      console.log("imageUrl" + filename, imageUrl);
      return (
        <div>
          <Image src={imageUrl} alt={filename} width={500} height={300} />
        </div>
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApiHistory = async () => {
    console.log("fetching data history");
    const url = process.env.NEXT_PUBLIC_API_URL + "data_history/";
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setDataHistory(data);
      console.log("data history", data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApiChart = async () => {
    console.log("fetching data chart");
    const url = process.env.NEXT_PUBLIC_API_URL + "data_chart/";
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // result is a cvs file convert in array
      const result = await response.json();
      const data = result.map((item: any) => {
        return {
          Date: item.Date,
          Close: item.Close,
          adj_data_autoselect: item.adj_data_autoselect,
          adj_data_linregr: item.adj_data_linregr,
          adj_data_nbeats: item.adj_data_nbeats,
          adj_data_rnn: item.adj_data_rnn,
          adj_data_tcn: item.adj_data_tcn,
          adj_data_tft: item.adj_data_tft,
          adj_data_theta: item.adj_data_theta,
          adj_data_trans: item.adj_data_trans,
          adj_date_autoselect_ema: item.adj_date_autoselect_ema,
          adj_data_brnn0: item.adj_data_brnn0,
          adj_data_brnn1: item.adj_data_brnn1,
          adj_data_brnn2: item.adj_data_brnn2,
          adj_data_nhits: item.adj_data_nhits,
          adj_data_regr: item.adj_data_regr,
          predicted_autoselect: item.predicted_autoselect,
          predicted_nbeats: item.predicted_nbeats,
          predicted_rnn: item.predicted_rnn,
          predicted_tcn: item.predicted_tcn,
          predicted_tft: item.predicted_tft,
          predicted_theta: item.predicted_theta,
          predicted_trans: item.predicted_trans,
          predicted_linregr: item.predicted_linregr,
          predicted_autoselect_ema: item.predicted_autoselect_ema,
          predicted_brnn0: item.predicted_brnn0,
          predicted_brnn1: item.predicted_brnn1,
          predicted_brnn2: item.predicted_brnn2,
          predicted_nhits: item.predicted_nhits,
          predicted_anom0: item.predicted_anom0,
          predicted_anom1: item.predicted_anom1,
          predicted_anom2: item.predicted_anom2,
          predicted_regr: item.predicted_regr,
        };
      });

      // Convert unix date to EU date
      data.forEach((item: any) => {
        item.Date = new Date(item.Date - 1000 * 1000).toLocaleDateString("fr-FR");
      });

      setDataChart(data);
      console.log("data chart", data);
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
          Authorization: String(process.env.NEXT_PUBLIC_API_SECRET_KEY),
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setData(data);
      console.log("data", data);
    } catch (error) {
      console.error(error);
    }
  };

  const getImages = async () => {
    setCloseChart(await fetchImage("close_chart"));
    setAutoSelectChart(await fetchImage("autoselect"));
    setAutoSelectEmaChart(await fetchImage("autoselect_ema"));
    setNbeatsChart(await fetchImage("nbeats"));
    setTcnChart(await fetchImage("tcn"));
    setThetaChart(await fetchImage("theta"));
    setTftChart(await fetchImage("tft"));
    setTransChart(await fetchImage("trans"));
    setRnnChart(await fetchImage("rnn"));
    setBrnn0Chart(await fetchImage("brnn0"));
    setBrnn1Chart(await fetchImage("brnn1"));
    setBrnn2Chart(await fetchImage("brnn2"));
    setRegressionChart(await fetchImage("linregr"));
    setAnom0Chart(await fetchImage("anom0"));
    setAnom1Chart(await fetchImage("anom1"));
    setAnom2Chart(await fetchImage("anom2"));
    setNhitsChart(await fetchImage("nhits"));
    setRegrChart(await fetchImage("regr"));
  };

  const getValidSub = async function getValidSubscription() {
    const isValid = await fetchIsValidSubscription();
    if (isValid == false || signer == null) {
      setBlurOn("blur");
    } else {
      setBlurOn("noblur");
    }
    if (!signer || !address) {
      setBlurOn("blur");
    }
    await fetchFee();
    await fetchApi();
    await fetchApiHistory();
    await fetchApiChart();
  };

  useEffect(() => {
    const checkValidSubscription = async () => {
      const isValid = await fetchIsValidSubscription();
      return isValid;
    };
    checkValidSubscription();
  }, [address, signer]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchValidSUb = async () => {
        await getValidSub();
      };
      fetchValidSUb();
    }, 5000);
    return () => clearInterval(interval);
  });

  // Activate blur on address disconnect
  useEffect(() => {
    const fetchValidSUb = async () => {
      await getValidSub();
    };
    fetchValidSUb();
  }, []);

  useEffect(() => {
    if (signer) {
      getValidSub();
    }
  }, [signer, address]);

  useEffect(() => {
    getImages();
  }, []);


  // Create a component with a button with a "sell" text inside
  const resultSignal = (signal: string) => {
    if (signal == "BUY") {
      return (
        <>
          <button className="text-green-300 bg-green-600 px-2 rounded-md text-sm font-medium">
            {signal}
          </button>
        </>)
    } else if (signal == "SELL") {
      return (
        <>
          <button className="text-red-300 bg-red-600 px-2 rounded-md text-sm font-medium">
            {signal}
          </button>
        </>
      )
    } else if (signal == "NEUTRAL") {
      return (
        <>
          <button className="text-yellow-300 bg-yellow-600 px-2 rounded-md text-sm font-medium">
            {signal}
          </button>
        </>
      )
    }
  };


  return (
    <div className="flex items-baseline pt-10 flex-grow flex-col w-auto mx-auto">
      {!isValidSubscription ? (
        <div className="card mx-auto shadow-lg rounded-xl dark:bg-transparent border-2 border-gray-300 p-5 text-center space-y-6">
          <h2 className="text-2xl font-semibold">Access Limited</h2>
          <p className="text-lg">Your access to the forecast service is currently restricted.</p>
          <p className="text-md">Subscribe to unlock the full dashboard functionality.</p>
          <div className="flex justify-center items-center space-x-4">
            <h4 className="text-lg font-bold">{`Monthly Fee: ${formatEther(fee)} MATIC`}</h4>
            <span className="text-md font-medium text-red-500">* Only for this month *</span>
          </div>
          <div className="mt-2">
            <a className="btn btn-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" href={tiersUrl}>
              Subscription Page
            </a>
          </div>
          <div className="mt-2">
            <button className="btn btn-secondary bg-gray-300 hover:bg-gray-500 text-gray-800 font-semibold py-2 px-4 rounded-full" disabled={String(isValidSubscription) === "true"} onClick={subscribe}>
              Subscribe
            </button>
          </div>
        </div>
      ) : null}


      <div className="font-semibold my-5">**Data is fetched every 4 hours.</div>
      <br />
      {data ? (
        <div className={blurOn}>
          <div className="leading-tight">
            <div className="text-6xl font-bold mb-5 px-5">CHARTS</div>
            <div className="dark:dark:bg-trasparent">
              <CryptoChart datachart={datachart} />
            </div>
            <div className="text-6xl font-bold my-10 px-5">SIGNAL</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 my-5 text-left dark:dark:bg-transparent rounded-md text-transparent-content">
              <div className="min-w-min">
                <h1 className="text-4xl font-semibold mb-4 px-5">
                  BTC-USD {data && <span className="font-medium text-lg"></span>}
                </h1>
                <div className=" rounded-lg px-5">
                  last update: {data.date}
                </div>
                {close_chart && <div className="my-10">{close_chart}</div>}
              </div>
              <div className=" rounded-lg px-5">
                <div className="font-medium text-xl mb-2">5 days</div>
                <div className="text-3xl leading-relaxed text-left font-medium">
                  <div className="mb-2">
                    Last: <strong>${data?.close_price ? Number(data.close_price).toFixed(2) : null}</strong>
                  </div>
                  <div className="mb-2">
                    Future: <strong>${data[String(data["selected model"]) + "_predicted_5D"]}</strong>
                  </div>
                  <div className="mb-2">
                    Model: <strong>{data["selected model"]}</strong>
                  </div>
                  <div className="mb-2">
                    Signal: <strong>{resultSignal(data["prediction signal"])}</strong>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="text-6xl font-bold my-20 mx-5">LAST SIGNAL</div>
            <div className="overflow-x-auto w-screen md:max-w-md lg:max-w-lg xl:max-w-xl my-20">
              <table className="table-compact">
                <thead>
                  <tr className="bg-neutral text-primary-content">
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Prediction Signal</th>
                    <th className="py-2 px-4 border-b">Selected Model</th>
                    <th className="py-2 px-4 border-b">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  {dataHistory &&
                    dataHistory.map(
                      (
                        item: {
                          [x: string]: any;
                          date:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                        },
                        index: React.Key | null | undefined,
                      ) => (
                        <tr key={index} className=" bg-trasparent">
                          <td className="py-2 px-4 border-b">{item.date}</td>
                          <td className="py-2 px-4 border-b">{resultSignal(item["prediction signal"])}</td>
                          <td className="py-2 px-4 border-b">{item["selected model"]}</td>
                          <td className="py-2 px-4 border-b">{item[String(item["selected model"]) + "_MAPE"]}%</td>
                        </tr>
                      ),
                    )}
                </tbody>
              </table>
            </div>
            <div className="text-6xl font-bold my-10 mx-5">FORECASTS</div>
            <div className="text-md font-thin my-10 mx-5">MAPE: Mean absolute percentage error
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 my-auto mb-10 dark:dark:bg-transparent text-transparent-content ">

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">LINEAR REGRESSION</div>

                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.linear_regression_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.linear_regression_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.linear_regression_signal)}</p>
                  </div>
                )}
                {regression_chart && <div className="my-10">{regression_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">REGRESSION</div>
                Regression Forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.regr_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.regr_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.regr_signal)}</p>
                  </div>
                )}
                {regr_chart && <div className="my-10">{regr_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">AUTOSELECT</div>
                Automatic Statistical forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.autoselect_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.autoselect_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.autoselect_signal)}</p>
                  </div>
                )}
                {autoselect_chart && <div className="my-10">{autoselect_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">AUTOSELECT EMA 5</div>
                Automatic Statistical forecasting based on EMA 5
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.autoselect_ema_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.autoselect_ema_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.autoselect_ema_signal)}</p>
                  </div>
                )}
                {autoselect_ema_chart && <div className="my-10">{autoselect_ema_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">RNN</div>
                RNN forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.rnn_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.rnn_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.rnn_signal)}</p>
                  </div>
                )}
                {rnn_chart && <div className="my-10">{rnn_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">NBEATS</div>
                NBEATS Forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.nbeats_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.nbeats_MAPE).toFixed(2)}%</p>
                    <p>{resultSignal(data.nbeats_signal)}</p>
                  </div>
                )}
                {nbeats_chart && <div className="my-10">{nbeats_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">TCN</div>
                TCN forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.tcn_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.tcn_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.tcn_signal)}</p>
                  </div>
                )}
                {tcn_chart && <div className="my-10">{tcn_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">TRANS</div>
                Transformer forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.trans_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.trans_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.trans_signal)}</p>
                  </div>
                )}
                {trans_chart && <div className="my-10">{trans_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">THETA</div>
                Theta forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.theta_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.theta_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.theta_signal)}</p>
                  </div>
                )}
                {theta_chart && <div className="my-10">{theta_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">TFT</div>
                Temporal Fusion Transformer forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.tft_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.tft_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.tft_signal)}</p>
                  </div>
                )}
                {tft_chart && <div className="my-10">{tft_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">BRNN</div>
                Block RNN forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Prediction: {Number(data.brnn_predicted_5D).toFixed(2)}</p>
                    <p>Signal: {resultSignal(data.brnn_signal)}</p>
                  </div>
                )}
                <div className="my-10">
                  {brnn0_chart && <div className="my-10">{brnn0_chart}</div>}
                  {brnn1_chart && <div className="my-10">{brnn1_chart}</div>}
                  {brnn2_chart && <div className="my-10">{brnn2_chart}</div>}
                </div>
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">ANOM</div>
                Quantile Anomaly Detection Data
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Prediction: {Number(data.anom_predicted_5D).toFixed(2)}</p>
                    <p>Signal: {resultSignal(data.signal_anom)}</p>
                  </div>
                )}
                <div className="my-10">
                  {anom0_chart && <div className="my-10">{anom0_chart}</div>}
                  {anom1_chart && <div className="my-10">{anom1_chart}</div>}
                  {anom2_chart && <div className="my-10">{anom2_chart}</div>}
                </div>
              </div>


              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 ">
                <div className="text-2xl font-bold">NHITS</div>
                Nhits forecasting
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.nhits_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.nhits_MAPE).toFixed(2)}%</p>
                    <p>Signal: {resultSignal(data.nhits_signal)}</p>
                  </div>
                )}
                {nhits_chart && <div className="my-10">{nhits_chart}</div>}
              </div>
            </div>
            <div className="text-6xl font-bold my-10 mx-5 ">TECHNICAL ANALYSIS</div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 px-5 my-20">
              <div className="my-2">
                <div className="text-2xl font-bold mb-5">TREND FOLLOW</div>
                {data && (
                  <table className="table-compact text-lg font-medium ">
                    <tbody>
                      <tr>
                        <td>TREND</td>
                        <td>{resultSignal(data.trend_signal)}</td>
                      </tr>

                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>

                      <tr>
                        <td>ATR</td>
                        <td>{resultSignal(data.signal_atr)}</td>
                      </tr>
                      <td>{Number(data.atr).toFixed(2)}</td>


                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>

                      <tr>
                        <td>ROC</td>
                        <td>{resultSignal(data.signal_roc)}</td>

                      </tr>
                      <td>{Number(data.roc).toFixed(2)}</td>


                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>


                      <tr>
                        <td>MOM</td>
                        <td>{resultSignal(data.signal_momentum)}</td>

                      </tr>
                      <td>{Number(data.mom).toFixed(2)}</td>

                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>

                      <tr>
                        <td>DELTA</td>
                        <td>{resultSignal(data.signal_delta)}</td>

                      </tr>
                      <td>{Number(data.delta).toFixed(6)}</td>

                    </tbody>
                  </table>
                )}
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold mb-5">EMA 21/150</div>
                {data && (
                  <table className="table-compact text-lg font-medium ">
                    <tbody>
                      <tr>
                        <td>EMA Cross</td>
                        <td>{resultSignal(data.signal_EMA)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>EMA150</td>
                        <td>{Number(data.ema_150).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>EMA50</td>
                        <td>{Number(data.ema_50).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>

                      <tr>
                        <td>EMA21</td>
                        <td>{Number(data.EMA_21).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>EMA5</td>
                        <td>{Number(data.ema_5).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className="my-5">
                <div className="text-2xl font-bold mb-5">RSI 10/60</div>
                {data && (
                  <table className="table-compact text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>RSI Cross</td>
                        <td>{resultSignal(data.signal_RSI_CROSS)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>RSI10</td>
                        <td>{resultSignal(data.signal_RSI_10)}</td>
                      </tr>
                      <tr>
                        <td>{Number(data.rsi_10).toFixed(0)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>RSI60</td>
                        <td>{resultSignal(data.signal_RSI_60)}</td>
                      </tr>
                      <tr>
                        <td>{Number(data.rsi_60).toFixed(0)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className="my-5">
                <div className="text-2xl font-bold mb-5">STOCHRSI</div>
                {data && (
                  <table className="table-compact text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>Cross StocRSI</td>
                        <td>{resultSignal(data["Signal_STOCK_CROSS"])}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>D</td>
                        <td>{resultSignal(data["signal_STOCK_RSI_D"])}</td>
                      </tr>
                      <tr>
                        <td>{Number(data.stochastic_20D).toFixed(0)}</td>
                      </tr>
                      <tr>
                        <td>*********</td>
                        <td>*********</td>

                      </tr>
                      <tr>
                        <td>K</td>
                        <td>{resultSignal(data["signal_STOCK_RSI_K"])}</td>
                      </tr>
                      <tr>
                        <td>{Number(data.stochastic_20K).toFixed(0)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
