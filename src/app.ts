import express from 'express';
import {Trade} from 'models/Trade';
import {User} from 'models/User';
import multer from 'multer';
import {readTradesFromCsv} from './services/TradesFromCsv';

const upload = multer();

/**
 * entry point for app
 */
class App {
  public express;
  //public users: { [name: string]: User; };

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

    // router.post('/file', upload.single('trades'), async (req, res) => {
    //   const file = req.file;
    //   console.log(file);
    //   console.log(req.body.user);
    //   const userName = req.body.user;
    //   if (file) {
    //     const trades: Trade[] = await readTradesFromCsv(file.buffer);
    //     const user = new User(userName, trades);
    //     this.users[userName] = user;
    //     res.status(200).json(`file uploaded successfully for ${userName}`);
    //   } else {
    //     throw Error('problem uploading file');
    //   }
    // });

    router.get('/createuser', (req, res) => {

    });


    this.express.use('/', router);
  }
}

export default new App().express;
