import Image from "next/image";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        {/* <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/nextjs/pages/index.tsx</code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract <code className="italic bg-base-300 text-base font-bold">YourContract.sol</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/hardhat/contracts</code>
          </p>
        </div> */}



        <div className="flex relative w-500 h-500 shadow-2xl shadow-black">
          <Image alt="SE2 logo" height={500} width={500} src="/logo.png" />
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="bg-gray-100 min-h-screen p-5">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img className="h-48 w-full object-cover md:w-48" src="https://cdn.pixabay.com/photo/2021/04/30/16/47/bitcoin-logo-6219385_1280.png" alt="A Bitcoin image" />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Welcome to Nimbus 2000</div>
                  <p className="block mt-1 text-lg leading-tight font-medium text-black">An open-source project dedicated to predicting Bitcoin prices.</p>
                  <p className="mt-2 text-gray-500">
                    I have developed this app using the OpenBB SDK to provide users with a feature-rich dashboard displaying results from various prediction models, such as linear regression, TCN, N-Beats, NHITS, and ARIMA and more.
                    <br /><br />
                    Through our Dashboard, you can freely explore the data and analyze market trends. My goal is to equip users with the necessary tools to make informed decisions in Bitcoin investment.
                    <br /><br />
                    To support the project and gain unrestricted access to the Dashboard, I offer a monthly subscription. This will grant you the freedom to leverage the app's full potential.
                    <br /><br />
                    Looking ahead, I am committed to developing a decentralized oracle that stores off-chain signals to further enhance our predictions. Additionally, I am working on creating an investment fund that utilizes the latest oracle results to make targeted Bitcoin investments.
                    <br /><br />
                    Nimbus 2000 is an ambitious project aiming to deliver more accurate price predictions and empower users with the necessary tools to capitalize on the cryptocurrency market. I am grateful for the support and enthusiasm of the open-source community, and I invite anyone interested to join me on this journey towards success in the world of cryptocurrencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
