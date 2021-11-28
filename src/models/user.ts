import {Position} from './Position';
import {Trade} from './Trade';
import {collections} from '../data/mongo';
import { DailyPriceData, Stock } from './Market';

/**
 * user class
 */
export class User {
  name: string;
  budget: number = 100000.00;
  portfolio: Position[] = [];
  tradeHistory: Trade[] = [];

  /**
   * starts with initial name and positions
   * @param {string} name user name
   * @param {Trade[]} trades a list of the users trades
   */
  public constructor(name: string, trades: Trade[]) {
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
      this.budget -= costBasis;

      // check if existing position, update if yes, create new position if no
      this.portfolio.find((existingPos, newTradeInfo) => {
        if (existingPos.symbol === trade.symbol) {
          this.portfolio[newTradeInfo] = {
            symbol: existingPos.symbol,
            shares: this.portfolio[newTradeInfo].shares + trade.shares,
          };
          return true; // stop searching
        } else {
          this.portfolio.push({
            symbol: existingPos.symbol,
            shares: trade.shares,
          });
        }
      });
    } else {
      const costBasis = trade.price * trade.shares;
      this.budget += costBasis;

      // update portfolio
      this.portfolio.find((existingPos, newTradeInfo) => {
        if (existingPos.symbol === trade.symbol) {
          this.portfolio[newTradeInfo] = {
            symbol: existingPos.symbol,
            shares: this.portfolio[newTradeInfo].shares - trade.shares,
          };
          return true;
        }
      });
    }
  }

  /**
   * calculates portfolio value
   * @param {Date} date date of portfolio evaluation
   * @return {number} value of portfolio on a certain day in 2017
   */
  public async evaluate(date: Date): Promise<number> {
    let portfolioValue = 0;
    const market = collections.market;
    if (market) {
      for (const position of this.portfolio) {
        console.log(position);
        // lookup price (low, high, open, close) based on day in market
        const query = {name: position.symbol};
        const positionValue = await market.findOne(query) as Stock;
        for (const price of positionValue.priceHistory) {
          if (price.date === date) {
            portfolioValue += price.high;
          }
        }
      }
      return portfolioValue;
    } else {
      throw Error('Database error');
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
