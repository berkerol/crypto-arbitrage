/* global EXCHANGES SYMBOLS sendRequest print printTriangularArbitrage */
function getBidOrAsk (path, res) {
  return path.split('.').reduce((obj, key) => obj && obj[key], res);
}

async function getBidAndAskFromApi (symbol, exchangeDetails, exchangeApiDetails) {
  const url = `${exchangeDetails.apiUrl}${exchangeApiDetails.url}${exchangeDetails.getApiOrderBookSymbol(symbol)}${'parameters' in exchangeApiDetails ? exchangeApiDetails.parameters : ''}`;
  try {
    const res = await sendRequest(url);
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

async function getBidAndAskFromExchange (symbol, exchangeDetails) {
  if ('apiOrderBookTicker' in exchangeDetails) {
    const bidAndAsk = await getBidAndAskFromApi(symbol, exchangeDetails, exchangeDetails.apiOrderBookTicker);
    if (bidAndAsk) {
      return bidAndAsk;
    }
  }
  return getBidAndAskFromApi(symbol, exchangeDetails, exchangeDetails.apiOrderBook);
}

async function getSymbolsFromExchange (exchangeDetails) {
  try {
    let res = await sendRequest(`${exchangeDetails.apiUrl}${exchangeDetails.apiSymbols.url}`);
    if (exchangeDetails.apiSymbols.symbolsPath !== '') {
      res = getBidOrAsk(exchangeDetails.apiSymbols.symbolsPath, res);
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

async function list (symbol) {
  print(symbol);
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
    }
  };
  for (const exchange of Object.keys(SYMBOLS[symbol])) {
    const exchangeDetails = EXCHANGES[exchange];
    const bidAndAsk = await getBidAndAskFromExchange(symbol, exchangeDetails);
    if (bidAndAsk !== null) {
      print(symbol, exchange, bidAndAsk);
      const [bidPrice, bidSize, askPrice, askSize] = bidAndAsk;
      if (bidPrice > result.highestSell.price) {
        result.highestSell.exchange = exchange;
        result.highestSell.price = bidPrice;
        result.highestSell.size = bidSize;
      }
      if (askPrice < result.lowestBuy.price) {
        result.lowestBuy.exchange = exchange;
        result.lowestBuy.price = askPrice;
        result.lowestBuy.size = askSize;
      }
    }
  }
  print(symbol, 'Summary', result);
}

async function listTriangularArbitrage (exchange, isIntermediateCoin, base, intm, symbols) {
  const baseIntmBidAndAsk = !isIntermediateCoin ? await getBidAndAskFromExchange(`${base}-${intm}`, exchange) : [];
  const intmBaseBidAndAsk = isIntermediateCoin ? await getBidAndAskFromExchange(`${intm}-${base}`, exchange) : [];
  for (const symbol of symbols) {
    if (symbol[exchange.apiSymbols.baseAsset] !== base && symbol[exchange.apiSymbols.quoteAsset] === intm) {
      const trgt = symbol[exchange.apiSymbols.baseAsset];
      const trgtBaseBidAndAsk = await getBidAndAskFromExchange(`${trgt}-${base}`, exchange);
      const trgtIntmBidAndAsk = await getBidAndAskFromExchange(`${trgt}-${intm}`, exchange);
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
        printTriangularArbitrage(exchange, !isIntermediateCoin ? 'currency' : 'intermediate coin', intm, trgt, 'method1', final1, size1, instructions1);
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
        printTriangularArbitrage(exchange, !isIntermediateCoin ? 'currency' : 'intermediate coin', intm, trgt, 'method2', final2, size2, instructions2);
      }
    }
  }
}

async function listAll (symbols, wait) { // eslint-disable-line no-unused-vars
  for (const symbol of symbols) {
    if (wait) {
      await list(symbol);
    } else {
      list(symbol);
    }
  }
}

async function listAllTriangularArbitrage () { // eslint-disable-line no-unused-vars
  printTriangularArbitrage('started');
  const promises = [];
  for (const exchange of Object.values(EXCHANGES)) {
    if ('apiSymbols' in exchange) {
      const symbols = await getSymbolsFromExchange(exchange);
      for (const currency of exchange.apiSymbols.currencies) {
        promises.push(listTriangularArbitrage(exchange, false, 'USDT', currency, symbols));
      }
      for (const intermediateCoin of exchange.apiSymbols.intermediateCoins) {
        promises.push(listTriangularArbitrage(exchange, true, 'USDT', intermediateCoin, symbols));
      }
    }
  }
  await Promise.all(promises);
  printTriangularArbitrage('finished');
}
