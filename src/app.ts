import express, {Request, Response} from 'express';
import multer from 'multer';
import {readTradesFromCsv} from './services/TradesFromCsv';
import {collections} from './data/mongo';
import {Trade} from 'models/Trade';
import {Stock} from 'models/Market';

const upload = multer();

/**
 * entry point for app
 */
class App {
  public express;
  // public users: { [name: string]: User; };

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
    router.get('/about', (req, res) => {
      res.status(200).json({'temp': 'temp'});
    });

    router.post('/file', upload.single('trades'), async (req, res) => {
      const file = req.file;
      console.log(file);
      console.log(req.body.user);
      const userName = req.body.user;
      if (file) {
        // const trades: Trade[] = await readTradesFromCsv(file.buffer);
        // const user = new User(userName, trades);
        // this.users[userName] = user;
        res.status(200).json(`file uploaded successfully for ${userName}`);
      } else {
        throw Error('problem uploading file');
      }
    });

    router.get('/createuser', (req: Request, res: Response) => {

    });

    router.get('/market', async (req: Request, res: Response) => {
      try {
        let market;
        if (collections.market) {
          market = (await collections.market.find({}).toArray()) as Stock[];
        } else {
          market = 'collection not found';
        }
        res.status(200).send(market);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    this.express.use('/', router);
  }
}

export default new App().express;
