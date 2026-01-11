export type PaymentType = 'cash' | 'online';

export interface Payment {
  id: string;
  type: PaymentType;
  date: string;
  itemOfPayment: string;
  amount: number;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  quantityPerPcs: number; // This seems to be "Price per piece" based on user description "total amount of that item"
  totalAmount: number;
}

export interface Project {
  id: string;
  name: string;
  buyItems: Item[];
  buyPayments: Payment[];
  giveItems: Item[];
  givePayments: Payment[];
  createdAt: string;
}
