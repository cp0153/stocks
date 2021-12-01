/* eslint-disable require-jsdoc */
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import rawMarketData from '../../top100.json';
import {DailyPriceData, Stock} from '../models/Stock';
import {ObjectId} from 'mongodb';
import {User} from 'models/User';

export const collections: {
  market?: mongoDB.Collection<Stock>,
  users?: mongoDB.Collection<User> } = {};

export async function connectToDatabase() {
  // Pulls in the .env file so it can be accessed from process.env. No path as
  // .env is in root, the default location
  dotenv.config();

  // Create a new MongoDB client with the connection string from .env
  let connString: string = '';
  if (typeof process.env.DB_CONN_STRING != 'string') {
    connString = 'mongodb://localhost:27017/stocks';
  } else {
    connString = process.env.DB_CONN_STRING;
  }

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connString);

  // Connect to the cluster
  await client.connect();

  // Connect to the database with the name specified in .env
  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  // Connect to the market collection with the specific name from .env,
  // found in the database previously specified
  let stockCollection: string = '';
  if (typeof process.env.MARKET_COLLECTION_NAME != 'string') {
    stockCollection = 'stocks';
  } else {
    stockCollection = process.env.MARKET_COLLECTION_NAME;
  }
  const market = db.collection<Stock>(stockCollection);

  let userCollection: string = '';
  if (typeof process.env.USER_COLLECTION_NAME != 'string') {
    userCollection = 'users';
  } else {
    userCollection = process.env.USER_COLLECTION_NAME;
  }
  const users = db.collection<User>(userCollection);
  collections.users = users;

  // Persist the connection to the stocks collection
  collections.market = market;
  market.drop();
  collections.market.countDocuments((err: any, count: number) => {
    if (!err && count === 0) {
      populateMarket();
    }
  },
  {limit: 1});

  console.log(`Successfully connected to database: ${db.databaseName}`);
  console.log(`collection: ${market.collectionName}`);
  console.log(`records: ${await market.countDocuments()}`);
}

async function populateMarket() {
  const market = collections.market || undefined;
  if (!market) {
    throw Error('error reading db');
  } else {
    try {
      for (const record of rawMarketData) {
        const ticker = record.Name;
        const query = {name: ticker};
        const stock = await market.findOne(query) as Stock;
        const open = Number(record.open);
        const high = Number(record.high);
        const low = Number(record.low);
        const close = Number(record.close);
        const volume = Number(record.volume);
        const date = new Date(record.date);

        const price: DailyPriceData = {
          date: date,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume,
        };

        if (stock) {
          await market.updateOne(query, {$push: {priceHistory: price}});
        } else {
          // eslint-disable-next-line max-len
          const newStock = {name: record.Name.normalize(), priceHistory: [price]};
          await market.insertOne(newStock);
        }
      }
    } catch (err) {
      throw Error(`error pushing stocks ${err}`);
    }
  }
}

export async function getUser(id: string): Promise<User> {
  const users = collections.users || undefined;
  if (!users) {
    throw Error('error reading db');
  } else {
    try {
      const query = {_id: new ObjectId(id)};
      const result = (await users.findOne<User>(query)) as User;
      return result;
    } catch (err) {
      throw Error(`error looking up user ${id}: ${err}`);
    }
  }
}

export async function getStockId(id: string) {
  const market = collections.market || undefined;
  if (!market) {
    throw Error('error reading db');
  } else {
    try {
      const query = {_id: new ObjectId(id)};
      market.findOne(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          return result;
        }
      });
    } catch (err) {
      throw Error(`error looking up user ${id}: ${err}`);
    }
  }
}

export async function deleteUser(id: string) {
  const users = collections.users || undefined;
  if (!users) {
    throw Error('error reading db');
  } else {
    try {
      const query = {_id: new ObjectId(id)};
      const result = await users.deleteOne(query);
      return result;
    } catch (err) {
      throw Error(`error looking up user ${id}: ${err}`);
    }
  }
}

export async function insertUser(user: User) {
  const users = collections.users || undefined;
  if (!users) {
    throw Error('error reading db');
  } else {
    try {
      const result = await users.insertOne(user);
      return result;
    } catch (err) {
      throw Error(`error inserting new record ${user}: ${err}`);
    }
  }
}

export async function updateUser(updatedUser: User, id: string) {
  const users = collections.users || undefined;
  if (!users) {
    throw Error('error reading db');
  } else {
    try {
      const query = {_id: new ObjectId(id)};
      const result = await users.findOneAndReplace(query, updatedUser);
      return result;
    } catch (err) {
      throw Error(`error inserting new record ${updatedUser}: ${err}`);
    }
  }
}

export async function getAllUsers() {
  const users = collections.users || undefined;
  if (!users) {
    throw Error('error reading db');
  } else {
    try {
      const result = (await users.find({}).toArray()) as User[];
      return result;
    } catch (err) {
      throw Error(`error looking up stock market: ${err}`);
    }
  }
}

export async function getStock(name: string) {
  const stocks = collections.market || undefined;
  if (!stocks) {
    throw Error('error reading db');
  } else {
    try {
      const query = {name: name};
      const result = await stocks.findOne(query);
      return result as Stock;
    } catch (err) {
      throw Error(`error looking up stock ${name}: ${err}`);
    }
  }
}

export async function getAllStock() {
  const stocks = collections.market || undefined;
  if (!stocks) {
    throw Error('error reading db');
  } else {
    try {
      const result = (await stocks.find({}).toArray()) as Stock[];
      return result;
    } catch (err) {
      throw Error(`error looking up stock market: ${err}`);
    }
  }
}

export async function getAllStockLookup() {
  const stocks = collections.market || undefined;
  if (!stocks) {
    throw Error('error reading db');
  } else {
    try {
      const result = (await stocks.find({}).toArray());
      const stockTable: { [index: string]: any; } = {};
      for (const i of result) {
        // console.log(i);
        const sym = i.name;
        const id = i.id;
        stockTable[sym] = id;
      }
      return stockTable;
    } catch (err) {
      throw Error(`error looking up stock market: ${err}`);
    }
  }
}
