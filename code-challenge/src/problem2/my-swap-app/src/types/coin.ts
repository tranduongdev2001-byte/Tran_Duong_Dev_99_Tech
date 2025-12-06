export type CoinType = {
    currency: string;
    name: string;
    price: number;
    toDollar: number;
    amount: number;
}

export type Currency = Omit<CoinType, 'toDollar'>;