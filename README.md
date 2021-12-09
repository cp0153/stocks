# Stock Market Simulator #

## build instructions

run ```docker-compose up``` in the command line.

## background
project runs a container hosting a nodejs server and another container hosting a mongodb on port 80 and 27017.

The Mongodb data is stored in two collections (market and users) on mongodb. The Market collection contains the stocks from top100.json organized by stock with their price history stored as a array. The User collection contains a User of the app, their name, portfolio, trade history and balance.

* APIs to manage a user
  * GET /user --lookup all users

  * GET /user/:id -- lookup user by id

  * DELETE /user:id -- delete a user

  * POST /user -- create a new user with trades from CSV file

    * CSV file must be in format "price,date,tradeType,shares,symbol"

  * a trade API to allow a user to buy or sell

    * POST /trade/:user

    * update the user (lookup by id) with info from a new trade

    * ex ```{"price": 25,"date": "2017-01-04T00:00:00.000Z","tradeType": "SELL","shares": 1,"symbol": "FB"}```

* evaluate API to calculate the value of the users portfolio in a certain day on 2017
  * /evaluate/:user/:date' -- returns the value of a portfolio on a given day in 2017

* API was tested with ./backend-interview/test/backend-interview.postman_collection.json



### file structure
```
src/ --source code
    data/ --data access layer, connects to mongodb
    models/ --schemas for the simulated stock market, Positions, Trade, and User
    services/ -- utilities to parse a csv file into a user
    routes.ts -- api endpoints
    index.ts -- entry point for express app
test/ -- unit tests
```

