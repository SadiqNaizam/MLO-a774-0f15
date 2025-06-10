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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Archived';
  imageUrl?: string;
}

const sampleProducts: Product[] = [
  { id: 'PROD001', name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 25.99, stock: 150, status: 'Active', imageUrl: 'https://source.unsplash.com/random/100x100?mouse' },
  { id: 'PROD002', name: 'Mechanical Keyboard', sku: 'MK-002', category: 'Electronics', price: 79.50, stock: 75, status: 'Active', imageUrl: 'https://source.unsplash.com/random/100x100?keyboard' },
  { id: 'PROD003', name: 'Ergonomic Chair', sku: 'EC-003', category: 'Furniture', price: 299.00, stock: 30, status: 'Active', imageUrl: 'https://source.unsplash.com/random/100x100?chair' },
  { id: 'PROD004', name: 'Desk Lamp', sku: 'DL-004', category: 'Home Goods', price: 45.00, stock: 0, status: 'Archived', imageUrl: 'https://source.unsplash.com/random/100x100?lamp' },
  { id: 'PROD005', name: 'Coffee Maker', sku: 'CM-005', category: 'Appliances', price: 89.99, stock: 60, status: 'Active', imageUrl: 'https://source.unsplash.com/random/100x100?coffee' },
];

const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  description: z.string().optional(),
  status: z.boolean().default(true), // true for Active, false for Archived
});
type ProductFormData = z.infer<typeof productFormSchema>;

const ITEMS_PER_PAGE = 10;

const ProductsManagementPage: React.FC = () => {
  console.log('ProductsManagementPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: '', sku: '', category: '', price: 0, stock: 0, description: '', status: true },
  });

  const filteredProducts = sampleProducts
    .filter(product =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter)
    );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.reset({ name: '', sku: '', category: '', price: 0, stock: 0, description: '', status: true });
    setIsSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status === 'Active',
      description: `Description for ${product.name}` // Placeholder description
    });
    setIsSheetOpen(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    // Placeholder for delete logic
    console.log("Delete product:", productId);
    alert(`Placeholder: Delete product ${productId}`);
  };

  const onSubmit = (data: ProductFormData) => {
    console.log('Product form submitted:', data);
    if (editingProduct) {
      console.log('Updating product:', editingProduct.id, data);
      // Placeholder: Update product in sampleProducts array or call API
    } else {
      console.log('Adding new product:', data);
      // Placeholder: Add product to sampleProducts array or call API
    }
    setIsSheetOpen(false);
    form.reset();
  };

  const uniqueCategories = ['all', ...new Set(sampleProducts.map(p => p.category.toLowerCase()))];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader userName="Products" userAvatarSrc="https://i.pravatar.cc/40?u=productsadmin" />
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Products Management</h1>
              <Button onClick={handleAddProduct}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by Product Name or SKU..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
               <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>Manage your product catalog.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img 
                            src={product.imageUrl || `https://source.unsplash.com/random/50x50?product&sig=${product.id}`} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'Active' ? 'default' : 'outline'}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                          <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                          </Button>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                        </TableCell>
                      </TableRow>
                    )) : (
                       <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">No products found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                   {paginatedProducts.length === 0 && <TableCaption>No results for current filter.</TableCaption>}
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

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
              <SheetDescription>
                {editingProduct ? `Update details for ${editingProduct.name}.` : 'Fill in the details for the new product.'}
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g. Wireless Keyboard" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sku" render={({ field }) => (
                  <FormItem><FormLabel>SKU</FormLabel><FormControl><Input placeholder="e.g. WK-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Home Goods">Home Goods</SelectItem>
                            <SelectItem value="Appliances">Appliances</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g. 29.99" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" placeholder="e.g. 100" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Detailed product description..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5"><FormLabel>Status</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Product status" /></FormControl>
                  </FormItem>
                )} />
                <SheetFooter className="pt-4">
                  <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                  <Button type="submit">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
         {/* Confirmation Dialog for Delete (Example) */}
        <Dialog>
            {/* <DialogTrigger is set programmatically or via button elsewhere if needed */}
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete the product.
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button variant="destructive">Confirm Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductsManagementPage;