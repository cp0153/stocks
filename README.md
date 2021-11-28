# Backend Alteryx Homework - Stock Market Simulator #

## build instructions

run ```docker-compose up``` in the command line. 

## background
project runs a mongodb container and a node js container hosted on port 80 and 27017. 

The Mongodb data is stored in two collections (market and users) on mongodb. the Market collection contains the stocks from top100.json organized by stock with their price history stored as a list. The User collection contains a User of the app, their name, portfolio, trade history and balance.

* APIs to manage a user
* a trade API to allow a user to buy or sell
* a create user API that allows a CSV file to be uploaded so a user can be have a pre-filled trade history
* evaluate API to calculate the value of the users portfolio in a certain day on 2017

* API was tested with ./backend-interview/test/backend-interview.postman_collection.json



### file structure
```    src/ --source code
       data/ --data access layer, connects to mongodb
        models/ --schemas for the simulated stock market, Positions, Trade, and User
        services/ -- utilities to parse a csv file into a user
        routes.ts -- api endpoints
        index.ts -- entry point for express app
    test/ -- unit tests```

