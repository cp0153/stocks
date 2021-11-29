/* eslint-disable require-jsdoc */
import {ObjectId} from 'mongodb';

/**
 * top 100 stocks
 */
export class Stock {
  constructor(
      public name: string, // ticker symbol primary key for db
      public priceHistory: DailyPriceData[],
      public id?: ObjectId) {}
}

export interface DailyPriceData {
      date: string,
      open: number,
      high: number,
      low: number,
      close: number,
      volume: number,
}
