// import * as express from "express";

// // import sub-routers
// import * as csv from "./services/TradesFromCsv";
// let router = express.Router();

// // mount express paths, any addition middleware can be added as well.
// // ex. router.use('/pathway', middleware_function, sub-router);

// router.use('/products', router);

// // Export the router
// export = router;

import app from './app';

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

