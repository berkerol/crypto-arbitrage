/* global EXCHANGES SYMBOLS SYMBOL_GROUPS listAll listAllTriangularArbitrage createElement createAlert */
const params = new URLSearchParams(window.location.search);
const mode = params.has('mode') ? params.get('mode') : '';
if (mode === 'triangular') {
  listAllTriangularArbitrage();
} else {
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
      listAll([symbols]);
    }
  }
}

async function sendRequest (url) { // eslint-disable-line no-unused-vars
  return (await window.fetch(url, { headers: { Origin: 'https://berkerol.github.io' } })).json();
}

function printTriangularArbitrage (exchangeDetails, type, intermediate, coin, method, final, minSize, instructions) { // eslint-disable-line no-unused-vars
  if (exchangeDetails === 'started') {
    document.getElementById('searching').innerHTML = 'Searching';
  } else if (exchangeDetails === 'finished') {
    document.getElementById('searching').innerHTML = '';
  } else {
    if (isFinite(final)) {
      const difference = final - 1;
      const differencePercentage = difference * 100;
      const profitPercentage = differencePercentage - 3 * exchangeDetails.fee;
      const profit = profitPercentage * minSize / 100;
      if (profit > 0) {
        const summary = `Profit found with exchange ${exchangeDetails.displayName} and ${type} ${intermediate} using coin ${coin} and ${method}<br>${differencePercentage.toFixed(2)}% difference and ${profitPercentage.toFixed(2)}% profit<br>${profit.toFixed(2)} profit from size ${minSize.toFixed(2)}<br>${instructions}`;
        createAlert('success', summary);
      }
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

function print (symbol, exchange, details) { // eslint-disable-line no-unused-vars
  let tbody = document.getElementById(symbol);
  if (exchange === undefined) {
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
    tbody = document.createElement('tbody');
    tbody.setAttribute('id', symbol);
    table.appendChild(tbody);
    div.appendChild(table);
  } else if (exchange !== 'Summary') {
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
    const [bidPrice, bidSize, askPrice, askSize] = details;
    tr.appendChild(createElement('td', `${bidPrice} with size ${bidSize}`));
    tr.appendChild(createElement('td', `${askPrice} with size ${askSize}`));
    tbody.appendChild(tr);
  } else {
    const highestSellExchangeDetails = EXCHANGES[details.highestSell.exchange];
    const lowestBuyExchangeDetails = EXCHANGES[details.lowestBuy.exchange];
    let tableColor = 'table-danger';
    let summary = 'Summary: No arbitrage';
    if (details.highestSell.price > details.lowestBuy.price) {
      const differencePercentage = (details.highestSell.price - details.lowestBuy.price) / details.lowestBuy.price * 100;
      const totalFee = highestSellExchangeDetails.fee + lowestBuyExchangeDetails.fee;
      const profitPercentage = differencePercentage - totalFee;
      const minSize = Math.min(details.highestSell.size, details.lowestBuy.size);
      const profit = profitPercentage * minSize / 100;
      let withdrawalFee = SYMBOLS[symbol][details.lowestBuy.exchange];
      let isWithdrawPossible = true;
      if (withdrawalFee === -1) {
        withdrawalFee = 0;
        isWithdrawPossible = false;
      } else {
        withdrawalFee *= details.lowestBuy.price;
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
    trSummary.appendChild(createElement('td', `${details.highestSell.price} on ${getImageHtml(highestSellExchangeDetails)} ${highestSellExchangeDetails.displayName} with ${highestSellExchangeDetails.fee}% fee`));
    trSummary.appendChild(createElement('td', `${details.lowestBuy.price} on ${getImageHtml(lowestBuyExchangeDetails)} ${lowestBuyExchangeDetails.displayName} with ${lowestBuyExchangeDetails.fee}% fee`));
    tbody.appendChild(trSummary);
  }
}
