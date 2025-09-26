import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LogOut, CreditCard, PieChart, Shield, Eye, EyeOff, Send, Plus } from 'lucide-react';


interface DashboardProps {
  onLogout: () => void;
  username: string;
}

export function Dashboard({ onLogout, username }: DashboardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const mockTransactions = [
    { id: 1, description: 'Grocery Store', amount: -45.67, date: '2024-01-15' },
    { id: 2, description: 'Salary Deposit', amount: 2500.00, date: '2024-01-14' },
    { id: 3, description: 'Electric Bill', amount: -89.23, date: '2024-01-13' },
    { id: 4, description: 'Coffee Shop', amount: -12.50, date: '2024-01-12' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">SecureBank</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                <Shield className="h-3 w-3 mr-1" />
                Multi-Factor Authenticated
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {username}</span>
              <Button onClick={onLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Account Balance Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? '$12,456.78' : '••••••••'}
              </div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Transfer
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Bills
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest account activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className={`font-medium text-sm ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}