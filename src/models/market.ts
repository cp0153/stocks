/* eslint-disable require-jsdoc */
import {ObjectId} from 'mongodb';

/**
 * top 100 stocks
 */
export interface Stock {
      name: string, // ticker symbol primary key for db
      priceHistory: DailyPriceData[],
      id?: ObjectId
}

export interface DailyPriceData {
      date: string,
      open: number,
      high: number,
      low: number,
      close: number,
      volume: number,
}
