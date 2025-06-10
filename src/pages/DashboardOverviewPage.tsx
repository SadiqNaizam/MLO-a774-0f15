import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import KPICard from '@/components/KPICard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Activity, CreditCard, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const recentSalesData = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", avatar: "https://i.pravatar.cc/40?u=olivia" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", avatar: "https://i.pravatar.cc/40?u=jackson" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", avatar: "https://i.pravatar.cc/40?u=isabella" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", avatar: "https://i.pravatar.cc/40?u=william" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", avatar: "https://i.pravatar.cc/40?u=sofia" },
];

const DashboardOverviewPage: React.FC = () => {
  console.log('DashboardOverviewPage loaded');
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader
          userName="Admin Dashboard"
          userEmail="admin@example.com"
          notificationCount={3}
          onSearch={(term) => console.log('Overview search:', term)}
          userAvatarSrc="https://i.pravatar.cc/40?u=admin"
        />
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            
            {/* KPI Cards Section */}
            <section>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                  title="Total Revenue"
                  value="45,231.89"
                  unit="$"
                  icon={DollarSign}
                  description="+20.1% from last month"
                  trend={20.1}
                  trendDirection="positive"
                />
                <KPICard
                  title="Subscriptions"
                  value="2,350"
                  unit="+"
                  icon={Users}
                  description="+180.1% from last month"
                  trend={180.1}
                  trendDirection="positive"
                />
                <KPICard
                  title="Sales"
                  value="12,234"
                  unit="+"
                  icon={CreditCard}
                  description="+19% from last month"
                  trend={19}
                  trendDirection="positive"
                />
                <KPICard
                  title="Active Now"
                  value="573"
                  icon={Activity}
                  description="+201 since last hour"
                  trend="up"
                />
              </div>
            </section>

            {/* Charts and Recent Activity Section */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" hideLabel />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSalesData.map((sale) => (
                      <div key={sale.email} className="flex items-center">
                        <img alt="Avatar" className="h-9 w-9 rounded-full" src={sale.avatar} />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.name}</p>
                          <p className="text-sm text-muted-foreground">{sale.email}</p>
                        </div>
                        <div className="ml-auto font-medium">{sale.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;