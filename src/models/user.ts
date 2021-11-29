import {ObjectId} from 'mongodb';
import {Position} from './Position';
import {Trade} from './Trade';

/**
 * user class
 */
export class User {
  name: string;
  budget: number = 100000.00;
  portfolio: Position[] = [];
  tradeHistory: Trade[] = [];
  public id?: ObjectId;

  /**
   * starts with initial name and positions
   * @param {string} name user name
   * @param {Trade[]} trades a list of the users trades
   * @param {ObjectId} id _id field if any
   */
  public constructor(name: string, trades: Trade[], id?: ObjectId) {
    this.name = name;
    this.tradeHistory = trades;
    this.generatePortfolio();
  }

  /**
   * generates portfolio positions from users trade history
   * @param {Trade[]} tradeHistory users initial trades
   */
  private generatePortfolio() {
    for (const trade of this.tradeHistory) {
      // console.log(trade);
      this.makeTrade(trade);
    }
  }

  /**
   * updates users positions and cash balance
   * @param {trade} trade trade
   */
  public makeTrade(trade: Trade) {
    if (trade.tradeType.toUpperCase() === 'BUY') {
      const costBasis = trade.price * trade.shares;
      if (this.budget - costBasis < 0) {
        throw Error('insufficient funds');
      } else {
        this.budget -= +costBasis;
      }

      for (const [i, pos] of this.portfolio.entries()) {
        // this position already exists update share balance
        if (pos.symbol === trade.symbol) {
          this.portfolio[i] = {
            symbol: pos.symbol,
            shares: +this.portfolio[i].shares + +trade.shares,
          };
          // console.log(this.portfolio[i]);
          return;
        }
      }
      this.portfolio.push({
        symbol: trade.symbol,
        shares: +trade.shares,
      });
      // sell
    } else {
      const costBasis = trade.price * trade.shares;
      this.budget += +costBasis;

      let found: boolean = false;
      for (const [i, pos] of this.portfolio.entries()) {
        // this position must exist and must have shares enough shares
        if (pos.symbol === trade.symbol) {
          if (pos.shares < trade.shares) {
            throw Error('insufficient shares');
          }
          this.portfolio[i] = {
            symbol: pos.symbol,
            shares: +this.portfolio[i].shares - +trade.shares,
          };
          found = true;
          return;
        }
      }
      if (!found) {
        throw Error('cant sell stock you dont have');
      }
    }
  }

  /**
   * returns everything in the class as an object
   * @return {object} document for db
   */
  public user(): object {
    return {
      name: this.name,
      budget: this.budget,
      portfolio: this.portfolio,
      tradeHistory: this.tradeHistory,
    };
  }
}
