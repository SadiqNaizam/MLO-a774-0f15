import React, { useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Order {
  id: string;
  customer: { name: string; email: string };
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
}

const sampleOrders: Order[] = [
  { id: 'ORD001', customer: { name: 'John Doe', email: 'john.doe@example.com' }, date: '2023-10-26', status: 'Delivered', total: 125.50 },
  { id: 'ORD002', customer: { name: 'Jane Smith', email: 'jane.smith@example.com' }, date: '2023-10-25', status: 'Shipped', total: 78.00 },
  { id: 'ORD003', customer: { name: 'Alice Brown', email: 'alice.brown@example.com' }, date: '2023-10-24', status: 'Processing', total: 210.75 },
  { id: 'ORD004', customer: { name: 'Bob Green', email: 'bob.green@example.com' }, date: '2023-10-23', status: 'Pending', total: 55.20 },
  { id: 'ORD005', customer: { name: 'Charlie Black', email: 'charlie.black@example.com' }, date: '2023-10-22', status: 'Cancelled', total: 99.99 },
];

const ITEMS_PER_PAGE = 10;

const OrdersManagementPage: React.FC = () => {
  console.log('OrdersManagementPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = sampleOrders
    .filter(order => 
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
       order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || order.status.toLowerCase() === statusFilter)
    );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default'; // Green in many themes, actually 'default' is primary
      case 'Shipped': return 'secondary'; // Blue or secondary
      case 'Processing': return 'outline'; // Yellow or warning, use outline
      case 'Pending': return 'destructive'; // Orange or destructive (using destructive as a stand-in)
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader userName="Orders" userAvatarSrc="https://i.pravatar.cc/40?u=ordersadmin" />
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Orders Management</h1>
              {/* Could add an "Export Orders" button here */}
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="Search by Order ID or Customer Name..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>View and manage customer orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>{order.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                           <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>View Details</Button>
                           </DialogTrigger>
                           {/* Example additional actions using Dropdown */}
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => console.log("Update status for", order.id)}>Update Status</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log("Print invoice for", order.id)}>Print Invoice</DropdownMenuItem>
                            </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">No orders found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {paginatedOrders.length === 0 && <TableCaption>No results for current filter.</TableCaption>}
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage === 1} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {/* Add Ellipsis if many pages - simplified for now */}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </ScrollArea>

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Detailed information for order {selectedOrder.id}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p><strong>Customer:</strong> {selectedOrder.customer.name} ({selectedOrder.customer.email})</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                {/* Add more order details here, e.g., product items */}
                <h3 className="font-semibold mt-2">Items:</h3>
                <p className="text-sm text-muted-foreground">(Placeholder for product items list)</p>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button type="button" variant="secondary" onClick={() => console.log("Print invoice for", selectedOrder.id)}>
                  <FileText className="mr-2 h-4 w-4" /> Print Invoice
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default OrdersManagementPage;