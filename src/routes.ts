/* eslint-disable max-len */
import express, {Request, Response} from 'express';
import multer from 'multer';
import {readTradesFromCsv} from './services/TradesFromCsv';
import {Trade} from './models/Trade';
import {User} from './models/User';
import {getAllStock, getStock, getUser, updateUser, deleteUser,
  getAllUsers, insertUser} from './data/mongo';

const upload = multer();

/**
 * entry point for app
 */
class App {
  public express;

  /**
   * constructor
   */
  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  /**
   * routes
   */
  private mountRoutes(): void {
    // eslint-disable-next-line new-cap
    const router = express.Router();
    router.use(express.json());
    router.get('/about', (req, res) => {
      res.status(200).json({'stock simulator': 'temp'});
    });

    /**
     * returns a user, lookup by mongo ObjectId
     */
    router.get('/user/:id', async (req: Request, res: Response) => {
      const id = req.params.id;
      try {
        const user = await getUser(id);
        res.status(200).send(user);
      } catch (error) {
        res.status(404).send(`Unable to find matching document with name:
        ${id}`);
      }
    });

    /**
     * returns all the users in the mongodb collection
     */
    router.get('/user', async (req: Request, res: Response) => {
      try {
        const user = await getAllUsers();
        res.status(200).send(user);
      } catch (error) {
        res.status(404).send('users collection not found');
      }
    });

    /**
     * deletes a user, lookup by mongo ObjectId
     */
    router.delete('/user/:id', async (req: Request, res: Response) => {
      const id = req.params.id;
      try {
        const result = await deleteUser(id);
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send(`Unable to find matching document with name:
        ${error}`);
      }
    });

    /**
     * post endpoint for uploading a csv file in the format:
     * price,date,tradeType,shares,symbol
     * request must be made as form data with the file and username as params
     */
    router.post('/user', upload.single('trades'), async (
        req: Request, res: Response) => {
      const file = req.file;
      const userName = req.body.user;

      if (!userName) {
        res.status(400).send('username is required');
      }
      let user: User;
      let trades: Trade[];
      if (file) {
        try {
          trades = await readTradesFromCsv(file.buffer);
        } catch (err) {
          throw Error(`error reading file ${err}`);
        }
      } else {
        trades = [];
      }
      try {
        user = new User(userName, trades);
        const result = await(insertUser(user));
                result ?
            res.status(201).send(
                `Successfully created a new user with id ${result.insertedId}`):
            res.status(500).send('Failed to create a new user.');
      } catch (err) {
        res.status(500).send(`Error inserting user: ${err}`);
      }
    });

    /**
     * returns all the stocks in the mongodb collection
     */
    router.get('/market', async (req: Request, res: Response) => {
      try {
        const market = await getAllStock();
        res.status(200).send(market);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    /**
     * returns one stock
     * '/stockprices/:symbol/startdate/enddate/'
     */
    router.get('/market/:symbol', async (req: Request, res: Response) => {
      const symbol = req.params.symbol.toUpperCase().normalize();
      try {
        const stock = await getStock(symbol);
        res.status(200).send(stock);
      } catch (error) {
        res.status(500).send(`${error}`);
      }
    });

    /**
     * update the users portfolio with a trade, in json format, username in url
     * ex: {"price": "25","date": "1/4/17","tradeType": "BUY","shares": "100","symbol": "CAT"}
     */
    router.post('/trade/:user', async (req: Request, res: Response) => {
      try {
        const newTrade = req.body as Trade;
        const id = req.params.user;
        const user = await getUser(id);
        const updatedUser = new User(user.name, user.tradeHistory);
        updatedUser.trade(newTrade);
        const result = await updateUser(updatedUser, id);

        result ?
        res.status(200).send(`trade successful for user ${id}`) :
        res.status(304).send(`trade failed ${newTrade}`);
      } catch (err) {
        console.error(err);
        res.status(400).send(`trade failed ${err}`);
      }
    });

    /**
     * returns the value of a portfolio on a given day in 2017
     * /evaluate/<userID>/<date_in_isoformat>
     */
    router.get('/evaluate/:user/:date',
        async (req: Request, res: Response) => {
          try {
            const id = req.params.user;
            const date = req.params.date;
            const user = await getUser(id);
            const portfolioValue = await User.evaluate(user, date);
            // eslint-disable-next-line max-len
            res.status(200).send(`portfolio value as of ${date} is ${portfolioValue}`);
          } catch (error) {
            console.error(error);
            res.status(400).send(error);
          }
        });

    this.express.use('/', router);
  }
}

export default new App().express;
