import React, { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Eye,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Zap,
  Crown,
  Package,
  Users,
  Clock,
  TrendingUp,
  Receipt,
  Plus,
  ExternalLink,
  FileText,
  Shield,
  Star,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useTenantStore } from '@/stores/tenantStore'

interface Subscription {
  id: string
  app_name: string
  app_id: string
  plan_name: string
  status: 'active' | 'trial' | 'cancelled' | 'past_due'
  amount: number
  billing_cycle: 'monthly' | 'yearly'
  current_period_start: string
  current_period_end: string
  trial_end?: string
  users_limit: number
  users_used: number
  features: string[]
  next_billing_date: string
  auto_renew: boolean
}

interface Invoice {
  id: string
  number: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  issued_date: string
  due_date: string
  paid_date?: string
  items: {
    description: string
    amount: number
    period: string
  }[]
  payment_method?: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  brand?: string
  last4: string
  expiry?: string
  is_default: boolean
  name: string
}

export default function Billing() {
  const { currentTenant } = useTenantStore()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      app_name: 'Elaris ERP',
      app_id: 'elaris-erp',
      plan_name: 'Pro',
      status: 'active',
      amount: 5900, // $59.00
      billing_cycle: 'monthly',
      current_period_start: '2024-01-15T00:00:00Z',
      current_period_end: '2024-02-15T00:00:00Z',
      users_limit: 50,
      users_used: 12,
      features: ['Up to 50 users', 'Advanced inventory', 'Financial reports', 'Priority support', 'API access'],
      next_billing_date: '2024-02-15T00:00:00Z',
      auto_renew: true
    },
    {
      id: '2',
      app_name: 'ForvaraMail',
      app_id: 'forvara-mail',
      plan_name: 'Team',
      status: 'trial',
      amount: 800, // $8.00
      billing_cycle: 'monthly',
      current_period_start: '2024-01-12T00:00:00Z',
      current_period_end: '2024-02-11T00:00:00Z',
      trial_end: '2024-02-11T00:00:00Z',
      users_limit: 25,
      users_used: 8,
      features: ['Unlimited messages', 'File sharing', 'Voice calls', 'Basic integrations'],
      next_billing_date: '2024-02-11T00:00:00Z',
      auto_renew: false
    },
    {
      id: '3',
      app_name: 'ForvaraStorage',
      app_id: 'forvara-storage',
      plan_name: 'Extended',
      status: 'active',
      amount: 1500, // $15.00
      billing_cycle: 'monthly',
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2024-02-01T00:00:00Z',
      users_limit: 0, // Storage doesn't have user limits
      users_used: 0,
      features: ['Additional 50GB storage', 'Priority sync', 'Advanced sharing'],
      next_billing_date: '2024-02-01T00:00:00Z',
      auto_renew: true
    }
  ]

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      amount: 7400, // $74.00
      status: 'paid',
      issued_date: '2024-01-15T00:00:00Z',
      due_date: '2024-01-15T00:00:00Z',
      paid_date: '2024-01-15T08:30:00Z',
      items: [
        { description: 'Elaris ERP - Pro Plan', amount: 5900, period: 'Jan 15 - Feb 15, 2024' },
        { description: 'ForvaraStorage - Extended', amount: 1500, period: 'Jan 15 - Feb 15, 2024' }
      ],
      payment_method: 'Visa •••• 4242'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      amount: 7400,
      status: 'pending',
      issued_date: '2024-02-15T00:00:00Z',
      due_date: '2024-02-15T00:00:00Z',
      items: [
        { description: 'Elaris ERP - Pro Plan', amount: 5900, period: 'Feb 15 - Mar 15, 2024' },
        { description: 'ForvaraStorage - Extended', amount: 1500, period: 'Feb 15 - Mar 15, 2024' }
      ]
    },
    {
      id: '3',
      number: 'INV-2023-045',
      amount: 5900,
      status: 'paid',
      issued_date: '2023-12-15T00:00:00Z',
      due_date: '2023-12-15T00:00:00Z',
      paid_date: '2023-12-15T10:22:00Z',
      items: [
        { description: 'Elaris ERP - Pro Plan', amount: 5900, period: 'Dec 15 - Jan 15, 2024' }
      ],
      payment_method: 'Visa •••• 4242'
    }
  ]

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      is_default: true,
      name: 'Business Visa'
    },
    {
      id: '2',
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiry: '08/25',
      is_default: false,
      name: 'Backup Card'
    }
  ]

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'past_due': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Check
      case 'trial': return Clock
      case 'cancelled': return X
      case 'past_due': return AlertCircle
      case 'paid': return Check
      case 'pending': return Clock
      case 'failed': return X
      default: return AlertCircle
    }
  }

  const totalMonthlySpend = mockSubscriptions
    .filter(sub => sub.status === 'active' && sub.billing_cycle === 'monthly')
    .reduce((sum, sub) => sum + sub.amount, 0)

  const nextBillingAmount = mockSubscriptions
    .filter(sub => sub.status === 'active' || (sub.status === 'trial' && sub.auto_renew))
    .reduce((sum, sub) => sum + sub.amount, 0)

  const trialSubscriptions = mockSubscriptions.filter(sub => sub.status === 'trial')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="text-gray-600">Manage your subscriptions, invoices, and payment methods</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalMonthlySpend)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Apps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSubscriptions.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {trialSubscriptions.length} trials active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Billing</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(nextBillingAmount)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Feb 15, 2024
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSubscriptions.reduce((sum, sub) => sum + sub.users_used, 0)}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              of {mockSubscriptions.reduce((sum, sub) => sum + sub.users_limit, 0)} licensed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trials Alert */}
      {trialSubscriptions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Active Trials</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have {trialSubscriptions.length} trial(s) ending soon. Convert to paid plans to continue using these features.
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  {trialSubscriptions.map(sub => {
                    const daysLeft = Math.ceil((new Date(sub.trial_end!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={sub.id} className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-white">
                          {sub.app_name}
                        </Badge>
                        <span className="text-sm text-blue-700">{daysLeft} days left</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Upgrade Trials
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Subscriptions Tab */}
        <TabsContent value="overview" className="space-y-4">
          {mockSubscriptions.map((subscription) => {
            const StatusIcon = getStatusIcon(subscription.status)
            const usagePercentage = subscription.users_limit > 0 
              ? (subscription.users_used / subscription.users_limit) * 100 
              : 0
            
            return (
              <Card key={subscription.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{subscription.app_name}</h3>
                          <Badge className={getStatusColor(subscription.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {subscription.status}
                          </Badge>
                          {subscription.status === 'trial' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Crown className="w-3 h-3 mr-1" />
                              Trial
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{subscription.plan_name} Plan</p>
                        
                        {/* Features */}
                        <div className="space-y-2 mb-4">
                          {subscription.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {subscription.features.length > 3 && (
                            <p className="text-sm text-gray-500">+{subscription.features.length - 3} more features</p>
                          )}
                        </div>

                        {/* Usage */}
                        {subscription.users_limit > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Users</span>
                              <span className="font-medium">
                                {subscription.users_used} / {subscription.users_limit}
                              </span>
                            </div>
                            <Progress value={usagePercentage} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">
                        {formatPrice(subscription.amount)}
                        <span className="text-sm font-normal text-gray-500">
                          /{subscription.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      
                      {subscription.status === 'trial' && subscription.trial_end && (
                        <p className="text-sm text-blue-600">
                          Trial ends {new Date(subscription.trial_end).toLocaleDateString()}
                        </p>
                      )}
                      
                      {subscription.status === 'active' && (
                        <p className="text-sm text-gray-500">
                          Next billing {new Date(subscription.next_billing_date).toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download your billing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-gray-500">
                              {invoice.items.length} item(s)
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {new Date(invoice.issued_date).toLocaleDateString()}
                            </div>
                            {invoice.paid_date && (
                              <div className="text-sm text-gray-500">
                                Paid {new Date(invoice.paid_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-4">
          <div className="grid gap-4">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id} className={method.is_default ? 'ring-2 ring-blue-500' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{method.name}</h3>
                          {method.is_default && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.brand} •••• {method.last4}
                          {method.expiry && ` • Expires ${method.expiry}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!method.is_default && (
                        <Button variant="outline" size="sm">
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Add Payment Method</h3>
                <p className="text-gray-600 mb-4">Add a backup payment method for your subscriptions</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card or Bank Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4">
            {mockSubscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>{subscription.app_name}</span>
                    <Badge variant="outline">{subscription.plan_name}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Current billing period: {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscription.users_limit > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">User Licenses</span>
                        <span className="text-sm text-gray-600">
                          {subscription.users_used} / {subscription.users_limit} used
                        </span>
                      </div>
                      <Progress 
                        value={(subscription.users_used / subscription.users_limit) * 100} 
                        className="h-3"
                      />
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{subscription.users_used}</div>
                          <div className="text-xs text-gray-500">Active Users</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {subscription.users_limit - subscription.users_used}
                          </div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-600">{subscription.users_limit}</div>
                          <div className="text-xs text-gray-500">Total Licensed</div>
                        </div>
                      </div>
                      
                      {subscription.users_used / subscription.users_limit > 0.8 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              You're using {Math.round((subscription.users_used / subscription.users_limit) * 100)}% of your licenses
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">This subscription doesn't have user limits</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}