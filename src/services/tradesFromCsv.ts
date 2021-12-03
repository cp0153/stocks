// import * as fs from 'fs';
// import * as path from 'path';
// import * as csv from 'fast-csv';
import csvtojsonV2 from 'csvtojson/v2';
import {Trade} from '../models/Trade';

/**
 * takes a csv file containing rows of trades
 * "price,date,tradeType,shares,symbol,amount"
 * @param {Buffer} file csv file
 */
export async function readTradesFromCsv(file: Buffer): Promise<Trade[]> {
  const csv = file.toString();
  const trades: Trade[] = await csvtojsonV2().fromString(csv);
  for (const trade of trades) {
    trade.date = new Date(trade.date);
    trade.price = Number(trade.price);
    trade.shares = Number(trade.shares);
    trade.symbol = String(trade.symbol);
    trade.tradeType = String(trade.tradeType);
  }
  return trades;
}
