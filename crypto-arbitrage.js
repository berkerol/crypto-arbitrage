/* global EXCHANGES SYMBOLS SYMBOL_GROUPS getBidAndAskFromExchange createElement */
const params = new URLSearchParams(window.location.search);
const symbols = params.has('symbols') ? params.get('symbols') : 'XAUT-USDT';
const symbolGroups = params.has('symbolGroups') ? params.get('symbolGroups') : '';
const wait = params.has('wait') ? params.get('wait') === 'true' : false;
if (symbolGroups !== '') {
  if (symbolGroups.includes(',')) {
    for (const symbolGroup of symbolGroups.split(',')) {
      listAll(SYMBOL_GROUPS[symbolGroup], wait);
    }
  } else {
    listAll(SYMBOL_GROUPS[symbolGroups], wait);
  }
} else {
  if (symbols === 'all') {
    listAll(Object.keys(SYMBOLS), wait);
  } else if (symbols.includes(',')) {
    listAll(symbols.split(','), wait);
  } else {
    list(symbols);
  }
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
  let highestSellSize = 0;
  let lowestBuyExchange = '';
  let lowestBuyPrice = 100000000;
  let lowestBuySize = 0;
  for (const exchange of Object.keys(SYMBOLS[symbol])) {
    const exchangeDetails = EXCHANGES[exchange];
    const bidAndAsk = await getBidAndAskFromExchange(symbol, exchangeDetails);
    if (bidAndAsk !== null) {
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
      const [bidPrice, bidSize, askPrice, askSize] = bidAndAsk;
      tr.appendChild(createElement('td', `${bidPrice} with size ${bidSize}`));
      if (bidPrice > highestSellPrice) {
        highestSellExchange = exchange;
        highestSellPrice = bidPrice;
        highestSellSize = bidSize;
      }
      tr.appendChild(createElement('td', `${askPrice} with size ${askSize}`));
      if (askPrice < lowestBuyPrice) {
        lowestBuyExchange = exchange;
        lowestBuyPrice = askPrice;
        lowestBuySize = askSize;
      }
      tbody.appendChild(tr);
    }
  }
  const highestSellExchangeDetails = EXCHANGES[highestSellExchange];
  const lowestBuyExchangeDetails = EXCHANGES[lowestBuyExchange];
  let tableColor = 'table-danger';
  let summary = 'Summary: No arbitrage';
  if (highestSellPrice > lowestBuyPrice) {
    const differencePercentage = (highestSellPrice - lowestBuyPrice) / lowestBuyPrice * 100;
    const totalFee = highestSellExchangeDetails.fee + lowestBuyExchangeDetails.fee;
    const profitPercentage = differencePercentage - totalFee;
    const minSize = Math.min(highestSellSize, lowestBuySize);
    const profit = profitPercentage * minSize / 100;
    let withdrawalFee = SYMBOLS[symbol][lowestBuyExchange];
    let isWithdrawPossible = true;
    if (withdrawalFee === -1) {
      withdrawalFee = 0;
      isWithdrawPossible = false;
    } else {
      withdrawalFee *= lowestBuyPrice;
    }
    const profitAfterWithdrawalFee = profit - withdrawalFee;
    tableColor = 'table-warning';
    summary = `Summary: Possible arbitrage with ${differencePercentage.toFixed(2)}% difference and ${profitPercentage.toFixed(2)}% profit`;
    if (profit > 0) {
      tableColor = 'table-primary';
      summary += `<br>${profit.toFixed(2)} profit from size ${minSize.toFixed(2)}`;
      if (!isWithdrawPossible) {
        summary += '<br>Withdrawal not possible';
      }
    }
    if (profitAfterWithdrawalFee > 0 && isWithdrawPossible) {
      tableColor = 'table-success';
      summary += `<br>Profit after withdrawal fee: ${profitAfterWithdrawalFee.toFixed(2)} with withdrawal fee: ${withdrawalFee.toFixed(2)}`;
    }
  }
  const trSummary = createElement('tr', '', tableColor);
  trSummary.appendChild(createElement('td', summary));
  trSummary.appendChild(createElement('td', `${highestSellPrice} on ${getImageHtml(highestSellExchangeDetails)} ${highestSellExchangeDetails.displayName} with ${highestSellExchangeDetails.fee}% fee`));
  trSummary.appendChild(createElement('td', `${lowestBuyPrice} on ${getImageHtml(lowestBuyExchangeDetails)} ${lowestBuyExchangeDetails.displayName} with ${lowestBuyExchangeDetails.fee}% fee`));
  tbody.appendChild(trSummary);
}
