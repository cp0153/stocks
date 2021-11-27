/* eslint-disable require-jsdoc */
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import rawMarketData from '../../top100.json';
import {DailyPriceData, Stock} from '../models/Market';

export const collections: { market?: mongoDB.Collection } = {};

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
  if (typeof process.env.COLLECTION_NAME != 'string') {
    stockCollection = 'stocks';
  } else {
    stockCollection = process.env.COLLECTION_NAME;
  }
  const market: mongoDB.Collection = db.collection(stockCollection);
  // market.drop();

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
          const newStock = {name: record.Name, priceHistory: [price]};
          await market.insertOne(newStock);
        }
      }
    } catch (err) {
      throw Error(`error pushing stocks ${err}`);
    }
  }
}
