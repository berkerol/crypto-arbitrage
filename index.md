# Crypto Arbitrage

List all crypto arbitrage opportunities. It is recommended to have a CORS extension in your browser otherwise some endpoints might not work so you will get fewer results.

There are 2 modes.

* Cross Exchange: This is the default mode. It checks for all coins in a predefined list with exchanges and their withdrawal fees. Since withdrawal fees are crucial for profit and and there is no automated way to check withdrawal fees, new coins (and their withdrawal fees) have to be added manually.
* Triangular: This is accessed by adding `?mode=triangular`. It checks for all coins available in an exchange automatically using either fiat currency or popular coins (BTC, ETH) as intermediary.

[![button](view.png)](https://berkerol.github.io/crypto-arbitrage/crypto-arbitrage.html)

For local development, you need to run `npx http-server . -p 9999` or any other server since using `type="module"` in HTML with a `file://` URL results in CORS errors.

There is also a Node.js project which can be run with `npm run start` (`node app.js`) that prints the results to the console (instead of web page). So `engine.js` and `exchanges-and-symbols.js` are used by both `crypto-arbitrage.js` (web page) and `app.js` (Node.js).
