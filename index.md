# Crypto Arbitrage

List all crypto arbitrage opportunities. It is recommended to have a CORS extension in your browser otherwise some endpoints might not work so you will get fewer results.

There are 2 modes.

* **Cross Exchange**: This is the default mode. It checks for all coins in a predefined list with exchanges and their withdrawal fees. Since withdrawal fees are crucial for profit and and there is no automated way to check withdrawal fees, new coins (and their withdrawal fees) have to be added manually.
* **Triangular**: This is accessed by adding `?mode=triangular`. It checks for all coins available in an exchange automatically using either fiat currency or popular coins (BTC, ETH) as intermediary.

[![button](view.png)](https://berkerol.github.io/crypto-arbitrage/crypto-arbitrage.html)

There are 2 ways to use it.

* `crypto-arbitrage.js`: Web page to view the results in the browser (button above)
* `app.js`: Node.js project that prints the results to the console

`engine.js` and `exchanges-and-symbols.js` are used by both `crypto-arbitrage.js` (web page) and `app.js` (Node.js).

## Web page (`crypto-arbitrage.js`)

### Usage

`npx http-server . -p 9999` or any other server since using `type="module"` in HTML with a `file://` URL results in CORS errors.

## Node.js (`app.js`)

### Installation

```sh
$ npm install
```

### Usage

```sh
$ npm run start # or node app.js
```
