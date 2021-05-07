import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { api } from '../services/api';

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string
}

type TransactionData = {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

type TransactionsProviderProps = {
  children: ReactNode;
}
const TransactionsContext = createContext<TransactionData>({} as TransactionData);

export function TransactionProvider({children}: TransactionsProviderProps){
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('/transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transaction: TransactionInput) {
    const response = await api.post('transactions', {...transaction, createdAt: new Date()})
    const {transaction: transactionCreated} = response.data;
    
    setTransactions([...transactions, transactionCreated]);

  }

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions(){
  const context = useContext(TransactionsContext);

  return context;
}