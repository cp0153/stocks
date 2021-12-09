import {getStock} from '../data/mongo';
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

  /**
   * buy a stock
   * @param {Trade} trade trade
   */
  private buy(trade: Trade) {
    const costBasis = trade.price * trade.shares;
    if (this.budget - costBasis < 0) {
      throw Error(`insufficient funds have ${this.budget} need: ${costBasis}`);
    } else {
      this.budget -= costBasis;
    }

    for (const pos of this.portfolio) {
      if (pos.symbol === trade.symbol) {
        pos.shares += trade.shares;
        this.tradeHistory.push(trade);
        return;
      }
    }

    this.portfolio.push({
      symbol: trade.symbol,
      shares: trade.shares,
    });

    this.tradeHistory.push(trade);
  }

  /**
   * sell a stock
   * @param {Trade }trade being sold
   */
  private sell(trade: Trade) {
    let found: boolean = false;
    for (const pos of this.portfolio) {
      // this position must exist and must have shares enough shares
      if (pos.symbol === trade.symbol) {
        found = true;
        if (pos.shares < trade.shares) {
          throw Error('insufficient shares');
        } else {
          pos.shares -= trade.shares;
          this.tradeHistory.push(trade);
          return;
        }
      }
    }
    if (!found) {
      throw Error('cant sell stock you dont have');
    }
  }

  /**
   * make a trade
   * @param {Trade} trade to be processed
   */
  public trade(trade: Trade) {
    if (trade.tradeType === 'BUY') {
      this.buy(trade);
    } else if (trade.tradeType === 'SELL') {
      this.sell(trade);
    } else {
      throw Error(`invalid trade type ${trade.tradeType}`);
    }
  }

  /**
   * helper to evaluate portfolio values,
   * based on the high price of the selected date
   * @param {User} user user to be evaluated
   * @param {Date} date date of portfolio eval
   * @return {Promise<number>} value of portfolio in $$
   */
  public static async evaluate(user: User, date: string): Promise<number> {
    let portfolioValue = 0;
    const portfolio = user.portfolio;
    for (const pos of portfolio) {
      try {
        const stock = await getStock(pos.symbol);
        const priceHistory = stock.priceHistory;
        for (const day of priceHistory) {
          const historyDay = new Date(day.date).getTime();
          const timestamp = new Date(date).getTime();
          if (historyDay === timestamp) {
            portfolioValue += +day.high * +pos.shares;
            break;
          }
        }
      } catch (err) {
        console.log(err);
        console.log(`symbol: ${pos.symbol} not found.`);
      }
    }
    return portfolioValue;
  }
}
