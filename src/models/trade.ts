export interface Trade {
    price: number;
    date: Date;
    tradeType: string; // buy or sell
    shares: number;
    symbol: string;
}
