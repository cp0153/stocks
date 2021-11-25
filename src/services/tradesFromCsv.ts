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
  return await csvtojsonV2().fromString(csv);
}
