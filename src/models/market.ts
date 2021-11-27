/* eslint-disable require-jsdoc */
import {ObjectId} from 'mongodb';

/**
 * top 100 stocks
 */
export default class Stock {
  constructor(
      date: Date,
      open: number,
      high: number,
      low: number,
      close: number,
      volume: number,
      name: string,
      public id?: ObjectId) {}
}
