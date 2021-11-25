import {MongoMemoryServer} from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
const mongod = async () => {
  await MongoMemoryServer.create();
};

