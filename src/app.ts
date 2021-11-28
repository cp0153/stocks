import express, {Request, Response} from 'express';
import multer from 'multer';
import {readTradesFromCsv} from './services/TradesFromCsv';
import {collections} from './data/mongo';
import {Trade} from './models/Trade';
import {Stock} from './models/Market';
import {User} from './models/User';
import {ObjectId} from 'mongodb';

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

    router.post('/user', upload.single('trades'), async (req, res) => {
      const file = req.file;
      console.log(file);
      console.log(req.body.user);
      const userName = req.body.user;
      if (file) {
        const trades: Trade[] = await readTradesFromCsv(file.buffer);
        const user = new User(userName, trades).user();

        let result = undefined;
        if (collections.users) {
          result = await collections.users.insertOne(user);
        }

        result ?
            res.status(201).send(
                `Successfully created a new user with id ${result.insertedId}`):
            res.status(500).send('Failed to create a new user.');

        res.status(200).json(`file uploaded successfully for ${userName}`);
      } else {
        throw Error('problem uploading file');
      }
    });

    router.post('/trade', async (req, res) => {
      try {
        const newTrade = req.body as Trade;
        console.log(newTrade);

        res.status(201).send(`trade successful`);
        // res.status(500).send('trade failed.');
      } catch (error) {
        console.error(error);
        res.status(400).send(error);
      }
    });

    router.get('/users:username', async (req: Request, res: Response) => {
      const newUser = req.params.username;
      try {
        let user;
        if (collections.users) {
          const query = {_id: new ObjectId(newUser)};
          user = (await collections.users.findOne(query)) as User;
          res.status(200).send(user);
        } else {
          user = 'users collection not found';
          res.status(404).send(`Unable to find matching document with id:
          ${req.params.id}`);
        }
      } catch (error) {
        res.status(404).send(`Unable to find matching document with id:
        ${req.params.id}`);
      }
    });

    router.get('/evaluate:username:date',
        async (req: Request, res: Response) => {
          const newUser = req.params.username;
          try {
            let user;
            if (collections.users) {
              const query = {_id: new ObjectId(newUser)};
              user = (await collections.users.findOne(query)) as User;
              res.status(200).send(user);
            } else {
              user = 'users collection not found';
              res.status(404).send(`Unable to find matching document with id:
          ${req.params.id}`);
            }
          } catch (error) {
            res.status(404).send(`Unable to find matching document with id:
        ${req.params.id}`);
          }
        });

    router.get('/users', async (req: Request, res: Response) => {
      try {
        let users;
        if (collections.users) {
          users = (await collections.users.find({}).toArray()) as User[];
          res.status(200).send(users);
        } else {
          users = 'users collection not found';
          res.status(404).send(`Unable to find matching document with id:
          ${req.params.id}`);
        }
      } catch (error) {
        res.status(404).send(`Unable to find matching document with id:
        ${req.params.id}`);
      }
    });

    router.delete('/users:username', async (req: Request, res: Response) => {
      const newUser = req.params.username;
      try {
        let result;
        if (collections.users) {
          const query = {_id: new ObjectId(newUser)};
          result = (await collections.users.deleteOne(query));
          res.status(200).send(result);
        } else {
          result = 'users collection not found';
          res.status(404).send(`Unable to find matching document with id:
          ${req.params.id}`);
        }
      } catch (error) {
        res.status(404).send(`Unable to find matching document with id:
        ${req.params.id}`);
      }
    });

    router.get('/market', async (req: Request, res: Response) => {
      try {
        let market;
        if (collections.market) {
          market = (await collections.market.find({}).toArray()) as Stock[];
          res.status(200).send(market);
        } else {
          market = 'market collection not found';
          res.status(500).send(market);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    });

    this.express.use('/', router);
  }
}

export default new App().express;
