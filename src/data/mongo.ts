/* eslint-disable require-jsdoc */
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import rawMarketData from '../../top100.json';
import {DailyPriceData, Stock} from '../models/Market';
import {ObjectId} from 'mongodb';
import {User} from 'models/User';

export const collections: {
  market?: mongoDB.Collection,
  users?: mongoDB.Collection } = {};

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
  const market: mongoDB.Collection = db.collection(stockCollection);

  let userCollection: string = '';
  if (typeof process.env.USER_COLLECTION_NAME != 'string') {
    userCollection = 'users';
  } else {
    userCollection = process.env.USER_COLLECTION_NAME;
  }
  const users: mongoDB.Collection = db.collection(userCollection);
  collections.users = users;

  // Persist the connection to the stocks collection
  collections.market = market;
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
        const date = record.date;

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
          const newStock = {name: record.Name, priceHistory: [price]};
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
      const result = (await users.findOne(query)) as User;
      if (result) {
        return result;
      } else {
        throw Error(`user ${id} not found`);
      }
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

export async function insertUser(user: object) {
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
      const result = await users.updateOne(query, {$set: updatedUser});
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
      if (result) {
        return result;
      } else {
        throw Error(`market not found`);
      }
    } catch (err) {
      throw Error(`error looking up stock market: ${err}`);
    }
  }
}

export async function getStock(name: string): Promise<Stock> {
  const stocks = collections.market || undefined;
  if (!stocks) {
    throw Error('error reading db');
  } else {
    try {
      const query = {name: name};
      const result = (await stocks.findOne(query)) as Stock;
      if (result) {
        return result;
      } else {
        throw Error(`stock ${name} not found`);
      }
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
      if (result) {
        return result;
      } else {
        throw Error(`market not found`);
      }
    } catch (err) {
      throw Error(`error looking up stock market: ${err}`);
    }
  }
}
