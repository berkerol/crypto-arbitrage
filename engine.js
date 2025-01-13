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
    apiOrderBook: {
      url: '/api/v1/market/depth?limit=1&symbol=',
      bidPath: 'data.bids.0.0',
      askPath: 'data.asks.0.0'
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
    apiOrderBook: {
      url: '/api/v3/depth?limit=1&symbol=',
      bidPath: 'bids.0.0',
      askPath: 'asks.0.0'
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
    apiOrderBook: {
      url: '/v5/market/orderbook?category=spot&symbol=',
      bidPath: 'result.b.0.0',
      askPath: 'result.a.0.0'
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
    apiOrderBook: {
      url: '/api/v2/spot/market/orderbook?limit=1&symbol=',
      bidPath: 'data.bids.0.0',
      askPath: 'data.asks.0.0'
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
    apiOrderBook: {
      url: '/api/v1/market/orderbook/level2_20?symbol=',
      bidPath: 'data.bids.0.0',
      askPath: 'data.asks.0.0'
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
    apiOrderBook: {
      url: '/market/depth?type=step0&depth=5&symbol=',
      bidPath: 'tick.bids.0.0',
      askPath: 'tick.asks.0.0'
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
    apiOrderBook: {
      url: '/api/v4/spot/order_book?limit=1&currency_pair=',
      bidPath: 'bids.0.0',
      askPath: 'asks.0.0'
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
    apiOrderBook: {
      url: '/openApi/spot/v1/market/depth?limit=1&symbol=',
      bidPath: 'data.bids.0.0',
      askPath: 'data.asks.0.0'
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
      bidPath: 'data.bids.0.0',
      askPath: 'data.asks.0.0'
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
    apiOrderBook: {
      url: '/markets/',
      bidPath: 'bids.0',
      askPath: 'asks.0'
    },
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_') + '/orderBook?limit=5';
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

async function getBidAndAskFromExchange (symbol, exchangeDetails) {
  const url = `${exchangeDetails.apiUrl}${exchangeDetails.apiOrderBook.url}${exchangeDetails.getApiOrderBookSymbol(symbol)}`;
  try {
    const res = await sendRequest(url);
    return [getBidOrAsk(exchangeDetails.apiOrderBook.bidPath, res), getBidOrAsk(exchangeDetails.apiOrderBook.askPath, res)];
  } catch (error) {
    console.error(`Fetch error with ${symbol} and ${exchangeDetails.displayName}:`, error);
    return null;
  }
}
