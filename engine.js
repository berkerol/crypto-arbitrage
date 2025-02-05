import { EXCHANGES, SYMBOLS } from './exchanges-and-symbols.js';

const PROFIT_THRESHOLD = 0.01;

async function sendRequest (fetch, url) {
  return (await fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })).json();
}

function getBidOrAsk (path, res) {
  return path.split('.').reduce((obj, key) => obj && obj[key], res);
}

async function getBidAndAskFromApi (fetch, symbol, exchangeDetails, exchangeApiDetails) {
  const url = `${exchangeDetails.apiUrl}${exchangeApiDetails.url}${exchangeDetails.getApiOrderBookSymbol(symbol)}${'parameters' in exchangeApiDetails ? exchangeApiDetails.parameters : ''}`;
  try {
    const res = await sendRequest(fetch, url);
    const bidPrice = getBidOrAsk(exchangeApiDetails.bidPricePath, res);
    const bidSize = getBidOrAsk(exchangeApiDetails.bidSizePath, res);
    const askPrice = getBidOrAsk(exchangeApiDetails.askPricePath, res);
    const askSize = getBidOrAsk(exchangeApiDetails.askSizePath, res);
    if (bidPrice && bidSize && askPrice && askSize) {
      return [bidPrice, bidSize, askPrice, askSize];
    }
    return null;
  } catch (error) {
    console.error(`Fetch error with ${symbol} and ${exchangeDetails.displayName}:`, error);
    return null;
  }
}

async function getBidAndAskFromExchange (fetch, symbol, exchangeDetails) {
  if ('apiOrderBookTicker' in exchangeDetails) {
    const bidAndAsk = await getBidAndAskFromApi(fetch, symbol, exchangeDetails, exchangeDetails.apiOrderBookTicker);
    if (bidAndAsk) {
      return bidAndAsk;
    }
  }
  return getBidAndAskFromApi(fetch, symbol, exchangeDetails, exchangeDetails.apiOrderBook);
}

async function getSymbolsFromExchange (fetch, exchangeDetails) {
  try {
    let res = await sendRequest(fetch, `${exchangeDetails.apiUrl}${exchangeDetails.apiSymbols.url}`);
    const symbolsPath = exchangeDetails.apiSymbols.symbolsPath;
    if (symbolsPath !== '') {
      let symbolsPathBeforeDot = symbolsPath;
      if (symbolsPath.indexOf('.') > 0) {
        symbolsPathBeforeDot = symbolsPath.substring(0, symbolsPath.indexOf('.'));
      }
      if (!(symbolsPathBeforeDot in res)) {
        console.error(`Fetch error with all symbols and ${exchangeDetails.displayName}:`, res);
        return [];
      }
      res = getBidOrAsk(symbolsPath, res);
    }
    if (exchangeDetails.displayName === 'Gate.io') {
      return res.filter(symbol => symbol.trade_status === 'tradable');
    }
    return res;
  } catch (error) {
    console.error(`Fetch error with all symbols and ${exchangeDetails.displayName}:`, error);
    return null;
  }
}

async function list (print, fetch, symbol) {
  await print(symbol);
  const result = {
    highestSell: {
      exchange: '',
      price: 0,
      size: 0
    },
    lowestBuy: {
      exchange: '',
      price: 100000000,
      size: 0
    },
    arbitrage: {
      state: 0 // 0: no arbitrage, 1: positive arbitrage, 2: positive profit, 3: positive profit with withdrawal
    }
  };
  for (const exchange of Object.keys(SYMBOLS[symbol])) {
    const exchangeDetails = EXCHANGES[exchange];
    const bidAndAsk = await getBidAndAskFromExchange(fetch, symbol, exchangeDetails);
    if (bidAndAsk !== null) {
      await print(symbol, exchangeDetails, bidAndAsk);
      const [bidPrice, bidSize, askPrice, askSize] = bidAndAsk;
      if (bidPrice > result.highestSell.price) {
        result.highestSell.exchange = exchangeDetails;
        result.highestSell.price = bidPrice;
        result.highestSell.size = bidSize;
      }
      if (askPrice < result.lowestBuy.price) {
        result.lowestBuy.exchange = exchangeDetails;
        result.lowestBuy.price = askPrice;
        result.lowestBuy.size = askSize;
      }
    }
  }
  if (result.highestSell.price > result.lowestBuy.price) {
    result.arbitrage.state = 1;
    result.arbitrage.differencePercentage = (result.highestSell.price - result.lowestBuy.price) / result.lowestBuy.price * 100;
    const totalFee = result.highestSell.exchange.fee + result.lowestBuy.exchange.fee;
    result.arbitrage.profitPercentage = result.arbitrage.differencePercentage - totalFee;
    result.arbitrage.minSize = Math.min(result.highestSell.size, result.lowestBuy.size);
    result.arbitrage.profit = result.arbitrage.profitPercentage * result.arbitrage.minSize / 100;
    if (result.arbitrage.profit > 0) {
      result.arbitrage.state = 2;
      result.arbitrage.withdrawalFee = SYMBOLS[symbol][result.lowestBuy.exchange] * result.lowestBuy.price;
      result.arbitrage.isWithdrawPossible = true;
      if (result.arbitrage.withdrawalFee < 0) {
        result.arbitrage.withdrawalFee = 0;
        result.arbitrage.isWithdrawPossible = false;
      }
      result.arbitrage.profitAfterWithdrawalFee = result.arbitrage.profit - result.arbitrage.withdrawalFee;
      if (result.arbitrage.profitAfterWithdrawalFee > PROFIT_THRESHOLD && result.arbitrage.isWithdrawPossible) {
        result.arbitrage.state = 3;
      }
    }
  }
  await print(symbol, 'Summary', result);
}

async function calculateProfit (printTriangularArbitrage, exchangeDetails, type, intermediate, coin, method, final, minSize, instructions) {
  if (isFinite(final)) {
    const difference = final - 1;
    const differencePercentage = difference * 100;
    const profitPercentage = differencePercentage - 3 * exchangeDetails.fee;
    const profit = profitPercentage * minSize / 100;
    if (profit > PROFIT_THRESHOLD) {
      await printTriangularArbitrage(exchangeDetails, type, intermediate, coin, method, differencePercentage, profitPercentage, profit, minSize, instructions);
    }
  }
}

async function listTriangularArbitrage (printTriangularArbitrage, fetch, exchange, isIntermediateCoin, base, intm, symbols) {
  const baseIntmBidAndAsk = !isIntermediateCoin ? await getBidAndAskFromExchange(fetch, `${base}-${intm}`, exchange) : [];
  const intmBaseBidAndAsk = isIntermediateCoin ? await getBidAndAskFromExchange(fetch, `${intm}-${base}`, exchange) : [];
  for (const symbol of symbols) {
    if (symbol[exchange.apiSymbols.baseAsset] !== base && symbol[exchange.apiSymbols.quoteAsset] === intm) {
      const trgt = symbol[exchange.apiSymbols.baseAsset];
      const trgtBaseBidAndAsk = await getBidAndAskFromExchange(fetch, `${trgt}-${base}`, exchange);
      const trgtIntmBidAndAsk = await getBidAndAskFromExchange(fetch, `${trgt}-${intm}`, exchange);
      if ((isIntermediateCoin || baseIntmBidAndAsk) && (!isIntermediateCoin || intmBaseBidAndAsk) && trgtBaseBidAndAsk && trgtIntmBidAndAsk) {
        const [trgtBaseBidPrice, trgtBaseBidSize, trgtBaseAskPrice, trgtBaseAskSize] = trgtBaseBidAndAsk;
        const [trgtIntmBidPrice, trgtIntmBidSize, trgtIntmAskPrice, trgtIntmAskSize] = trgtIntmBidAndAsk;
        const [baseIntmBidPrice, baseIntmBidSize, baseIntmAskPrice, baseIntmAskSize] = baseIntmBidAndAsk;
        const [intmBaseBidPrice, intmBaseBidSize, intmBaseAskPrice, intmBaseAskSize] = intmBaseBidAndAsk;
        let final1 = 1 // Start with 1 USDT
        // eslint-disable-next-line operator-linebreak
          / trgtBaseAskPrice // Buy COIN with USDT
        // eslint-disable-next-line operator-linebreak
          * trgtIntmBidPrice; // Sell COIN for TRY/BNB
        final1 = !isIntermediateCoin
          ? final1 / baseIntmAskPrice // Buy USDT with TRY
          : final1 * intmBaseBidPrice; // Sell BNB for USDT
        let size1 = !isIntermediateCoin
          ? baseIntmAskSize
          : intmBaseBidSize * intmBaseBidPrice;
        const size1LastPart = !isIntermediateCoin
          ? 1 / baseIntmBidPrice
          : 1 * intmBaseBidPrice;
        size1 = Math.min(Math.min(trgtBaseAskSize * trgtBaseAskPrice, trgtIntmBidSize * trgtIntmBidPrice * size1LastPart, size1));
        let instructions1 = `Buy ${trgt} with ${base} from price ${trgtBaseAskPrice}<br>Sell ${trgt} for ${intm} from price ${trgtIntmBidPrice}<br>`;
        instructions1 += !isIntermediateCoin
          ? `Buy ${base} with ${intm} from price ${baseIntmAskPrice}`
          : `Sell ${intm} for ${base} from price ${intmBaseBidPrice}`;
        await calculateProfit(printTriangularArbitrage, exchange, !isIntermediateCoin ? 'currency' : 'intermediate coin', intm, trgt, 'method1', final1, size1, instructions1);
        let final2 = !isIntermediateCoin // Start with 1 USDT
          ? 1 * baseIntmBidPrice // Sell USDT for TRY
          : 1 / intmBaseAskPrice; // Buy BNB with USDT
        final2 = final2
        // eslint-disable-next-line operator-linebreak
          / trgtIntmAskPrice // Buy COIN with TRY/BNB
        // eslint-disable-next-line operator-linebreak
          * trgtBaseBidPrice; // Sell COIN for USDT
        let size2 = !isIntermediateCoin
          ? baseIntmBidSize
          : intmBaseAskSize * intmBaseAskPrice;
        const size2LastPart = !isIntermediateCoin
          ? 1 / baseIntmAskPrice
          : 1 * intmBaseAskPrice;
        size2 = Math.min(Math.min(size2, trgtIntmAskSize * trgtIntmAskPrice * size2LastPart), trgtBaseBidSize * trgtBaseBidPrice);
        let instructions2 = !isIntermediateCoin
          ? `Sell ${base} for ${intm} from price ${baseIntmBidPrice}`
          : `Buy ${intm} with ${base} from price ${intmBaseAskPrice}`;
        instructions2 += `<br>Buy ${trgt} with ${intm} from price ${trgtIntmAskPrice}<br>Sell ${trgt} for ${base} from price ${trgtBaseBidPrice}`;
        await calculateProfit(printTriangularArbitrage, exchange, !isIntermediateCoin ? 'currency' : 'intermediate coin', intm, trgt, 'method2', final2, size2, instructions2);
      }
    }
  }
}

async function importDependencies () {
  let importPath = 'crypto-arbitrage.js';
  let fetch;
  if (typeof window === 'undefined') {
    importPath = 'app.js';
    fetch = (await import('node-fetch')).default;
  } else {
    fetch = window.fetch;
  }
  const { printTriangularArbitrage, print } = await import(`./${importPath}`);
  return [fetch, print, printTriangularArbitrage];
}

async function listAll (symbols, wait) {
  const [fetch, print] = await importDependencies();
  for (const symbol of symbols) {
    if (wait) {
      await list(print, fetch, symbol);
    } else {
      list(print, fetch, symbol);
    }
  }
}

async function listAllTriangularArbitrage () {
  const [fetch, _, printTriangularArbitrage] = await importDependencies(); // eslint-disable-line no-unused-vars
  printTriangularArbitrage('started');
  const promises = [];
  for (const exchange of Object.values(EXCHANGES)) {
    if ('apiSymbols' in exchange) {
      const symbols = await getSymbolsFromExchange(fetch, exchange);
      for (const currency of exchange.apiSymbols.currencies) {
        promises.push(listTriangularArbitrage(printTriangularArbitrage, fetch, exchange, false, 'USDT', currency, symbols));
      }
      for (const intermediateCoin of exchange.apiSymbols.intermediateCoins) {
        promises.push(listTriangularArbitrage(printTriangularArbitrage, fetch, exchange, true, 'USDT', intermediateCoin, symbols));
      }
    }
  }
  await Promise.all(promises);
  printTriangularArbitrage('finished');
}

export { listAll, listAllTriangularArbitrage };
