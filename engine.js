/* eslint-disable no-unused-vars */
// BIDS: buyers, green, highest to lowest
// ASKS: sellers, red, lowest to highest
const EXCHANGES = {
  pionex: {
    faviconUrl: 'https://www.pionex.com/favicon.ico',
    displayName: 'Pionex',
    webTradeUrl: 'https://www.pionex.com/en/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiUrl: 'https://api.pionex.com',
    apiOrderBookTicker: {
      url: '/api/v1/market/bookTickers?symbol=',
      bidPricePath: 'data.tickers.0.bidPrice',
      bidSizePath: 'data.tickers.0.bidSize',
      askPricePath: 'data.tickers.0.askPrice',
      askSizePath: 'data.tickers.0.askSize'
    },
    apiOrderBook: {
      url: '/api/v1/market/depth?limit=1&symbol=',
      bidPricePath: 'data.bids.0.0',
      bidSizePath: 'data.bids.0.1',
      askPricePath: 'data.asks.0.0',
      askSizePath: 'data.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    fee: 0.05
  },
  binance: {
    faviconUrl: 'https://bin.bnbstatic.com/static/images/common/favicon.ico',
    displayName: 'Binance',
    webTradeUrl: 'https://www.binance.com/en/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiUrl: 'https://api.binance.com',
    apiOrderBookTicker: {
      url: '/api/v3/ticker/bookTicker?symbol=',
      bidPricePath: 'bidPrice',
      bidSizePath: 'bidQty',
      askPricePath: 'askPrice',
      askSizePath: 'askQty'
    },
    apiOrderBook: {
      url: '/api/v3/depth?limit=1&symbol=',
      bidPricePath: 'bids.0.0',
      bidSizePath: 'bids.0.1',
      askPricePath: 'asks.0.0',
      askSizePath: 'asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    fee: 0.1
  },
  bybit: {
    faviconUrl: 'https://www.bybit.com/favicon.ico',
    displayName: 'Bybit',
    webTradeUrl: 'https://www.bybit.com/en/trade/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('/');
    },
    apiUrl: 'https://api.bybit.com',
    apiOrderBookTicker: {
      url: '/v5/market/tickers?category=spot&symbol=',
      bidPricePath: 'result.category.list.0.bid1Price',
      bidSizePath: 'result.category.list.0.bid1Size',
      askPricePath: 'result.category.list.0.ask1Price',
      askSizePath: 'result.category.list.0.ask1Size'
    },
    apiOrderBook: {
      url: '/v5/market/orderbook?category=spot&symbol=',
      bidPricePath: 'result.b.0.0',
      bidSizePath: 'result.b.0.1',
      askPricePath: 'result.a.0.0',
      askSizePath: 'result.a.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    fee: 0.1
  },
  bitget: {
    faviconUrl: 'https://www.bitget.com/baseasset/favicon4.png',
    displayName: 'Bitget',
    webTradeUrl: 'https://www.bitget.com/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    apiUrl: 'https://api.bitget.com',
    apiOrderBookTicker: {
      url: '/api/v2/spot/market/tickers?symbol=',
      bidPricePath: 'data.0.bidPr',
      bidSizePath: 'data.0.bidSz',
      askPricePath: 'data.0.askPr',
      askSizePath: 'data.0.askSz'
    },
    apiOrderBook: {
      url: '/api/v2/spot/market/orderbook?limit=1&symbol=',
      bidPricePath: 'data.bids.0.0',
      bidSizePath: 'data.bids.0.1',
      askPricePath: 'data.asks.0.0',
      askSizePath: 'data.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    fee: 0.1
  },
  kucoin: {
    faviconUrl: 'https://www.kucoin.com/logo.png',
    displayName: 'KuCoin',
    webTradeUrl: 'https://www.kucoin.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol;
    },
    apiUrl: 'https://api.kucoin.com',
    apiOrderBookTicker: {
      url: '/api/v1/market/orderbook/level1?symbol=',
      bidPricePath: 'data.bestBid',
      bidSizePath: 'data.bestBidSize',
      askPricePath: 'data.bestAsk',
      askSizePath: 'data.bestAskSize'
    },
    apiOrderBook: {
      url: '/api/v1/market/orderbook/level2_20?symbol=',
      bidPricePath: 'data.bids.0.0',
      bidSizePath: 'data.bids.0.1',
      askPricePath: 'data.asks.0.0',
      askSizePath: 'data.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol;
    },
    fee: 0.1
  },
  htx: {
    faviconUrl: 'https://hbg-fed-static-prd.hbfile.net/enmarket/favicon.ico?exchange',
    displayName: 'HTX',
    webTradeUrl: 'https://www.htx.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_').toLowerCase();
    },
    apiUrl: 'https://api.huobi.pro',
    apiOrderBookTicker: {
      url: '/market/detail/merged?symbol=',
      bidPricePath: 'tick.bid.0',
      bidSizePath: 'tick.bid.1',
      askPricePath: 'tick.ask.0',
      askSizePath: 'tick.ask.1'
    },
    apiOrderBook: {
      url: '/market/depth?type=step0&depth=5&symbol=',
      bidPricePath: 'tick.bids.0.0',
      bidSizePath: 'tick.bids.0.1',
      askPricePath: 'tick.asks.0.0',
      askSizePath: 'tick.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('').toLowerCase();
    },
    fee: 0.2
  },
  gateio: {
    faviconUrl: 'https://www.gate.io/favicon.ico',
    displayName: 'Gate.io',
    webTradeUrl: 'https://www.gate.io/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiUrl: 'https://api.gateio.ws',
    apiOrderBookTicker: {
      url: '/api/v4/spot/tickers?currency_pair=',
      bidPricePath: '0.highest_bid',
      bidSizePath: '0.highest_size',
      askPricePath: '0.lowest_ask',
      askSizePath: '0.lowest_size'
    },
    apiOrderBook: {
      url: '/api/v4/spot/order_book?limit=1&currency_pair=',
      bidPricePath: 'bids.0.0',
      bidSizePath: 'bids.0.1',
      askPricePath: 'asks.0.0',
      askSizePath: 'asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    fee: 0.1
  },
  bingx: {
    faviconUrl: 'https://bin.bb-os.com/favicon.png',
    displayName: 'BingX',
    webTradeUrl: 'https://bingx.com/en/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol;
    },
    apiUrl: 'https://open-api.bingx.com',
    apiOrderBookTicker: {
      url: '/openApi/spot/v1/ticker/bookTicker?symbol=',
      bidPricePath: 'data.0.bidPrice',
      bidSizePath: 'data.0.bidVolume',
      askPricePath: 'data.0.askPrice',
      askSizePath: 'data.0.askVolume'
    },
    apiOrderBook: {
      url: '/openApi/spot/v1/market/depth?limit=1&symbol=',
      bidPricePath: 'data.bids.0.0',
      bidSizePath: 'data.bids.0.1',
      askPricePath: 'data.asks.0.0',
      askSizePath: 'data.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol;
    },
    fee: 0.1
  },
  coinw: {
    faviconUrl: 'https://www.coinw.com/favicon.ico',
    displayName: 'CoinW',
    webTradeUrl: 'https://www.coinw.com/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('').toLowerCase();
    },
    apiUrl: 'https://api.coinw.com',
    apiOrderBook: {
      url: '/api/v1/public?command=returnOrderBook&symbol=',
      bidPricePath: 'data.bids.0.0',
      bidSizePath: 'data.bids.0.1',
      askPricePath: 'data.asks.0.0',
      askSizePath: 'data.asks.0.1'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    fee: 0.2
  },
  poloniex: {
    faviconUrl: 'https://poloniex.com/favicon.ico',
    displayName: 'Poloniex',
    webTradeUrl: 'https://poloniex.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiUrl: 'https://api.poloniex.com',
    apiOrderBookTicker: {
      url: '/markets/',
      parameters: '/ticker24h',
      bidPricePath: 'bid',
      bidSizePath: 'bidQuantity',
      askPricePath: 'ask',
      askSizePath: 'askQuantity'
    },
    apiOrderBook: {
      url: '/markets/',
      parameters: '/orderBook?limit=5',
      bidPricePath: 'bids.0',
      bidSizePath: 'bid.0', // doesn't exist
      askPricePath: 'asks.0',
      askSizePath: 'ask.0' // doesn't exist
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    fee: 0.2
  }
};

const SYMBOLS = {
  'CRO-USDT': ['pionex', 'bitget', 'kucoin', 'gateio'],
  'OKB-USDT': ['pionex', 'gateio', 'bingx', 'coinw', 'poloniex'],
  'USDE-USDT': ['bybit', 'bitget', 'kucoin', 'gateio', 'poloniex'],
  'DAI-USDT': ['pionex', 'bybit', 'bitget', 'htx', 'gateio', 'bingx', 'coinw', 'poloniex'],
  'FDUSD-USDT': ['binance', 'bitget', 'gateio', 'bingx'],
  'USDD-USDT': ['bybit', 'kucoin', 'htx', 'gateio', 'coinw', 'poloniex'],
  'PYUSD-USDT': ['bybit', 'bitget', 'kucoin', 'htx', 'gateio', 'bingx'],
  'TUSD-USDT': ['binance', 'bybit', 'bitget', 'kucoin', 'htx', 'gateio', 'bingx', 'poloniex'],
  'EURT-USDT': ['htx', 'gateio', 'bingx', 'coinw'],
  'XAUT-USDT': ['bitget', 'htx', 'gateio', 'bingx', 'coinw'],
  'PAXG-USDT': ['pionex', 'binance', 'bybit', 'bitget', 'kucoin', 'bingx', 'coinw']
};

const SYMBOL_GROUPS = {
  exchangeTokens: ['CRO-USDT', 'OKB-USDT'],
  stablecoins: ['USDE-USDT', 'DAI-USDT', 'FDUSD-USDT', 'USDD-USDT', 'PYUSD-USDT', 'TUSD-USDT', 'EURT-USDT'],
  goldCoins: ['XAUT-USDT', 'PAXG-USDT']
};

function getBidOrAsk (path, res) {
  return path.split('.').reduce((obj, key) => obj && obj[key], res);
}

async function sendRequest (url) {
  return (await window.fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })).json();
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
