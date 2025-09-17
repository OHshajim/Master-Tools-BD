
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  paymentSearchQuery: string;
  setPaymentSearchQuery: (value: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  paymentSearchQuery,
  setPaymentSearchQuery
}) => {
  const handlePaymentSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setPaymentSearchQuery(value);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter orders by status, search by name, or payment digits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* First row - Status filter */}
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Second row - Search fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium mb-1">Search by Name</label>
              <Input
                placeholder="Search by user or plan name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Payment Last 4 Digits</label>
              <Input
                placeholder="e.g. 2255"
                value={paymentSearchQuery}
                onChange={handlePaymentSearchChange}
                maxLength={4}
                className="text-center font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Enter last 4 digits of payment number</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFilters;
