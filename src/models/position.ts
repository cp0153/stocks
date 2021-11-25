export interface Position {
    symbol: string
    lastPrice: number;
    gainLossDay: number;
    gainLossTotal: number;
    currentValue: number;
    acctQuantity: number; // as a percentage
    costBasis: number;
}
