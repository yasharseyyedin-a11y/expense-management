export interface Expense {
    _id?: string;
    description: string;
    amount: number;
    category: 'food' | 'bill' | 'clothing';
    date: Date;
}
