import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import type { NextPage } from "next";
import { useAccount, useProvider, useSigner } from "wagmi";
import CryptoChart from "~~/components/CryptoChart";
import { useTransactor } from "~~/hooks/scaffold-eth";

const Data: NextPage = () => {
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
  const [nbeats_chart, setNbeatsChart] = useState<any>();
  const [tcn_chart, setTcnChart] = useState<any>();
  const [trans_chart, setTransChart] = useState<any>();
  const [theta_chart, setThetaChart] = useState<any>();
  const [tft_chart, setTftChart] = useState<any>();
  const [datachart, setDataChart]: any = useState<any>();
  const [dataHistory, setDataHistory]: any = useState<any>();

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
      const tx = await tiersContract?.subscribe({ value: fee });
      txData(tx.hash);
      console.log("tx", tx);
      return tx;
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

  return (
    <div className="flex items-baseline pt-10 flex-grow flex-col w-auto mx-auto">
      {!isValidSubscription ? (
        <div className="card font-medium leading-snug text-center justify-center mx-auto dark:dark:bg-trasparent rounded-md p- border-2 shadow-md shadow-black content-center text-trasparent-content ">
          You are not subscribed to the forecast service.
          <br />
          Please subcribe to the forecast service to view the dashboard.
          <br />
          ** Only for this month ** Montly Fee: {formatEther(fee)} MATIC
          <br />
          <br />
          <a className="btn btn-ghost" href={tiersUrl}>
            {" "}
            Go to Subscription Page{" "}
          </a>
          <button className="btn btn-ghost" disabled={String(isValidSubscription) == "true"} onClick={subscribe}>
            {" "}
            Subscribe{" "}
          </button>
        </div>
      ) : null}
      <div className="font-semibold my-5">**Data is fetched every 4 hours.</div>
      <br />
      {data ? (
        <div className={blurOn}>
          <div className="leading-tight">
            <div className="text-3xl font-bold mb-5 mx-10">CHARTS</div>
            <div className="dark:dark:bg-trasparent  rounded-md">
              <CryptoChart datachart={datachart} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 my-5 text-left dark:dark:bg-transparent  rounded-md text-transparent-content">
              <div className=" rounded-lg shadow-md p-6">
                <h1 className="text-4xl font-semibold mb-4">
                  BTC-USD {data && <span className="font-medium text-lg"></span>}
                </h1>
                last update: {data.date}
                {close_chart && <div className="my-10">{close_chart}</div>}
              </div>
              <div className=" rounded-lg shadow-md p-6">
                <div className="text-4xl font-bold my-5">SIGNAL</div>
                <div className="font-medium text-xl mb-2">5 days</div>
                <div className="text-2xl leading-relaxed text-left font-medium">
                  <div className="leading-tight">
                    Last: <strong>${data?.close_price ? Number(data.close_price).toFixed(2) : null}</strong>
                  </div>
                  <div>
                    Future: <strong>${data[String(data["selected model"]) + "_predicted_5D"]}</strong>
                  </div>
                  <div>
                    Model: <strong>{data["selected model"]}</strong>
                  </div>
                  <div>
                    Signal: <strong>{data["prediction signal"]}</strong>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <h1 className="text-4xl font-bold my-5 mx-10 ">FORECASTS</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 my-auto mb-10 dark:dark:bg-transparent text-transparent-content ">
              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">Linear Regression</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.linear_regression_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.linear_regression_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.linear_regression_signal}</p>
                  </div>
                )}
                {regression_chart && <div className="my-10">{regression_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">Autoselect</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.autoselect_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.autoselect_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.autoselect_signal}</p>
                  </div>
                )}
                {autoselect_chart && <div className="my-10">{autoselect_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">Autoselect EMA5</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.autoselect_ema_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.autoselect_ema_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.autoselect_ema_signal}</p>
                  </div>
                )}
                {autoselect_ema_chart && <div className="my-10">{autoselect_ema_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">RNN</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.rnn_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.rnn_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.rnn_signal}</p>
                  </div>
                )}
                {rnn_chart && <div className="my-10">{rnn_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">NBEATS</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.nbeats_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.nbeats_MAPE).toFixed(2)}%</p>
                    <p>{data.nbeats_signal}</p>
                  </div>
                )}
                {nbeats_chart && <div className="my-10">{nbeats_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">TCN</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.tcn_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.tcn_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.tcn_signal}</p>
                  </div>
                )}
                {tcn_chart && <div className="my-10">{tcn_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">TRANS</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.trans_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.trans_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.trans_signal}</p>
                  </div>
                )}
                {trans_chart && <div className="my-10">{trans_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">THETA</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.theta_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.theta_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.theta_signal}</p>
                  </div>
                )}
                {theta_chart && <div className="my-10">{theta_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">TFT</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Predicted: {Number(data.tft_predicted_5D).toFixed(2)}</p>
                    <p>MAPE: {Number(data.tft_MAPE).toFixed(2)}%</p>
                    <p>Signal: {data.tft_signal}</p>
                  </div>
                )}
                {tft_chart && <div className="my-10">{tft_chart}</div>}
              </div>

              <div className="leading-tight bg-trasparent dark:bg-trasparent dark:text-trasparent-content rounded-md p-6 shadow-md">
                <div className="text-2xl font-bold">BRNN</div>
                {data && (
                  <div className="text-lg font-medium mt-4">
                    <p>Prediction: {Number(data.brnn_predicted_5D).toFixed(2)}</p>
                    <p>Signal: {data.brnn_signal}</p>
                  </div>
                )}
                <div className="my-10">
                  {brnn0_chart && <div className="my-10">{brnn0_chart}</div>}
                  {brnn1_chart && <div className="my-10">{brnn1_chart}</div>}
                  {brnn2_chart && <div className="my-10">{brnn2_chart}</div>}
                </div>
              </div>
            </div>

            <div className="text-4xl font-bold my-10 mx-10">LAST SIGNAL</div>
            <div className="overflow-x-auto w-screen md:max-w-md lg:max-w-lg xl:max-w-xl">
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
                          <td className="py-2 px-4 border-b">{item["prediction signal"]}</td>
                          <td className="py-2 px-4 border-b">{item["selected model"]}</td>
                          <td className="py-2 px-4 border-b">{item[String(item["selected model"]) + "_MAPE"]}%</td>
                        </tr>
                      ),
                    )}
                </tbody>
              </table>
            </div>
            <div className="text-4xl font-bold my-10 mx-10">TECHNICAL ANALYSIS</div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 px-10">
              <div className="my-2">
                <div className="text-2xl font-bold">TREND FOLLOW</div>
                {data && (
                  <table className="text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>Signal:</td>
                        <td>{data.trend_signal}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold">EMA 20/150</div>
                {data && (
                  <table className="text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>Signal EMA Cross:</td>
                        <td>{data.signal_EMA}</td>
                      </tr>
                      <tr>
                        <td>EMA150:</td>
                        <td>{Number(data.ema_150).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>EMA50:</td>
                        <td>{Number(data.ema_50).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>EMA20:</td>
                        <td>{Number(data.ema_20).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>EMA5:</td>
                        <td>{Number(data.ema_5).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              <div className="my-5">
                <div className="text-2xl font-bold">RSI 10/60</div>
                {data && (
                  <table className="text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>Signal RSI Cross:</td>
                        <td>{data.signal_RSI_CROSS}</td>
                      </tr>
                      <tr>
                        <td>RSI10:</td>
                        <td>{data.signal_RSI_10}</td>
                      </tr>
                      <tr>
                        <td>RSI10 Value:</td>
                        <td>{Number(data.rsi_10).toFixed(0)}</td>
                      </tr>
                      <tr>
                        <td>RSI60:</td>
                        <td>{data.signal_RSI_60}</td>
                      </tr>
                      <tr>
                        <td>RSI60 Value:</td>
                        <td>{Number(data.rsi_60).toFixed(0)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className="my-5">
                <div className="text-2xl font-bold">STOCHRSI</div>
                {data && (
                  <table className="text-lg font-medium">
                    <tbody>
                      <tr>
                        <td>Signal Cross StockRSI:</td>
                        <td>{data["Signal_STOCK_CROSS"]}</td>
                      </tr>
                      <tr>
                        <td>D Signal:</td>
                        <td>{data["signal_STOCK_RSI_D"]}</td>
                      </tr>
                      <tr>
                        <td>D Signal Value:</td>
                        <td>{Number(data.stochastic_20D).toFixed(0)}</td>
                      </tr>
                      <tr>
                        <td>K Signal:</td>
                        <td>{data["signal_STOCK_RSI_K"]}</td>
                      </tr>
                      <tr>
                        <td>K Signal Value:</td>
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

export default Data;
