import {Position} from './Position';
import {Trade} from './Trade';

/**
 * user class
 */
export class User {
  name: string;
  budget: number = 100000.00;
  portfolio: Position[];
  tradeHistory: Trade[];

  /**
   * starts with initial name and positions
   * @param {string} name user name
   * @param {Trade[]} trades a list of the users trades
   */
  public constructor(name: string, trades: Trade[]) {
    this.name = name;
    this.tradeHistory = trades;
    this.portfolio = this.generatePortfolio(this.tradeHistory);
  }

  /**
   * generates portfolio positions from users trade history
   * @param {Trade[]} tradeHistory users initial trades
   */
  private generatePortfolio(tradeHistory: Trade[]): Position[] {
    throw new Error('Method not implemented.');
  }

  /**
   * updates users positions and cash balance
   * @param {trade} trade trade
   */
  public makeTrade(trade: Trade) {
    throw new Error('Method not implemented.');
  }
}
