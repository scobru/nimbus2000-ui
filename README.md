# Page

##

##

## What is this?

Nimbus 2000 is an ambitious project aiming to deliver more accurate price predictions for the cryptocurrency market. It leverages the [OpenBB SDK](https://github.com/OpenBB/OpenBB) to provide users with a feature-rich dashboard displaying results from various prediction models, including linear regression, TCN, N-Beats, NHITS, ARIMA and more.



<div align="left">

<figure><img src="https://nimbus2000.vercel.app/_next/image?url=%2Flogo.png&#x26;w=640&#x26;q=75&#x26;dpl=dpl_CnwfmbE1JfLtMiueQDzCvzzfCHQY" alt="" width="375"><figcaption></figcaption></figure>

</div>

### Project Structure

The project is structured into two main repositories:

* **nimbus-2000-backend**: Contains Python scripts for performing prediction model calculations through the OpenAI SDK. A Flask application makes the data publicly available in an encrypted format. This application runs on a virtual machine.
* **nimbus-2000-ui**: A DApp based on[ scaffold-eth](https://github.com/scaffold-eth/scaffold-eth-2) that displays the prediction model data fetched from the backend and also includes the necessary smart contracts for the application. Accessing the DApp requires a subscription through a separate protocol, reachable at the following address: [https://tiersapp.vercel.app/](https://tiersapp.vercel.app/).

### Next Steps

* [x] Models&#x20;
* [x] Dashboard
* [ ] On chain Oracle
* [ ] Decentralized Investment Fund

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
