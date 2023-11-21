# audit-bazaar-frontend

<!-- <p align="center">
  <img src="https://storage.googleapis.com/opensea-static/opensea-js-logo-updated.png" />
</p> -->

# AUDI BAZAAR <!-- omit in toc -->

A platform for decentralized projects/contracts auditing with reputation based systems.

- [Synopsis](#synopsis)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Wallet Connection](#wallet-connection)

## Synopsis

This is the FrontEnd project for auditBazaar a decentralized audit marketplace on Shibuya network.( A testnet of Astar Network).

It allows developers, project owners, arbiters, and auditors to come togeter on one platform to perform audits on projects in a decentralized manner. 
The functionalities allow the project owner to choose arbiter provider (auditBazaar by default) of their liking, and select auditors for their audits according to their reputation/pricing/duration.
If the results don't match the project owners' expectations, the arbiter providers will step in with randomly selected verified arbiters who will analyze the project's audit report with the expected deliverables.
The frontend will also be able to fetch the immutable details like reputation points of an auditor from blockchain itself.
 


## Installation & Running the project

There are two ways to run project : 
 1. Docker
 2. npm

1. Docker 
  1.1 If docker already installed skip this step, otherwise visit the official docker installation guide : https://docs.docker.com/engine/install/
  1.2 after successfull installation, run following commands
    => sudo docker build -t audit-bazar .
    => sudo docker run -dp 127.0.0.1:3000:3000 audit-bazar

2. npm 
  2.1 Switching to Node.js version 16 is required to make sure dependencies work. Execute `nvm use`, if you have Node Version Manager.
  2.2 Then, in your project, run:
     => npm install (install dependencies)
     => npm start



### Wallet Connection 
3. Sub Wallet
   
  3.1 Download Subwallet Extension for the Polkadot Wallet.
  
  3.2 Create a New Account.
  
  3.3 From Customize Your Asset Display OPTION Choose the Shibuya Testnet (Off the Rest Network).
  
  3.4 Your Wallet Address is ready to serve.
  
  3.5 While Creating a New Account select Only Non EVM Account.

### Testnet Fund 
4. Testnet Fund
   
  4.1 Visit https://portal.astar.network.
  
  4.2 Select Subwallet in Native Accounts Section And Connect Your SubWallet Account.
  
  4.3 Select The Network -> Shibuya Network -> Via Shibuya and Connect it.
  
  4.4 Click On Faucet to Get The Funds.

### Fund Your Wallet With Stablecoin token (Mock ERC20)
5. Token balance will enable the user to create a Post, select a bidder, submit an audit & and facilitate further transactions on the website.
   
   5.1 Deploy an ERC20 standard token.
   
   5.2 Add the token address in the src/constant.ts file.

   5.3 Replace the value of constant CONTRACT_ADDRESS_BID_TOKEN  with your deployed address.

