// import * as express from "express";

// // import sub-routers
// import * as csv from "./services/TradesFromCsv";
// let router = express.Router();

// // mount express paths, any addition middleware can be added as well.
// // ex. router.use('/pathway', middleware_function, sub-router);

// router.use('/products', router);

// // Export the router
// export = router;

import app from './routes';
import {connectToDatabase} from './data/mongo';

const port = process.env.PORT || 80;

connectToDatabase()
    .then(() => {
      // start the Express server
      app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
      });
    })
    .catch((error: Error) => {
      console.error('Database connection failed', error);
      process.exit();
    });
