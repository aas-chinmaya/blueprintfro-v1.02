








'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Briefcase, Mail, Phone, MapPin, MessageSquare, Tag, PlusCircle, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AddContactForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '', // New field for company name
    brandCategory: '',
    inquirySource: '',
    message: '', // Renamed from requirementSummary
    jobTitleOrRole: '',
    addressLocation: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate required fields
  const isValid = () =>
    formData.fullName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.phone.trim() &&
    formData.brandCategory;

  useEffect(() => setIsFormValid(isValid()), [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error('Invalid email format');
    if (!formData.phone.trim()) return toast.error('Phone number is required');
    if (!formData.brandCategory) return toast.error('Category is required');

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      toast.success('Contact added successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        brandCategory: '',
        inquirySource: '',
        message: '',
        jobTitleOrRole: '',
        addressLocation: '',
      });
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 flex items-center justify-center">
      <div className="w-full md:max-w-7xl space-y-6 border rounded-lg p-6 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="font-medium flex items-center">
              <User className="h-4 w-4 mr-1 text-blue-600" />
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="companyName" className="font-medium flex items-center">
              <Building className="h-4 w-4 mr-1 text-blue-600" />
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="brandCategory" className="font-medium flex items-center">
              <Tag className="h-4 w-4 mr-1 text-blue-600" />
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.brandCategory} onValueChange={handleSelectChange('brandCategory')}>
              <SelectTrigger className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {['Government', 'Corporate', 'Agency', 'Institution', 'Individual'].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email" className="font-medium flex items-center">
              <Mail className="h-4 w-4 mr-1 text-blue-600" />
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="font-medium flex items-center">
              <Phone className="h-4 w-4 mr-1 text-blue-600" />
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="jobTitleOrRole" className="font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-1 text-blue-600" />
              Job Title/Role
            </Label>
            <Input
              id="jobTitleOrRole"
              name="jobTitleOrRole"
              value={formData.jobTitleOrRole}
              onChange={handleChange}
              placeholder="Enter job title or role"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="inquirySource" className="font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
              Inquiry Source
            </Label>
            <Select value={formData.inquirySource} onValueChange={handleSelectChange('inquirySource')}>
              <SelectTrigger className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select inquiry source" />
              </SelectTrigger>
              <SelectContent>
                {['Website', 'Social Media', 'Event', 'Referral'].map((src) => (
                  <SelectItem key={src} value={src}>{src}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="addressLocation" className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
              Address
            </Label>
            <Textarea
              id="addressLocation"
              name="addressLocation"
              value={formData.addressLocation}
              onChange={handleChange}
              placeholder="Enter address"
              className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-y"
              rows={3}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="font-medium flex items-center">
            <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message or inquiry details"
            className="mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-y"
            rows={5} // Increased rows for prominence
          />
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {isFormValid && (
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              Add Contact
            </Button>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-100 rounded-md transition-colors"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddContactForm;