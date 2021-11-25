import fs from 'fs';
import {Trade} from '../src/models/Trade';

import {readTradesFromCsv} from '../src/services/TradesFromCsv';

test('read from csv', async () => {
  const filename = './test/trades.csv';

  const trades: Buffer = fs.readFileSync(filename);

  const portfolio: Trade[] = await readTradesFromCsv(trades);

  const epxtectedTrades = [
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/5/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/6/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/7/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    },
    {
      'amount': '25000', 'date': '1/4/17', 'price': '25', 'shares': '100',
      'symbol': 'APPL', 'tradeType': 'BUY',
    }];

  expect(portfolio).toEqual(epxtectedTrades);
});
