import React, { useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  avatarUrl?: string;
  lastOrderDate?: string;
  address?: { street: string; city: string; country: string };
}

const sampleCustomers: Customer[] = [
  { id: 'CUST001', name: 'Liam Johnson', email: 'liam.johnson@example.com', joinDate: '2023-01-15', totalOrders: 5, totalSpent: 350.75, avatarUrl: 'https://i.pravatar.cc/40?u=liam', lastOrderDate: '2023-10-20', address: { street: '123 Maple St', city: 'Springfield', country: 'USA' } },
  { id: 'CUST002', name: 'Olivia Davis', email: 'olivia.davis@example.com', joinDate: '2022-11-20', totalOrders: 12, totalSpent: 1250.00, avatarUrl: 'https://i.pravatar.cc/40?u=olivia', lastOrderDate: '2023-10-25', address: { street: '456 Oak Ave', city: 'Willow Creek', country: 'Canada' } },
  { id: 'CUST003', name: 'Noah Martinez', email: 'noah.martinez@example.com', joinDate: '2023-05-10', totalOrders: 2, totalSpent: 99.50, avatarUrl: 'https://i.pravatar.cc/40?u=noah', lastOrderDate: '2023-09-15', address: { street: '789 Pine Ln', city: 'Rivertown', country: 'USA' } },
  { id: 'CUST004', name: 'Emma Garcia', email: 'emma.garcia@example.com', joinDate: '2021-07-01', totalOrders: 25, totalSpent: 2800.20, avatarUrl: 'https://i.pravatar.cc/40?u=emma', lastOrderDate: '2023-10-01', address: { street: '101 Birch Rd', city: 'Forestville', country: 'UK' } },
  { id: 'CUST005', name: 'Ava Rodriguez', email: 'ava.rodriguez@example.com', joinDate: '2023-08-02', totalOrders: 1, totalSpent: 45.00, avatarUrl: 'https://i.pravatar.cc/40?u=ava', lastOrderDate: '2023-08-02', address: { street: '222 Cedar Dr', city: 'Mountain View', country: 'USA' } },
];

const ITEMS_PER_PAGE = 10;

const CustomersManagementPage: React.FC = () => {
  console.log('CustomersManagementPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // e.g., 'all', 'new', 'active'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = sampleCustomers
    .filter(customer =>
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterOption === 'all' /* Add more filter logic based on filterOption */)
    );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader userName="Customers" userAvatarSrc="https://i.pravatar.cc/40?u=customeradmin" />
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Customers Management</h1>
              {/* Add "Export Customers" button if needed */}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by Name or Email..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Select value={filterOption} onValueChange={(value) => { setFilterOption(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="new_last_30_days">New (Last 30 days)</SelectItem>
                  <SelectItem value="active_with_orders">Active (With Orders)</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>View and manage customer information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-center">Total Orders</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.length > 0 ? paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.joinDate}</TableCell>
                        <TableCell className="text-center">{customer.totalOrders}</TableCell>
                        <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                              <Eye className="mr-1 h-4 w-4" /> View
                            </Button>
                          </DialogTrigger>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No customers found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {paginatedCustomers.length === 0 && <TableCaption>No results for current filter.</TableCaption>}
                </Table>
              </CardContent>
            </Card>

            {totalPages > 1 && (
               <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1);}} aria-disabled={currentPage === 1} /></PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </ScrollArea>
        
        {selectedCustomer && (
          <Dialog open={!!selectedCustomer} onOpenChange={(isOpen) => !isOpen && setSelectedCustomer(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedCustomer.avatarUrl} alt={selectedCustomer.name} />
                    <AvatarFallback>{getInitials(selectedCustomer.name)}</AvatarFallback>
                  </Avatar>
                  {selectedCustomer.name}
                </DialogTitle>
                <DialogDescription>Customer since {selectedCustomer.joinDate}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{selectedCustomer.email}</span></div>
                {selectedCustomer.address && (
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> <span>{`${selectedCustomer.address.street}, ${selectedCustomer.address.city}, ${selectedCustomer.address.country}`}</span></div>
                )}
                <div className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-muted-foreground" /> <span>{selectedCustomer.totalOrders} orders, total spent ${selectedCustomer.totalSpent.toFixed(2)}</span></div>
                {selectedCustomer.lastOrderDate && <p className="text-sm text-muted-foreground">Last order on: {selectedCustomer.lastOrderDate}</p>}
                
                <h3 className="font-semibold mt-4">Order History (Placeholder)</h3>
                <div className="text-sm text-muted-foreground border rounded-md p-3 h-32 overflow-y-auto">
                  <p>- Order #ORDXYZ (2 items) - $45.00 - {selectedCustomer.lastOrderDate || 'N/A'}</p>
                  <p>- Order #ORDABC (1 item) - $22.50 - 2023-07-11</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => console.log('View all orders for', selectedCustomer.id)}>View All Orders</Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CustomersManagementPage;