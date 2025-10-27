



"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProjectById, changeProjectStatus, resetSuccessMessage } from "@/features/projectSlice";
import { FiInfo, FiUsers, FiList, FiDownload } from "react-icons/fi";
import { BugIcon, Dock, FolderClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDateUTC } from "@/utils/formatDate";
import StatusChangeModal from "./StatusChangeModal";
import ProjectMetrics from "./ProjectMetrics";
import ProjectBudgetWrapper from "../budget/budgetWraper";
import TeamManagement from "../Teams/TeamManagement";
import AllTaskListByProjectId from "@/modules/Tasks/task/AllTaskListByProjectId";
import ProjectWisebugList from "../bug/ProjectWisebugList";
import ProjectwiseAllMeetingAndMom from "../meetings/project/ProjectwiseAllmeetingMom";
import DocumentManager from "../document/project-doc/DocumentManager";

// Skeleton Loader for tab content
const SkeletonLoader = () => (
  <div className="space-y-6">
    <Skeleton className="h-32 w-full rounded-lg" />
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-32 w-full rounded-lg" />
  </div>
);

// Tab Content Components
const DetailsTab = ({ project, projectId, canEditStatus, setIsStatusModalOpen, currentUser }) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <ProjectMetrics projectId={projectId} />
      
      {/* Project Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiInfo className="h-5 w-5 text-blue-600" />
              Project Information
            </h3>
            {(currentUser?.role?.toLowerCase() === "cpc" || currentUser?.position === "Team Lead") && (
              <Button 
                size="sm" 
                onClick={() => router.push(`/project/edit/${projectId}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: <FiInfo className="h-4 w-4 text-green-600" />, label: "Project ID", value: project?.projectId || "N/A" },
              { icon: <FiInfo className="h-4 w-4 text-green-600" />, label: "Category", value: project?.category || "N/A" },
              { icon: <FiInfo className="h-4 w-4 text-green-600" />, label: "Client ID", value: project?.clientId || "N/A" },
              { 
                icon: <FiInfo className="h-4 w-4 text-green-600" />, 
                label: "Status", 
                value: (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    project?.status === "Completed" ? "bg-green-100 text-green-800" :
                    project?.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                    project?.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {project?.status || "N/A"}
                    {canEditStatus && <FiInfo className="w-3 h-3 cursor-pointer ml-1" onClick={() => setIsStatusModalOpen(true)} />}
                  </div>
                )
              },
              { icon: <FiInfo className="h-4 w-4 text-green-600" />, label: "Team Lead", value: project?.teamLeadName || "Unassigned" },
              { icon: <FiInfo className="h-4 w-4 text-green-600" />, label: "Onboarding", value: project?.createdAt ? formatDateUTC(project?.createdAt) : "N/A" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium w-24 text-gray-600">{item.label}:</span>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Description */}
      {(project?.startDate || project?.endDate || project?.description) && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiInfo className="h-5 w-5 text-blue-600" />
              Timeline & Description
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                project?.startDate && { label: "Start Date", value: formatDateUTC(project.startDate) },
                project?.endDate && { label: "End Date", value: formatDateUTC(project.endDate) },
                project?.expectedEndDate && { label: "Expected End", value: formatDateUTC(project.expectedEndDate) },
              ].filter(Boolean).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiInfo className="h-4 w-4 text-green-600" />
                  <span className="font-medium w-24 text-gray-600">{item.label}:</span>
                  <span className="text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            {project?.description && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.description || "No description available"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function ProjectMainView({ projectId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { project, status, error, successMessage } = useSelector((state) => state.project);
  const { currentUser, isTeamLead } = useCurrentUser(project?.data?.teamLeadId);

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "details");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const scrollRef = useRef(null);

  // Tabs configuration
  const tabs = [
    { id: "details", label: "Details", icon: <FiInfo className="h-5 w-5" /> },
    { id: "budget", label: "Budget", icon: <FiInfo className="h-5 w-5" /> },
    { id: "team", label: "Team", icon: <FiUsers className="h-5 w-5" /> },
    { id: "task", label: "Task", icon: <FiList className="h-5 w-5" /> },
    { id: "bug", label: "Bug", icon: <BugIcon className="h-5 w-5" /> },
    { id: "mom", label: "MoM", icon: <FolderClock className="h-5 w-5" /> },
    { id: "document", label: "Document", icon: <Dock className="h-5 w-5" /> },
  ];

  const cardHeight = "h-[calc(100vh-200px)]";

  // Fetch project data
  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  // Sync tab with URL
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success("Status Updated!");
      dispatch(fetchProjectById(projectId));
      dispatch(resetSuccessMessage());
    }
  }, [successMessage, dispatch, projectId]);

  // Update URL on tab change
  useEffect(() => {
    router.replace(`/project-management/${projectId}?tab=${activeTab}`);
  }, [activeTab, projectId, router]);

  // Handle tab loading state on tab change
  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 300); // Small delay to simulate loading/switch
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleConfirmStatusChange = (newStatus) => {
    if (newStatus && projectId) {
      dispatch(changeProjectStatus({ projectId, status: newStatus }));
      setIsStatusModalOpen(false);
    }
  };

  const canEditStatus = currentUser?.role?.toLowerCase() === "cpc" || isTeamLead || currentUser?.position === "Team Lead";

  const renderTabContent = () => {
    const projectData = project?.data;
    
    switch (activeTab) {
      case "details":
        return <DetailsTab 
          project={projectData} 
          projectId={projectId} 
          canEditStatus={canEditStatus}
          setIsStatusModalOpen={setIsStatusModalOpen}
          currentUser={currentUser}
        />;
      case "budget":
        return <ProjectBudgetWrapper projectId={projectId} />;
      case "team":
        return <TeamManagement project={projectData} projectId={projectId} />;
      case "task":
        return <AllTaskListByProjectId project={projectData} projectId={projectId} />;
      case "bug":
        return <ProjectWisebugList project={projectData} projectId={projectId} teamLeadId={projectData?.teamLeadId} />;
      case "mom":
        return <ProjectwiseAllMeetingAndMom 
          projectName={projectData?.projectName} 
          project={projectData} 
          projectId={projectId} 
          teamLeadId={projectData?.teamLeadId} 
        />;
      case "document":
        return <DocumentManager project={projectData} projectId={projectId} teamLeadId={projectData?.teamLeadId} />;
      default:
        return null;
    }
  };

  if (!project || status === 'loading') {
    return (
      <div className="p-4 md:p-6 w-full space-y-4 min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 w-full">
          <Skeleton className="h-9 w-24 rounded-full" /> {/* Back button */}
          <Skeleton className="h-8 w-64" /> {/* Title */}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 sm:px-4 pb-2">
          {tabs.map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 flex-shrink-0 rounded" />
          ))}
        </div>

        {/* Content Card Skeleton */}
        <Card className={cardHeight}>
          <CardContent className="h-full p-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <SkeletonLoader />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full space-y-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 w-full">
        {/* Back Button */}
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

        {/* Project Name */}
        <h1 
          className="text-2xl font-semibold tracking-tight truncate overflow-hidden"
          title={project.data?.projectName}
        >
          {project.data?.projectName || "Unnamed Project"}
        </h1>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-2 sm:px-4 pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex-shrink-0
              ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className={`${cardHeight} w-full`}>
        <CardContent className="h-full p-0 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {isTabLoading ? <SkeletonLoader /> : renderTabContent()}
          </div>
        </CardContent>
      </Card>

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={project?.data?.status}
        onConfirm={handleConfirmStatusChange}
        projectId={projectId}
      />
    </div>
  );
}