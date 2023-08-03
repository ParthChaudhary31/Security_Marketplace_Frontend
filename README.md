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

This is the FrontEnd project for auditBazaar a decentralized audit marketplace on astar network.

It allows developers, project owners, arbiters, and auditors to come togeter on one platform to perform audits on projects in a decentralized manner. 
The functionalities allow the project owner to choose arbiter provider (auditBazaar by default) of their liking, and select auditors for their audits according to their reputation/pricing/duration.
If the results don't match the project owners' expectations, the arbiter providers will step in with randomly selected verified arbiters who will analyze the project's audit report with the expected deliverables.
The frontend will also be able to fetch the immutable details like reputation points of an auditor from blockchain itself.
 


## Installation & Running the project

There are two ways to run project : 

 1. Docker

 2. npm

## Docker

 1 If docker already installed skip this step, otherwise you need to install docker first, visit the official docker installation guide : https://docs.docker.com/engine/install/

 2 Make sure docker is up & running

 3 Once you are in root directory of the project folder (confirm by exuting command ls, you should be able to see two folders audit-bazaar-frontend & static_build_audit_bazaar) execute following steps

 4 cd audit-bazaar-frontend

 5 On command line run the command : npm install

 6 then run this command : npm run build

 7 Once the build is created, copy all the files and folders from the build folder and paste it to the build folder of static_build_audit_bazaar

 Now navigate to static_build_audit_bazaar folder 

 8 cd ..

 9 cd static_build_audit_bazaar

 10 On command line run this command : sudo docker build -t my-audit-bazaar-img .

 11 then run this command : sudo docker run -p 3000:3000 my-audit-bazaar-img

 1.12 Once the command executes (in success case, you will see "> node index.js" in your terminal) visit localhost:3000 in your browser, project should be up and running.

## npm

 1 Switching to Node.js version 16 is required to make sure dependencies work

 2 Then, in your project, run:

     => npm install

     => npm start

 3 visit localhost:3000 

### Wallet Connection 
We need to use Sub Wallet Extension for the Astar Chain