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
    apiOrderBookUrl: 'https://api.pionex.com/api/v1/market/depth?symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookBidsPath: 'data.bids',
    apiOrderBookAsksPath: 'data.asks',
    fee: 0.05
  },
  binance: {
    faviconUrl: 'https://bin.bnbstatic.com/static/images/common/favicon.ico',
    displayName: 'Binance',
    webTradeUrl: 'https://www.binance.com/en/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookUrl: 'https://api.binance.com/api/v3/depth?symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    apiOrderBookBidsPath: 'bids',
    apiOrderBookAsksPath: 'asks',
    fee: 0.1
  },
  bybit: {
    faviconUrl: 'https://www.bybit.com/favicon.ico',
    displayName: 'Bybit',
    webTradeUrl: 'https://www.bybit.com/en/trade/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('/');
    },
    apiOrderBookUrl: 'https://api.bybit.com/v5/market/orderbook?category=spot&symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    apiOrderBookBidsPath: 'result.b',
    apiOrderBookAsksPath: 'result.a',
    fee: 0.1
  },
  bitget: {
    faviconUrl: 'https://www.bitget.com/baseasset/favicon4.png',
    displayName: 'Bitget',
    webTradeUrl: 'https://www.bitget.com/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    apiOrderBookUrl: 'https://api.bitget.com/api/v2/spot/market/orderbook?symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('');
    },
    apiOrderBookBidsPath: 'data.bids',
    apiOrderBookAsksPath: 'data.asks',
    fee: 0.1
  },
  kucoin: {
    faviconUrl: 'https://www.kucoin.com/logo.png',
    displayName: 'KuCoin',
    webTradeUrl: 'https://www.kucoin.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol;
    },
    apiOrderBookUrl: 'https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol;
    },
    apiOrderBookBidsPath: 'data.bids',
    apiOrderBookAsksPath: 'data.asks',
    fee: 0.1
  },
  htx: {
    faviconUrl: 'https://hbg-fed-static-prd.hbfile.net/enmarket/favicon.ico?exchange',
    displayName: 'HTX',
    webTradeUrl: 'https://www.htx.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_').toLowerCase();
    },
    apiOrderBookUrl: 'https://api.huobi.pro/market/depth?type=step0&symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('').toLowerCase();
    },
    apiOrderBookBidsPath: 'tick.bids',
    apiOrderBookAsksPath: 'tick.asks',
    fee: 0.2
  },
  gateio: {
    faviconUrl: 'https://www.gate.io/favicon.ico',
    displayName: 'Gate.io',
    webTradeUrl: 'https://www.gate.io/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookUrl: 'https://api.gateio.ws/api/v4/spot/order_book?currency_pair=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookBidsPath: 'bids',
    apiOrderBookAsksPath: 'asks',
    fee: 0.1
  },
  bingx: {
    faviconUrl: 'https://bin.bb-os.com/favicon.png',
    displayName: 'BingX',
    webTradeUrl: 'https://bingx.com/en/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol;
    },
    apiOrderBookUrl: 'https://open-api.bingx.com/openApi/spot/v1/market/depth?symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol;
    },
    apiOrderBookBidsPath: 'data.bids',
    apiOrderBookAsksPath: 'data.asks',
    fee: 0.1
  },
  coinw: {
    faviconUrl: 'https://www.coinw.com/favicon.ico',
    displayName: 'CoinW',
    webTradeUrl: 'https://www.coinw.com/spot/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('').toLowerCase();
    },
    apiOrderBookUrl: 'https://api.coinw.com/api/v1/public?command=returnOrderBook&symbol=',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookBidsPath: 'data.bids',
    apiOrderBookAsksPath: 'data.asks',
    fee: 0.2
  },
  poloniex: {
    faviconUrl: 'https://poloniex.com/favicon.ico',
    displayName: 'Poloniex',
    webTradeUrl: 'https://poloniex.com/trade/',
    getWebTradeSymbol: function (symbol) {
      return symbol.split('-').join('_');
    },
    apiOrderBookUrl: 'https://api.poloniex.com/markets/',
    getApiOrderBookSymbol: function (symbol) {
      return symbol.split('-').join('_') + '/orderBook';
    },
    apiOrderBookBidsPath: 'bids',
    apiOrderBookAsksPath: 'asks',
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
  const bids = path.split('.').reduce((obj, key) => obj && obj[key], res);
  let bid = bids[0];
  if (Array.isArray(bid)) {
    bid = bid[0];
  }
  return bid;
}

async function getBidAndAskFromExchange (symbol, exchangeDetails) {
  const url = `${exchangeDetails.apiOrderBookUrl}${exchangeDetails.getApiOrderBookSymbol(symbol)}`;
  try {
    const res = await (await window.fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })).json();
    return [getBidOrAsk(exchangeDetails.apiOrderBookBidsPath, res), getBidOrAsk(exchangeDetails.apiOrderBookAsksPath, res)];
  } catch (error) {
    console.error(`Fetch error with ${symbol} and ${exchangeDetails.displayName}:`, error);
    return null;
  }
}
