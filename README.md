Coding challenge. Build with Node.js

Needs a valid Google Maps API key in order to work (key not commited to a public repository for satety)

How to use:

Download node js:
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
(if you are brave enough to pipe a curl into a sudo bash)

cd to the repo folder and use npm to download the following dependencies:
npm install request 
npm install url
npm intall axios

Now run node:
node http-server.js

The API is running and ready to go. You can use either your browser or the curl program to test the API

Some examples on how to use the API:

curl "http://localhost:3000/?locations=Boston;California;Tenesse;China;Brazil"

curl "http://localhost:3000/?locations=Av.+Rio+Branco,+1+Centro,+Rio+de+Janeiro+RJ,+20090003;+Pra%C3%A7a+Mal.+%C3%82ncora,+122+Centro,+Rio+de+Janeiro+RJ,+20021200;+Rua+19+de+Fevereiro,+34+Botafogo,+Rio+de+Janeiro+RJ,+22280030"
