"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const StatusChangeModal = ({ isOpen, onClose, currentStatus, onConfirm, projectId }) => {
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const statusOptions = ["In Progress", "Completed"];

  const handleSubmit = () => {
    if (newStatus) setShowConfirm(true);
  };

  const handleConfirm = () => {
    onConfirm(newStatus, projectId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-900">
            {showConfirm ? "Confirm Status Change" : "Update Project Status"}
          </DialogTitle>
        </DialogHeader>
        {!showConfirm ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions
                    .filter(status => status !== currentStatus)
                    .map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-100">Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newStatus} className="bg-blue-600 text-white hover:bg-blue-700">Proceed</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to change the project status to <span className="font-semibold text-blue-600">{newStatus}</span>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)} className="text-gray-600 border-gray-300 hover:bg-gray-100">Back</Button>
              <Button onClick={handleConfirm} className="bg-blue-600 text-white hover:bg-blue-700">Confirm</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeModal;