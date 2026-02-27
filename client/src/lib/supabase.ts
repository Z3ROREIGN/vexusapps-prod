import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not found in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos
export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string;
  phone?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  mistic_transaction_id: string;
  customer_id: string;
  amount: number;
  fee?: number;
  status: 'PENDENTE' | 'COMPLETO' | 'FALHOU';
  payment_method: string;
  qr_code_base64?: string;
  qr_code_url?: string;
  copy_paste?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  transaction_id?: string;
  product_id?: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
}

// Funções de Clientes
export async function createCustomer(data: Omit<Customer, 'id' | 'created_at'>) {
  const { data: customer, error } = await supabase
    .from('customers')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return customer;
}

export async function getCustomer(email: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Funções de Transações
export async function createTransaction(data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return transaction;
}

export async function getTransaction(id: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTransactionByMisticId(misticId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('mistic_transaction_id', misticId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return transaction;
}

export async function listTransactions(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

// Funções de Produtos
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Funções de Pedidos
export async function createOrder(data: Omit<Order, 'id' | 'created_at'>) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return order;
}

export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Funções de Webhook Logs
export async function logWebhook(data: any) {
  const { data: log, error } = await supabase
    .from('webhook_logs')
    .insert([{
      transaction_id: data.transactionId,
      event_type: data.transactionType,
      payload: data
    }])
    .select()
    .single();

  if (error) throw error;
  return log;
}
