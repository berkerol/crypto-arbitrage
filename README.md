# Crypto Arbitrage

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=berkerol_crypto-arbitrage&metric=alert_status)](https://sonarcloud.io/dashboard?id=berkerol_crypto-arbitrage)
[![CI](https://github.com/berkerol/crypto-arbitrage/actions/workflows/lint.yml/badge.svg?branch=master)](https://github.com/berkerol/crypto-arbitrage/actions/workflows/lint.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/berkerol/crypto-arbitrage/issues)
[![semistandard](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-latest-brightgreen.svg)](https://www.ecma-international.org/ecma-262)
[![license](https://img.shields.io/badge/license-GNU%20GPL%20v3.0-blue.svg)](https://github.com/berkerol/crypto-arbitrage/blob/master/LICENSE)

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

## Continous Integration

It is setup using GitHub Actions in `.github/workflows/lint.yml`

## Contribution

Feel free to [contribute](https://github.com/berkerol/crypto-arbitrage/issues) according to the [semistandard rules](https://github.com/Flet/semistandard) and [latest ECMAScript Specification](https://www.ecma-international.org/ecma-262).

## Distribution

You can distribute this software freely under [GNU GPL v3.0](https://github.com/berkerol/crypto-arbitrage/blob/master/LICENSE).
