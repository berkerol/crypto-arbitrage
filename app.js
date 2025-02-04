import { SYMBOLS } from './exchanges-and-symbols.js';
import { listAll, listAllTriangularArbitrage } from './engine.js';

listAll(Object.keys(SYMBOLS));
listAllTriangularArbitrage();

function printTriangularArbitrage (exchangeDetails, type, intermediate, coin, method, differencePercentage, profitPercentage, profit, minSize, instructions) {
  if (exchangeDetails === 'started') {
    console.log('started');
  } else if (exchangeDetails === 'finished') {
    console.log('finished');
  } else {
    const summary = `Profit found with exchange ${exchangeDetails.displayName} and ${type} ${intermediate} using coin ${coin} and ${method}<br>${differencePercentage.toFixed(2)}% difference and ${profitPercentage.toFixed(2)}% profit<br>${profit.toFixed(2)} profit from size ${minSize.toFixed(2)}<br>${instructions}`;
    console.log(summary);
  }
}

function print (symbol, exchangeDetails, details) {
  if (exchangeDetails === undefined) {
    console.log(symbol);
  } else if (exchangeDetails !== 'Summary') {
    console.log(exchangeDetails.displayName);
    console.log(details);
  } else {
    console.log(details);
    if (details.arbitrage.state === 3) {
      const summary = `Profit found with buying ${symbol} on exchange ${details.lowestBuy.exchange.displayName} for ${details.lowestBuy.price} from size ${details.lowestBuy.size} and selling on exchange ${details.highestSell.exchange.displayName} for ${details.highestSell.price} from size ${details.highestSell.size}<br>${details.arbitrage.differencePercentage.toFixed(2)}% difference and ${details.arbitrage.profitPercentage.toFixed(2)}% profit<br>${details.arbitrage.profit.toFixed(2)} profit from size ${details.arbitrage.minSize.toFixed(2)}<br>Profit after withdrawal fee: ${details.arbitrage.profitAfterWithdrawalFee.toFixed(2)} with withdrawal fee: ${details.arbitrage.withdrawalFee.toFixed(2)}`;
      console.log(summary);
    }
  }
}

export { printTriangularArbitrage, print };
