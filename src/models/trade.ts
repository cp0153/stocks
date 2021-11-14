interface Trade {
    price: number;
    date: Date;
    tradeType: TradeType;
    shares: number;
    symbol: number; // as a percentage
    amount: number;
}

enum TradeType {
    buy = "BUY",
    sell = "SELL"
}