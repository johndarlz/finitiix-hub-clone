import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Minus,
  TrendingUp,
  Calendar,
  Filter
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const DashboardWallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'credit',
      amount: 2500,
      description: 'Payment received for Logo Design job',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 100,
      description: 'Platform fee for job posting',
      date: '2024-01-14',
      status: 'completed'
    }
  ]);

  const totalEarnings = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your earnings and payments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button>
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Ready to withdraw
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Platform fees & expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-muted-foreground">••••••••••1234</p>
                  </div>
                </div>
                <Badge variant="secondary">Primary</Badge>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'credit' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardWallet;