/* eslint-disable require-jsdoc */
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

export const collections: { stocks?: mongoDB.Collection } = {};

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

  // Connect to the collection with the specific name from .env, found in the
  // database previously specified
  let stockCollection: string = '';
  if (typeof process.env.COLLECTION_NAME != 'string') {
    stockCollection = 'stocks';
  } else {
    stockCollection = process.env.COLLECTION_NAME;
  }
  const stocks: mongoDB.Collection = db.collection(stockCollection);

  // Persist the connection to the stocks collection
  collections.stocks = stocks;

  console.log(
      `Successfully connected to database: ${db.databaseName}
       and collection: ${stocks.collectionName}`,
  );
}
