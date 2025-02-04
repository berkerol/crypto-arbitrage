/* global createElement createAlert */
import { SYMBOLS, SYMBOL_GROUPS } from './exchanges-and-symbols.js';
import { listAll, listAllTriangularArbitrage } from './engine.js';

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

function printTriangularArbitrage (exchangeDetails, type, intermediate, coin, method, differencePercentage, profitPercentage, profit, minSize, instructions) {
  if (exchangeDetails === 'started') {
    document.getElementById('searching').innerHTML = 'Searching';
  } else if (exchangeDetails === 'finished') {
    document.getElementById('searching').innerHTML = '';
  } else {
    const summary = `Profit found with exchange ${exchangeDetails.displayName} and ${type} ${intermediate} using coin ${coin} and ${method}<br>${differencePercentage.toFixed(2)}% difference and ${profitPercentage.toFixed(2)}% profit<br>${profit.toFixed(2)} profit from size ${minSize.toFixed(2)}<br>${instructions}`;
    createAlert('success', summary);
  }
}

function getImageHtml (exchangeDetails) {
  const img = document.createElement('img');
  img.setAttribute('src', exchangeDetails.faviconUrl);
  img.setAttribute('width', 24);
  img.setAttribute('height', 24);
  return img.outerHTML;
}

function print (symbol, exchangeDetails, details) {
  let tbody = document.getElementById(symbol);
  if (exchangeDetails === undefined) {
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
  } else if (exchangeDetails !== 'Summary') {
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
    let tableColor = 'table-danger';
    let summary = 'Summary: No arbitrage';
    if (details.arbitrage.state > 0) {
      tableColor = 'table-warning';
      summary = `Summary: Possible arbitrage with ${details.arbitrage.differencePercentage.toFixed(2)}% difference and ${details.arbitrage.profitPercentage.toFixed(2)}% profit`;
      if (details.arbitrage.state > 1) {
        tableColor = 'table-primary';
        summary += `<br>${details.arbitrage.profit.toFixed(2)} profit from size ${details.arbitrage.minSize.toFixed(2)}`;
        if (!details.arbitrage.isWithdrawPossible) {
          summary += '<br>Withdrawal not possible';
        }
      }
      if (details.arbitrage.state === 3) {
        tableColor = 'table-success';
        summary += `<br>Profit after withdrawal fee: ${details.arbitrage.profitAfterWithdrawalFee.toFixed(2)} with withdrawal fee: ${details.arbitrage.withdrawalFee.toFixed(2)}`;
      }
    }
    const trSummary = createElement('tr', '', tableColor);
    trSummary.appendChild(createElement('td', summary));
    trSummary.appendChild(createElement('td', `${details.highestSell.price} on ${getImageHtml(details.highestSell.exchange)} ${details.highestSell.exchange.displayName} with ${details.highestSell.exchange.fee}% fee`));
    trSummary.appendChild(createElement('td', `${details.lowestBuy.price} on ${getImageHtml(details.lowestBuy.exchange)} ${details.lowestBuy.exchange.displayName} with ${details.lowestBuy.exchange.fee}% fee`));
    tbody.appendChild(trSummary);
  }
}

export { printTriangularArbitrage, print };
