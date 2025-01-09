/* global createElement */
const ORDER_BOOK_URLS = {
  pionex: 'https://api.pionex.com/api/v1/market/depth?symbol=',
  binance: 'https://api.binance.com/api/v3/depth?symbol=',
  bybit: 'https://api.bybit.com/v5/market/orderbook?category=spot&symbol=',
  bitget: 'https://api.bitget.com/api/v2/spot/market/orderbook?symbol=',
  kucoin: 'https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=',
  htx: 'https://api.huobi.pro/market/depth?type=step0&symbol=',
  gateio: 'https://api.gateio.ws/api/v4/spot/order_book?currency_pair=',
  bingx: 'https://open-api.bingx.com/openApi/spot/v1/market/depth?symbol=',
  coinw: 'https://api.coinw.com/api/v1/public?command=returnOrderBook&symbol='
};

const TRADE_URLS = {
  pionex: 'https://www.pionex.com/en/trade/',
  binance: 'https://www.binance.com/en/trade/',
  bybit: 'https://www.bybit.com/en/trade/spot/',
  bitget: 'https://www.bitget.com/spot/',
  kucoin: 'https://www.kucoin.com/trade/',
  htx: 'https://www.htx.com/trade/',
  gateio: 'https://www.gate.io/trade/',
  bingx: 'https://bingx.com/en/spot/',
  coinw: 'https://www.coinw.com/spot/'
};

// BIDS: buyers, green, highest to lowest
// ASKS: sellers, red, lowest to highest

const BIDS_PATHS = {
  pionex: 'data.bids',
  binance: 'bids',
  bybit: 'result.b',
  bitget: 'data.bids',
  kucoin: 'data.bids',
  htx: 'tick.bids',
  gateio: 'bids',
  bingx: 'data.bids',
  coinw: 'data.bids'
};

const ASKS_PATHS = {
  pionex: 'data.asks',
  binance: 'asks',
  bybit: 'result.a',
  bitget: 'data.asks',
  kucoin: 'data.asks',
  htx: 'tick.asks',
  gateio: 'asks',
  bingx: 'data.asks',
  coinw: 'data.asks'
};

const SYMBOLS = {
  'XAUT-USDT': {
    // pionex pair is not available in API
    bitget: 'XAUTUSDT',
    htx: 'xautusdt',
    gateio: 'XAUT_USDT',
    bingx: 'XAUT-USDT',
    coinw: 'XAUT_USDT'
  },
  'PAXG-USDT': {
    pionex: 'PAXG_USDT',
    binance: 'PAXGUSDT',
    bybit: 'PAXGUSDT',
    bitget: 'PAXGUSDT',
    kucoin: 'PAXG-USDT',
    bingx: 'PAXG-USDT',
    coinw: 'PAXG_USDT'
  }
};

const params = new URLSearchParams(window.location.search);
const symbol = params.has('symbol') ? params.get('symbol') : 'XAUT-USDT';
if (symbol === 'all') {
  listAll(false);
} else if (symbol === 'all-wait') {
  listAll(true);
} else {
  list(symbol);
}

async function listAll (wait) {
  for (const s in SYMBOLS) {
    if (wait) {
      await list(s);
    } else {
      list(s);
    }
  }
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
  const symbols = SYMBOLS[symbol];
  for (const exchange in symbols) {
    const tr = document.createElement('tr');
    const i = document.createElement('i');
    i.setAttribute('class', 'fas fa-external-link-alt');
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('href', `${TRADE_URLS[exchange]}${symbols[exchange]}`);
    a.appendChild(i);
    const td = createElement('td', `${exchange} `);
    td.appendChild(a);
    tr.appendChild(td);
    const url = `${ORDER_BOOK_URLS[exchange]}${symbols[exchange]}`;
    await window.fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })
      .then(res => {
        return res.json();
      })
      .then(res => {
        const bids = BIDS_PATHS[exchange].split('.').reduce((obj, key) => obj && obj[key], res);
        tr.appendChild(createElement('td', bids[0][0]));
        if (bids[0][0] > highestSellPrice) {
          highestSellExchange = exchange;
          highestSellPrice = bids[0][0];
        }
        const asks = ASKS_PATHS[exchange].split('.').reduce((obj, key) => obj && obj[key], res);
        tr.appendChild(createElement('td', asks[0][0]));
        if (asks[0][0] < lowestBuyPrice) {
          lowestBuyExchange = exchange;
          lowestBuyPrice = asks[0][0];
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
  trSummary.appendChild(createElement('td', `${highestSellPrice} on ${highestSellExchange}`));
  trSummary.appendChild(createElement('td', `${lowestBuyPrice} on ${lowestBuyExchange}`));
  tbody.appendChild(trSummary);
}
