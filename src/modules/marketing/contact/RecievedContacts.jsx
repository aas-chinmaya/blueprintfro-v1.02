



'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllContacts, addContact } from '@/features/marketing/contactSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Search,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlusCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import AddContactForm from './AddContactForm';

export default function Contact() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { contacts, status } = useSelector((state) => state.contact);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(8);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  const handleViewContact = (contactId) => {
    router.push(`/marketing/contacts/${contactId}`);
  };

  const resetDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [contactsPerPage]);

  const filteredAndSortedContacts = useMemo(() => {
    let result = contacts.filter((contact) => !contact.isDeleted);

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          (c.fullName || '').toLowerCase().includes(lowerSearch) ||
          (c.email || '').toLowerCase().includes(lowerSearch) ||
          (c.phone || '').toLowerCase().includes(lowerSearch) ||
          (c.brandCategory || '').toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((contact) => contact.status === filterStatus);
    }

    if (dateRange.from && dateRange.to) {
      result = result.filter((contact) =>
        contact.createdAt
          ? isWithinInterval(parseISO(contact.createdAt), { start: dateRange.from, end: dateRange.to })
          : false
      );
    }

    result.sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      if (sortField === 'createdAt') {
        const dateA = fieldA ? parseISO(fieldA) : new Date(0);
        const dateB = fieldB ? parseISO(fieldB) : new Date(0);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return result;
  }, [contacts, searchTerm, sortField, sortOrder, filterStatus, dateRange]);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredAndSortedContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredAndSortedContacts.length / contactsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddContact = (contactData) => {
    dispatch(addContact(contactData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Contact added successfully.');
        dispatch(getAllContacts());
        setIsAddModalOpen(false);
      } else {
        toast.error('Failed to add contact.');
      }
    });
  };

  const totalContacts = contacts.filter((c) => !c.isDeleted).length;
  const statusCounts = {
    'Contact Received': contacts.filter((c) => !c.isDeleted && c.status === 'Contact Received').length,
    'Conversion Made': contacts.filter((c) => !c.isDeleted && c.status === 'Conversion Made').length,
    'Follow-up Taken': contacts.filter((c) => !c.isDeleted && c.status === 'Follow-up Taken').length,
    Converted: contacts.filter((c) => !c.isDeleted && c.status === 'Converted').length,
    Closed: contacts.filter((c) => !c.isDeleted && c.status === 'Closed').length,
  };

  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold flex items-center">
              All Contacts
            </CardTitle>
            <Button
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-blue-800">Total Contacts Received</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{totalContacts}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-green-800">Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{statusCounts.Converted}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-red-800">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{statusCounts.Closed}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-success" />
              <Input
                placeholder="Search by name, email, phone, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border rounded-lg"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 border rounded-lg">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Contact Received">Contact Received</SelectItem>
                <SelectItem value="Conversion Made">Conversion Made</SelectItem>
                <SelectItem value="Follow-up Taken">Follow-up Taken</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border text-foreground hover:bg-muted rounded-lg"
                  >
                    <Calendar className="h-5 w-5 mr-2 text-success" />
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`
                      : 'Select Date Range'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                    className="bg-card text-card-foreground"
                  />
                </PopoverContent>
              </Popover>
              {dateRange.from && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-danger hover:bg-muted"
                  onClick={resetDateRange}
                  title="Reset Date Range"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <TableHead
                    className="cursor-pointer text-white font-semibold min-w-[120px]"
                    onClick={() => handleSort('fullName')}
                  >
                    Full Name
                    <ArrowUpDown className="inline ml-2 h-4 w-4 text-success" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer font-semibold text-white min-w-[150px]"
                    onClick={() => handleSort('email')}
                  >
                    Email / Phone
                    <ArrowUpDown className="inline ml-2 h-4 w-4 text-success" />
                  </TableHead>
                  <TableHead
                    className="text-white cursor-pointer font-semibold min-w-[120px]"
                    onClick={() => handleSort('brandCategory')}
                  >
                    Brand Type
                    <ArrowUpDown className="inline ml-2 h-4 w-4 text-success" />
                  </TableHead>
                  <TableHead className="font-semibold min-w-[100px] text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-success mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : currentContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-foreground">
                          No contacts found matching your criteria.
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Try adjusting your search or filters.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentContacts.map((contact) => (
                    <TableRow
                      key={contact._id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewContact(contact.contactId)}
                    >
                      <TableCell className="whitespace-nowrap">
                        {contact.fullName || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {contact.email || contact.phone || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {contact.brandCategory || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                            contact.status === 'Converted'
                              ? 'bg-success text-success-foreground'
                              : contact.status === 'Closed'
                              ? 'bg-danger text-danger-foreground'
                              : 'bg-warning text-warning-foreground'
                          )}
                        >
                          {contact.status === 'Converted' ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : contact.status === 'Closed' ? (
                            <XCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-1" />
                          )}
                          {contact.status || 'N/A'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="contactsPerPage" className="text-foreground">
                  Contacts per page:
                </Label>
                <Select
                  value={contactsPerPage.toString()}
                  onValueChange={(value) => setContactsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-24 border rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Previous
                </Button>
                {[...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page + 1}
                    variant={currentPage === page + 1 ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      currentPage === page + 1
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary hover:text-primary-foreground'
                    }
                  >
                    {page + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={() => setIsAddModalOpen(false)}>
        <DialogContent className="w-full overflow-y-auto rounded-lg">
          <DialogHeader className="bg-blue-100 text-blue-800 p-4 rounded-t-lg">
            <DialogTitle className="text-xl font-bold flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-success" />
              Add New Contact
            </DialogTitle>
          </DialogHeader>
          <AddContactForm onSubmit={handleAddContact} onCancel={() => setIsAddModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}