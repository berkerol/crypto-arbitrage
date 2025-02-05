import fetch from 'node-fetch';
import { SYMBOLS } from './exchanges-and-symbols.js';
import { listAll, listAllTriangularArbitrage } from './engine.js';

listAll(Object.keys(SYMBOLS));
listAllTriangularArbitrage();

async function sendTelegramMessage (message) {
  return (await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message }), headers: { 'Content-Type': 'application/json' } })).json();
}

async function printTriangularArbitrage (exchangeDetails, type, intermediate, coin, method, differencePercentage, profitPercentage, profit, minSize, instructions) {
  if (exchangeDetails === 'started') {
    console.log('started');
  } else if (exchangeDetails === 'finished') {
    console.log('finished');
  } else {
    const summary = `Profit found with exchange ${exchangeDetails.displayName} and ${type} ${intermediate} using coin ${coin} and ${method}\n${differencePercentage.toFixed(2)}% difference and ${profitPercentage.toFixed(2)}% profit\n${profit.toFixed(2)} profit from size ${minSize.toFixed(2)}\n${instructions.replaceAll('<br>', '\n')}`;
    console.log(summary);
    await sendTelegramMessage(summary);
  }
}

async function print (symbol, exchangeDetails, details) {
  if (exchangeDetails === undefined) {
    console.log(symbol);
  } else if (exchangeDetails !== 'Summary') {
    console.log(exchangeDetails.displayName);
    console.log(details);
  } else {
    console.log(details);
    if (details.arbitrage.state === 3) {
      const summary = `Profit found with buying ${symbol} on exchange ${details.lowestBuy.exchange.displayName} for ${details.lowestBuy.price} from size ${details.lowestBuy.size} and selling on exchange ${details.highestSell.exchange.displayName} for ${details.highestSell.price} from size ${details.highestSell.size}\n${details.arbitrage.differencePercentage.toFixed(2)}% difference and ${details.arbitrage.profitPercentage.toFixed(2)}% profit\n${details.arbitrage.profit.toFixed(2)} profit from size ${details.arbitrage.minSize.toFixed(2)}\nProfit after withdrawal fee: ${details.arbitrage.profitAfterWithdrawalFee.toFixed(2)} with withdrawal fee: ${details.arbitrage.withdrawalFee.toFixed(2)}`;
      console.log(summary);
      await sendTelegramMessage(summary);
    }
  }
}

export { printTriangularArbitrage, print };
