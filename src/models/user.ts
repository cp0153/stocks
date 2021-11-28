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
      if (trade.tradeType.toUpperCase() === 'BUY') {
        this.budget -= trade.amount;

        // check if existing position, update if yes, create new position if no
        // TODO, fill in math
        this.portfolio.find((existingPos, newTradeInfo) => {
          if (existingPos.symbol === trade.symbol) {
            this.portfolio[newTradeInfo] = {
              symbol: existingPos.symbol,
              lastPrice: trade.price,
              gainLossDay: 1,
              gainLossTotal: 1,
              currentValue: 1,
              acctQuantity: .89, // as a percentage
              costBasis: 1,
            };
            return true; // stop searching
          } else {
            this.portfolio.push({
              symbol: existingPos.symbol,
              lastPrice: trade.price,
              gainLossDay: 1,
              gainLossTotal: 1,
              currentValue: 1,
              acctQuantity: .89, // as a percentage
              costBasis: 1,
            });
          }
        });
      }
    }
  }

  /**
   * updates users positions and cash balance
   * @param {trade} trade trade
   */
  public makeTrade(trade: Trade) {
    throw new Error('Method not implemented.');
  }

  /**
   * updates users positions and cash balance
   * @param {Date} date date of portfolio evaluation
   */
  public evaluate(date: Date) {
    throw new Error('Method not implemented.');
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
