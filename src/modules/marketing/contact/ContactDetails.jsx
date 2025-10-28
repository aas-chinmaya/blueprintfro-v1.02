






'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getContactById,
  updateContactStatus,
  clearSelectedContact,
} from '@/features/marketing/contactSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import {
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  MessageSquare,
  Tag,
  CheckCircle,
  XCircle,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ContactDetails({ contactId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedContact, status, error } = useSelector((state) => state.contact);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (contactId) {
      dispatch(getContactById(contactId));
    }
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [contactId, dispatch]);
console.log(selectedContact);

  const handleStatusUpdate = () => {
    if (contactId && selectedStatus) {
      if (feedback.length > 500) {
        toast.error('Feedback cannot exceed 500 characters.');
        return;
      }
      dispatch(
        updateContactStatus({
          contactId,
          status: selectedStatus,
          feedback,
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Status updated successfully.');
          dispatch(getContactById(contactId));
          setIsFeedbackDialogOpen(false);
          setFeedback('');
          setSelectedStatus('');
        } else {
          toast.error('Failed to update status.');
        }
      });
    }
  };

  const openFeedbackDialog = (status) => {
    setSelectedStatus(status);
    setIsFeedbackDialogOpen(true);
  };

  const currentStatus = selectedContact?.status || '';
  let nextOptions = [];
  if (currentStatus === 'Contact Received') {
    nextOptions = ['Conversion Made', 'Follow-up Taken'];
  } else if (currentStatus === 'Follow-up Taken') {
    nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
  } else if (currentStatus === 'Conversion Made') {
    nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
  } else if (currentStatus === 'Converted to Lead') {
    nextOptions = ['Closed'];
  }

  // Status colors for chips
  let statusColor = 'bg-yellow-100 text-yellow-800';
  let StatusIcon = AlertCircle;
  if (currentStatus === 'Converted to Lead') {
    statusColor = 'bg-green-100 text-green-800';
    StatusIcon = CheckCircle;
  } else if (currentStatus === 'Closed') {
    statusColor = 'bg-red-100 text-red-800';
    StatusIcon = XCircle;
  }

  // Action button colors
  const getButtonStyles = (option) => {
    switch (option) {
      case 'Conversion Made':
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 hover:border-blue-400';
      case 'Follow-up Taken':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 hover:border-purple-400';
      case 'Converted to Lead':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400';
      case 'Closed':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
    }
  };

  const actionHistory = selectedContact?.actionHistory || [
    {
      status: 'Contact Received',
      feedback: 'Initial inquiry received via website form. Awaiting first response.',
      date: '2025-10-01 10:23 AM',
    },
    {
      status: 'Follow-up Taken',
      feedback: 'Marketing team contacted the client for requirement clarification.',
      date: '2025-10-03 02:15 PM',
    },
    {
      status: 'In Progress',
      feedback: 'Client requested a demo. Schedule shared for next week.',
      date: '2025-10-05 11:42 AM',
    },
    {
      status: 'Converted to Lead',
      feedback: 'Client confirmed interest in product subscription. Lead transferred to sales.',
      date: '2025-10-07 09:30 AM',
    },
    {
      status: 'Closed',
      feedback: 'No further updates from client. Case closed after multiple follow-ups.',
      date: '2025-10-15 04:55 PM',
    },
  ];

  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex cursor-pointer items-center gap-2 bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            <span
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                statusColor
              )}
            >
              <StatusIcon className="h-4 w-4 mr-1" />
              {currentStatus || 'N/A'}
            </span>
          </div>

          {/* Loading State */}
          {status === 'loading' && !selectedContact ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="mt-2 text-gray-600">Loading contact details...</span>
            </div>
          ) : error && !selectedContact ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : selectedContact ? (
            <div className="space-y-8">
              {/* Take Action (Hidden if Closed) */}
              {nextOptions.length > 0 && currentStatus !== 'Closed' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Take Action
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {nextOptions.map((option) => (
                      <Button
                        key={option}
                        className={cn(
                          'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
                          'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                          getButtonStyles(option)
                        )}
                        onClick={() => openFeedbackDialog(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Detail icon={Tag} label="Contact ID" value={selectedContact.contactId} color="text-blue-600" />
                  <Detail icon={User} label="Contact Person Name" value={selectedContact.fullName} color="text-blue-600" />
                  <Detail icon={Mail} label="Email Address" value={selectedContact.email} color="text-green-600" />
                  <Detail icon={Phone} label="Phone Number" value={selectedContact.phone} color="text-green-600" />
                  <Detail icon={Building} label="Company Name" value={selectedContact.companyName} color="text-purple-600" />
                  <Detail icon={Briefcase} label="Role in Organization" value={selectedContact.designation} color="text-purple-600" />
                  <Detail icon={Building} label="Brand Category" value={selectedContact.brandCategory} color="text-indigo-600" />
                  <Detail icon={MapPin} label="Location" value={selectedContact.location} color="text-indigo-600" />
                  {selectedContact.serviceInterest?.length > 0 && (
                    <Detail
                      icon={Tag}
                      label="Services of Interest"
                      value={selectedContact.serviceInterest.join(', ')}
                      color="text-red-600"
                    />
                  )}
                  <Detail
                    icon={MessageSquare}
                    label="Referral Source"
                    value={selectedContact.referralSource}
                    color="text-red-600"
                  />
                  <div className="sm:col-span-2">
                    <Detail icon={MessageSquare} label="Message" value={selectedContact.message} color="text-gray-600" />
                  </div>
                  <div className="sm:col-span-2">
                    <Detail icon={MessageSquare} label="Latest Feedback" value={selectedContact.feedback} color="text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Action History */}
              {actionHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Action History
                  </h3>
                  <div className="space-y-4 overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => {
                      let historyColor = 'bg-yellow-100 text-yellow-800';
                      let HistoryIcon = AlertCircle;
                      if (action.status === 'Converted to Lead') {
                        historyColor = 'bg-green-100 text-green-800';
                        HistoryIcon = CheckCircle;
                      } else if (action.status === 'Closed') {
                        historyColor = 'bg-red-100 text-red-800';
                        HistoryIcon = XCircle;
                      } else if (action.status === 'In Progress') {
                        historyColor = 'bg-blue-100 text-blue-800';
                        HistoryIcon = AlertCircle;
                      } else if (action.status === 'Follow-up Taken') {
                        historyColor = 'bg-purple-100 text-purple-800';
                        HistoryIcon = AlertCircle;
                      }
                      return (
                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-center mb-1">
                            <HistoryIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                historyColor
                              )}
                            >
                              {action.status}
                            </span>
                          </div>
                          {action.feedback && <p className="text-sm text-gray-600">{action.feedback}</p>}
                          {action.date && <p className="text-xs text-gray-400">{action.date}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg text-gray-600 text-center py-6">No contact found.</div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Update Status: {selectedStatus}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-gray-700">Feedback (max 500 characters)</Label>
              <textarea
                placeholder="Share your thoughts..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1 w-full h-32 border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{feedback.length}/500 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedStatus}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ icon: Icon, label, value, color }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className={cn('h-5 w-5 mt-0.5', color)} />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}














