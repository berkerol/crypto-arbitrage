/* global createElement */
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
    apiOrderBookAsksPath: 'data.asks'
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
    apiOrderBookAsksPath: 'asks'
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
    apiOrderBookAsksPath: 'result.a'
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
    apiOrderBookAsksPath: 'data.asks'
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
    apiOrderBookAsksPath: 'data.asks'
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
    apiOrderBookAsksPath: 'tick.asks'
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
    apiOrderBookAsksPath: 'asks'
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
    apiOrderBookAsksPath: 'data.asks'
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
    apiOrderBookAsksPath: 'data.asks'
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
    apiOrderBookAsksPath: 'asks'
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

const params = new URLSearchParams(window.location.search);
const symbols = params.has('symbols') ? params.get('symbols') : 'XAUT-USDT';
const wait = params.has('wait') ? params.get('wait') === 'true' : false;
if (symbols === 'all') {
  listAll(Object.keys(SYMBOLS), wait);
} else if (symbols.includes(',')) {
  listAll(symbols.split(','), wait);
} else {
  list(symbols);
}

async function listAll (symbols, wait) {
  for (const symbol of symbols) {
    if (wait) {
      await list(symbol);
    } else {
      list(symbol);
    }
  }
}

function getImageHtml (exchangeDetails) {
  const img = document.createElement('img');
  img.setAttribute('src', exchangeDetails.faviconUrl);
  img.setAttribute('width', 24);
  img.setAttribute('height', 24);
  return img.outerHTML;
}

function getBidOrAsk (path, res) {
  const bids = path.split('.').reduce((obj, key) => obj && obj[key], res);
  let bid = bids[0];
  if (Array.isArray(bid)) {
    bid = bid[0];
  }
  return bid;
}

async function list (symbol) {
  const h2 = createElement('h2', symbol, 'd-flex justify-content-center mt-3');
  document.getElementsByClassName('container')[0].appendChild(h2);
  const div = createElement('div', '', 'd-flex justify-content-center mt-3');
  document.getElementsByClassName('container')[0].appendChild(div);
  const table = createElement('table', '', 'table table-striped table-hover');
  const thead = document.createElement('thead');
  const trHeader = document.createElement('tr');
  trHeader.appendChild(createElement('th', 'Exchange'));
  trHeader.appendChild(createElement('th', 'Highest Sell'));
  trHeader.appendChild(createElement('th', 'Lowest Buy'));
  thead.appendChild(trHeader);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  div.appendChild(table);
  let highestSellExchange = '';
  let highestSellPrice = 0;
  let lowestBuyExchange = '';
  let lowestBuyPrice = 100000000;
  for (const exchange of SYMBOLS[symbol]) {
    const exchangeDetails = EXCHANGES[exchange];
    const tr = document.createElement('tr');
    const i = document.createElement('i');
    i.setAttribute('class', 'fas fa-external-link-alt');
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('href', `${exchangeDetails.webTradeUrl}${exchangeDetails.getWebTradeSymbol(symbol)}`);
    a.appendChild(i);
    const td = createElement('td', `${getImageHtml(exchangeDetails)} ${exchangeDetails.displayName} `);
    td.appendChild(a);
    tr.appendChild(td);
    const url = `${exchangeDetails.apiOrderBookUrl}${exchangeDetails.getApiOrderBookSymbol(symbol)}`;
    await window.fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })
      .then(res => {
        return res.json();
      })
      .then(res => {
        const bid = getBidOrAsk(exchangeDetails.apiOrderBookBidsPath, res);
        tr.appendChild(createElement('td', bid));
        if (bid > highestSellPrice) {
          highestSellExchange = exchange;
          highestSellPrice = bid;
        }
        const ask = getBidOrAsk(exchangeDetails.apiOrderBookAsksPath, res);
        tr.appendChild(createElement('td', ask));
        if (ask < lowestBuyPrice) {
          lowestBuyExchange = exchange;
          lowestBuyPrice = ask;
        }
        tbody.appendChild(tr);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
  const isArbitragePossible = highestSellPrice > lowestBuyPrice;
  const trSummary = createElement('tr', '', isArbitragePossible ? 'table-success' : 'table-danger');
  trSummary.appendChild(createElement('td', `Summary: ${isArbitragePossible ? 'possible arbitrage' : 'no arbitrage'}`));
  trSummary.appendChild(createElement('td', `${highestSellPrice} on ${getImageHtml(EXCHANGES[highestSellExchange])} ${EXCHANGES[highestSellExchange].displayName}`));
  trSummary.appendChild(createElement('td', `${lowestBuyPrice} on ${getImageHtml(EXCHANGES[lowestBuyExchange])} ${EXCHANGES[lowestBuyExchange].displayName}`));
  tbody.appendChild(trSummary);
}
