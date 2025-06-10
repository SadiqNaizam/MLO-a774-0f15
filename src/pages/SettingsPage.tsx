import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCircle, Store, Bell } from 'lucide-react';

// Profile Settings Schema
const profileSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

// Store Settings Schema
const storeSettingsSchema = z.object({
  storeName: z.string().min(3, "Store name is too short"),
  storeDescription: z.string().max(200, "Description too long").optional(),
  currency: z.string().default("USD"),
  maintenanceMode: z.boolean().default(false),
});
type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;

// Notification Settings Schema
const notificationSettingsSchema = z.object({
  emailOnNewOrder: z.boolean().default(true),
  emailOnOrderStatusChange: z.boolean().default(true),
  notificationFrequency: z.string().default("instant"), // 'instant', 'daily_summary'
});
type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;


const SettingsPage: React.FC = () => {
  console.log('SettingsPage loaded');

  const profileForm = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: { fullName: 'Admin User', email: 'admin@example.com', newPassword: '', confirmPassword: '' },
  });

  const storeForm = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: { storeName: 'My Awesome Store', storeDescription: '', currency: 'USD', maintenanceMode: false },
  });
  
  const notificationForm = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: { emailOnNewOrder: true, emailOnOrderStatusChange: true, notificationFrequency: 'instant' },
  });

  const onProfileSubmit = (data: ProfileSettingsFormData) => console.log('Profile settings submitted:', data);
  const onStoreSubmit = (data: StoreSettingsFormData) => console.log('Store settings submitted:', data);
  const onNotificationSubmit = (data: NotificationSettingsFormData) => console.log('Notification settings submitted:', data);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader userName="Settings" userAvatarSrc="https://i.pravatar.cc/40?u=settingsadmin" />
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold">Settings</h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile"><UserCircle className="mr-2 h-4 w-4 inline-block" />Profile</TabsTrigger>
                <TabsTrigger value="store"><Store className="mr-2 h-4 w-4 inline-block" />Store</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline-block" />Notifications</TabsTrigger>
              </TabsList>

              {/* Profile Settings Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal account details and password.</CardDescription>
                  </CardHeader>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={profileForm.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={profileForm.control} name="newPassword" render={({ field }) => (
                          <FormItem><FormLabel>New Password (Optional)</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormDescription>Leave blank to keep current password.</FormDescription><FormMessage /></FormItem>
                        )} />
                        <FormField control={profileForm.control} name="confirmPassword" render={({ field }) => (
                          <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </CardContent>
                      <CardFooter>
                        <Button type="submit">Save Profile Changes</Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>

              {/* Store Settings Tab */}
              <TabsContent value="store">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Settings</CardTitle>
                    <CardDescription>Configure general settings for your store.</CardDescription>
                  </CardHeader>
                  <Form {...storeForm}>
                    <form onSubmit={storeForm.handleSubmit(onStoreSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField control={storeForm.control} name="storeName" render={({ field }) => (
                          <FormItem><FormLabel>Store Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={storeForm.control} name="storeDescription" render={({ field }) => (
                          <FormItem><FormLabel>Store Description (Optional)</FormLabel><FormControl><Textarea placeholder="A brief description of your store" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={storeForm.control} name="currency" render={({ field }) => (
                          <FormItem><FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              </SelectContent>
                            </Select>
                          <FormMessage /></FormItem>
                        )} />
                        <FormField control={storeForm.control} name="maintenanceMode" render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5"><FormLabel>Maintenance Mode</FormLabel><FormDescription>Temporarily disable customer access to the store.</FormDescription></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )} />
                      </CardContent>
                      <CardFooter>
                        <Button type="submit">Save Store Settings</Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
              
              {/* Notification Settings Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                  </CardHeader>
                  <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField control={notificationForm.control} name="emailOnNewOrder" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Email on New Order</FormLabel><FormDescription>Receive an email for each new order.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={notificationForm.control} name="emailOnOrderStatusChange" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Email on Order Status Change</FormLabel><FormDescription>Receive an email when an order status is updated.</FormDescription></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                             <FormField control={notificationForm.control} name="notificationFrequency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>General Notification Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="instant">Instant</SelectItem>
                                            <SelectItem value="daily_summary">Daily Summary</SelectItem>
                                            <SelectItem value="weekly_summary">Weekly Summary</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>How often to receive general system notifications.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Notification Settings</Button>
                        </CardFooter>
                      </form>
                  </Form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SettingsPage;