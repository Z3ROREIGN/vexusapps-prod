import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLocation } from 'wouter';
import { supabase, Transaction, listTransactions } from '@/lib/supabase';
import { formatAmount } from '@/lib/misticpay';
import { LogOut, RefreshCw, TrendingUp } from 'lucide-react';

/**
 * Admin Dashboard
 * View all transactions and manage payments
 */

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    completedTransactions: 0,
    totalRevenue: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await listTransactions(100);
      setTransactions(data || []);

      // Calculate stats
      const completed = (data || []).filter(t => t.status === 'COMPLETO');
      const pending = (data || []).filter(t => t.status === 'PENDENTE');

      const totalRevenue = completed.reduce((sum, t) => sum + (t.amount - (t.fee || 0)), 0);
      const pendingAmount = pending.reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalTransactions: data?.length || 0,
        completedTransactions: completed.length,
        totalRevenue,
        pendingAmount,
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETO':
        return 'text-green-400 bg-green-500 bg-opacity-10';
      case 'PENDENTE':
        return 'text-yellow-400 bg-yellow-500 bg-opacity-10';
      case 'FALHOU':
        return 'text-red-400 bg-red-500 bg-opacity-10';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neon-green">Dashboard Admin</h1>
            <p className="text-slate-400 mt-1">Gerenciar transações e pagamentos</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={loadTransactions}
              disabled={loading}
              variant="outline"
              className="border-slate-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-green">{stats.totalTransactions}</div>
              <p className="text-xs text-slate-500 mt-1">Todas as transações</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Transações Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.completedTransactions}</div>
              <p className="text-xs text-slate-500 mt-1">Pagamentos confirmados</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{formatAmount(stats.totalRevenue)}</div>
              <p className="text-xs text-slate-500 mt-1">Após taxas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{formatAmount(stats.pendingAmount)}</div>
              <p className="text-xs text-slate-500 mt-1">Aguardando confirmação</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Histórico de pagamentos via MisticPay</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-slate-400">Carregando...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-slate-400">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead className="text-slate-300">ID da Transação</TableHead>
                      <TableHead className="text-slate-300">Cliente</TableHead>
                      <TableHead className="text-slate-300">Valor</TableHead>
                      <TableHead className="text-slate-300">Taxa</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-slate-700 hover:bg-slate-700 hover:bg-opacity-50">
                        <TableCell className="font-mono text-sm text-slate-300">
                          {tx.mistic_transaction_id.substring(0, 12)}...
                        </TableCell>
                        <TableCell className="text-slate-300">{tx.description || 'N/A'}</TableCell>
                        <TableCell className="text-slate-300 font-semibold">
                          {formatAmount(tx.amount)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {tx.fee ? formatAmount(tx.fee) : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(tx.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
