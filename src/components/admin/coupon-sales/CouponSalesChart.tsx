
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface SummaryStats {
  total: number;
  approved: number;
  pending: number;
  cancelled: number;
  rejected: number;
}

interface CouponSalesChartProps {
  stats: SummaryStats;
}

const chartConfig = {
  approved: {
    label: "Approved",
    color: "#22c55e",
  },
  pending: {
    label: "Pending",
    color: "#eab308",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
  rejected: {
    label: "Rejected",
    color: "#dc2626",
  },
};

export const CouponSalesChart: React.FC<CouponSalesChartProps> = ({ stats }) => {
  const barData = [
    {
      name: 'Order Status',
      approved: stats.approved,
      pending: stats.pending,
      cancelled: stats.cancelled,
      rejected: stats.rejected,
    },
  ];

  const pieData = [
    { name: 'Approved', value: stats.approved, color: '#22c55e' },
    { name: 'Pending', value: stats.pending, color: '#eab308' },
    { name: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
    { name: 'Rejected', value: stats.rejected, color: '#dc2626' },
  ].filter(item => item.value > 0);

  if (stats.total === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Order Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No orders found for the selected criteria
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Order Status Bar Chart
          </CardTitle>
          <CardDescription>
            Comparison of order statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="approved" fill="var(--color-approved)" />
              <Bar dataKey="pending" fill="var(--color-pending)" />
              <Bar dataKey="cancelled" fill="var(--color-cancelled)" />
              <Bar dataKey="rejected" fill="var(--color-rejected)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
          <CardDescription>
            Percentage breakdown of order statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
