import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart3, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDataContext } from '@/hooks/useDataContext';
import { CouponSalesTable } from '@/components/admin/coupon-sales/CouponSalesTable';
import { CouponSalesChart } from '@/components/admin/coupon-sales/CouponSalesChart';
import { CouponSalesSummary } from '@/components/admin/coupon-sales/CouponSalesSummary';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminCouponSalesReport = () => {
  const { orders, coupons, plans } = useDataContext();
  
  const [couponFilter, setCouponFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by coupon code
      if (couponFilter && !order.couponCode?.toLowerCase().includes(couponFilter.toLowerCase())) {
        return false;
      }
      
      // Filter by plan
      if (planFilter !== 'all' && order.planId !== planFilter) {
        return false;
      }
      
      // Filter by date range
      if (dateFrom) {
        const orderDate = new Date(order.date);
        if (orderDate < dateFrom) return false;
      }
      
      if (dateTo) {
        const orderDate = new Date(order.date);
        // Set end of day for dateTo
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (orderDate > endOfDay) return false;
      }
      
      return true;
    });
  }, [orders, couponFilter, planFilter, dateFrom, dateTo]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredOrders.length;
    const approved = filteredOrders.filter(o => o.status === 'approved').length;
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length;
    const rejected = filteredOrders.filter(o => o.status === 'rejected').length;
    
    return { total, approved, pending, cancelled, rejected };
  }, [filteredOrders]);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Customer', 'Plan', 'Coupon Code', 'Status', 'Original Price', 'Final Price', 'Payment (Last 4)'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        format(new Date(order.date), 'yyyy-MM-dd'),
        order.userName,
        order.planName,
        order.couponCode || '',
        order.status,
        order.originalPrice,
        order.finalPrice,
        order.lastFourDigits
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupon-sales-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coupon Sales Report</h1>
        <p className="text-gray-600">Track sales performance by coupon code and time period</p>
      </div>

      <BackToAdminButton />

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Coupon Code Search */}
            <div className="space-y-2">
              <Label htmlFor="coupon-search">Coupon Code</Label>
              <Input
                id="coupon-search"
                placeholder="Search by coupon code..."
                value={couponFilter}
                onChange={(e) => setCouponFilter(e.target.value)}
              />
            </div>

            {/* Plan Filter */}
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans.map(plan => (
                    <SelectItem key={plan._id} value={plan._id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCouponFilter('');
                setPlanFilter('all');
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Clear Filters
            </Button>
            
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <CouponSalesSummary stats={summaryStats} />

      {/* Chart Section */}
      <CouponSalesChart stats={summaryStats} />

      {/* Detailed Table */}
      <CouponSalesTable orders={filteredOrders} />
    </div>
  );
};

export default AdminCouponSalesReport;
