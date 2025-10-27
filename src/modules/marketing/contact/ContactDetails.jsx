


'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getContactById,
  updateContactStatus,
  clearSelectedContact,
} from '@/features/contactSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ContactDetails({ contactId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedContact, status, error } = useSelector((state) => state.contact);

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (contactId) {
      dispatch(getContactById(contactId));
    }
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [contactId, dispatch]);

  const handleStatusUpdate = (newStatus) => {
    if (contactId && newStatus) {
      dispatch(
        updateContactStatus({
          contactId,
          status: newStatus,
          feedback,
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Status updated successfully.');
          dispatch(getContactById(contactId));
        } else {
          toast.error('Failed to update status.');
        }
      });
      setFeedback('');
    }
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

  let statusColor = 'bg-yellow-100 text-yellow-800';
  let StatusIcon = AlertCircle;
  if (currentStatus === 'Converted to Lead') {
    statusColor = 'bg-green-100 text-green-800';
    StatusIcon = CheckCircle;
  } else if (currentStatus === 'Closed') {
    statusColor = 'bg-red-100 text-red-800';
    StatusIcon = XCircle;
  }

  const actionHistory = selectedContact?.actionHistory || [];

  return (
    <div className="w-full mx-auto p-6">
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
        
      </div>

      {status === 'loading' && !selectedContact ? (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-success" />
          <span>Loading contact details...</span>
        </div>
      ) : error && !selectedContact ? (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : selectedContact ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Detail icon={Tag} label="Contact ID" value={selectedContact.contactId} />
              <Detail icon={User} label="Full Name" value={selectedContact.fullName} />
              <Detail icon={Mail} label="Email" value={selectedContact.email} />
              <Detail icon={Phone} label="Phone" value={selectedContact.phone} />
              <Detail icon={Building} label="Company" value={selectedContact.companyName} />
              <Detail icon={Briefcase} label="Designation" value={selectedContact.designation} />
              <Detail icon={Building} label="Brand Category" value={selectedContact.brandCategory} />
              <Detail icon={MapPin} label="Location" value={selectedContact.location} />
              {selectedContact.serviceInterest?.length > 0 && (
                <Detail
                  icon={Tag}
                  label="Service Interest"
                  value={selectedContact.serviceInterest.join(', ')}
                />
              )}
              <Detail
                icon={MessageSquare}
                label="Referral Source"
                value={selectedContact.referralSource}
              />
              <Detail icon={MessageSquare} label="Message" value={selectedContact.message} />
              <Detail icon={MessageSquare} label="Feedback" value={selectedContact.feedback} />
              <div className="flex items-center">
                <StatusIcon className="h-5 w-5 mr-2 text-success" />
                <p className="text-sm">
                  <strong>Status:</strong>{' '}
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      statusColor
                    )}
                  >
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {currentStatus || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            {actionHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
                  <Edit className="h-5 w-5 mr-2 text-success" />
                  Action History
                </h3>
                <ul className="space-y-4 text-sm">
                  {actionHistory.map((action, index) => {
                    let historyColor = 'bg-yellow-100 text-yellow-800';
                    let HistoryIcon = AlertCircle;
                    if (action.status === 'Converted to Lead') {
                      historyColor = 'bg-green-100 text-green-800';
                      HistoryIcon = CheckCircle;
                    } else if (action.status === 'Closed') {
                      historyColor = 'bg-red-100 text-red-800';
                      HistoryIcon = XCircle;
                    }
                    return (
                      <li key={index} className="border-b pb-2 last:border-b-0">
                        <div className="flex items-center mb-1">
                          <HistoryIcon className="h-4 w-4 mr-2" />
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              historyColor
                            )}
                          >
                            {action.status}
                          </span>
                        </div>
                        {action.feedback && <p className="text-gray-600">{action.feedback}</p>}
                        {action.date && <p className="text-xs text-gray-500">{action.date}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {nextOptions.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
                  <Edit className="h-5 w-5 mr-2 text-success" />
                  Take Action
                </h3>
                <div className="grid sm:grid-cols-1 gap-4">
                  <div>
                    <Label className="font-semibold text-sm">Feedback</Label>
                    <Input
                      placeholder="Enter feedback..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-1 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {nextOptions.map((option) => (
                    <Button
                      key={option}
                      className="bg-blue-700 hover:bg-blue-800 text-sm"
                      onClick={() => handleStatusUpdate(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-lg p-6 text-center">No contact found.</div>
      )}
    </div>
  );
}

// Small reusable detail row
function Detail({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center">
      <Icon className="h-5 w-5 mr-2 text-success" />
      <p className="text-sm">
        <strong>{label}:</strong> {value}
      </p>
    </div>
  );
}