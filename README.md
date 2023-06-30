# Nimbus 2000

<div align="left">

<figure><img src="https://nimbus2000.vercel.app/_next/image?url=%2Flogo.png&#x26;w=640&#x26;q=75&#x26;dpl=dpl_CnwfmbE1JfLtMiueQDzCvzzfCHQY" alt="" width="375"><figcaption></figcaption></figure>

</div>

What is this?

Nimbus 2000 is an ambitious project aiming to deliver more accurate price predictions for the cryptocurrency market. It leverages the [OpenBB SDK](https://github.com/OpenBB/OpenBB) to provide users with a feature-rich dashboard displaying results from various prediction models, including linear regression, TCN, N-Beats, NHITS, ARIMA and more.

### Project Structure

The project is structured into two main repositories:

* **nimbus-2000-backend**: This repository contains Python scripts responsible for performing prediction model calculations using the OpenAI SDK. The backend utilizes Flask, a web framework, to make the prediction data publicly available in an encrypted format. The backend application runs on a virtual machine, handling the computational aspects of the project.
* **nimbus-2000-ui**: This repository is a decentralized application (DApp) built on the scaffold-eth framework. The DApp fetches the prediction model data from the nimbus-2000-backend and displays it to the users. It also includes the necessary smart contracts for the application's functionality. Access to the DApp requires a subscription, which is facilitated through a separate protocol. To subscribe, users can visit the provided address: [https://tiersapp.vercel.app/](https://tiersapp.vercel.app/).

Within the nimbus-2000-ui repository, you can also find the smart contracts related to the Nimbus 2000 fund. These smart contracts govern the operations of the fund, allowing users to deposit USDC and receive NIM2000 tokens in return. Additionally, there is an oracle script included in this repository, which is responsible for updating the on-chain data by querying the prediction models and triggering necessary transactions.

To summarize, the nimbus-2000-backend repository contains Python scripts for prediction model calculations, while the nimbus-2000-ui repository houses the DApp, smart contracts for the fund, and the oracle script for on-chain data updates.

### Features

One of the key features of Nimbus is its integration with an on-chain oracle. This oracle serves as a signal recorder, storing information within the Polygon blockchain. Users can participate in the project by depositing USDC into the fund, which in turn grants them NIM2000 tokens. The fund operates through a simple mechanism of buying and selling Bitcoin (BTC) based on the signals provided by the oracle.

When the signal from the oracle indicates a "buy," the fund accumulates BTC by executing market purchases. Conversely, when the signal is "sell," the fund accumulates USDC to convert them into BTC when the signal changes. The oracle consists of a smart contract and an off-chain script. Its role is to query the AI model for predictions and store the information within the Polygon blockchain. Additionally, if the signal given by the AI model differs from the current signal of the NIM2000 fund, the oracle triggers a swap transaction (buy or sell) to align the fund's position with the new signal.

In simpler terms, Nimbus 2000 is a project that uses advanced prediction models to forecast cryptocurrency prices. By depositing USDC into the fund, users receive NIM2000 tokens and participate in a fund that automatically buys or sells BTC based on the predictions. The project uses an oracle to record and validate the signals given by the AI model, ensuring the fund's actions align with the most up-to-date predictions.

### Next Steps

* [x] Models
* [x] Dashboard
* [x] On chain Oracle
* [x] Decentralized Investment Fund - easy strategy

### Installation and Usage

#### Nimbus-2000-UI

To launch the user interface, follow these steps:

```
yarn
yarn start
```

You will need a `secret_key` to work locally on the Nimbus 2000 UI. If you're interested in collaborating to improve the frontend, feel free to contact me.

For specific instructions regarding the installation and usage of the nimbus-2000-backend repository, please contact me for further details.

### Contributing

Nimbus 2000 is an open-source project and welcomes contributions from anyone. If you're a developer interested in improving the backend algorithms, don't hesitate to contact me. If you're interested in contributing in any other way, feel free to fork the project and submit a Pull Request.

### License

Nimbus 2000 is released under the MIT license.

### Contacts

If you have any questions or suggestions, please feel free to reach out.
