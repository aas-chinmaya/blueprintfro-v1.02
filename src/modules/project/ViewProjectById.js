

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  changeProjectStatus,
  resetSuccessMessage,
} from "@/features/projectSlice";
import {
  FiDownload,
  FiUsers,
  FiList,
  FiFileText,
  FiInfo,
  FiCalendar,
  FiUser,
  FiEdit,
  FiPaperclip,
} from "react-icons/fi";
import {
  Briefcase,
  TrendingUp,
  FileStack,
  BugIcon,
  Pencil,
  Dock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AllTaskListByProjectId from "@/modules/Tasks/task/AllTaskListByProjectId";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuFolderClock } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProjectWisebugList from "../bug/ProjectWisebugList";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProjectwiseAllMeetingAndMom from "../meetings/project/ProjectwiseAllmeetingMom";
import { formatDateUTC } from "@/utils/formatDate";
import DocumentManager from "../document/project-doc/DocumentManager";
import ProjectMetrics from "./ProjectMetrics";
import TeamManagement from "../Teams/TeamManagement";

import ProjectBudgetWrapper from "../budget/budgetWraper";

export default function ViewProjectById({ projectId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "details";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (activeTab !== initialTab) {
      router.replace(`/project/${projectId}?tab=${activeTab}`);
    }
  }, [activeTab, projectId, router, initialTab]);

  const dispatch = useDispatch();
  const { project, status, error, successMessage } = useSelector(
    (state) => state.project
  );
  const { currentUser, isTeamLead } = useCurrentUser(project?.data?.teamLeadId);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasFetchedAfterStatusChange, setHasFetchedAfterStatusChange] =
    useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (successMessage && !hasFetchedAfterStatusChange) {
      setStatusUpdateMessage(successMessage);
      setHasFetchedAfterStatusChange(true);
      dispatch(fetchProjectById(projectId));
      setNewStatus("");
      setTimeout(() => {
        setStatusUpdateMessage("");
        dispatch(resetSuccessMessage());
        setHasFetchedAfterStatusChange(false);
      }, 3000);
    }
    if (error.statusChange) {
      setStatusUpdateMessage(error.statusChange);
      setTimeout(() => setStatusUpdateMessage(""), 3000);
    }
  }, [
    successMessage,
    error.statusChange,
    dispatch,
    projectId,
    hasFetchedAfterStatusChange,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (url, filename) => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const handleStatusSubmit = () => {
    if (newStatus) {
      setIsStatusModalOpen(false);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (newStatus && projectId) {
      dispatch(changeProjectStatus({ projectId, status: newStatus }));
      setIsConfirmModalOpen(false);
      toast.success("Status Updated!");
    }
  };

  const statusOptions = ["In Progress", "Completed"];

  const tabs = [
    { id: "details", label: "Details", icon: <FiInfo className="h-5 w-5" /> },
    { id: "budget", label: "Budget", icon: <FiInfo className="h-5 w-5" /> },
    { id: "team", label: "Team", icon: <FiUsers className="h-5 w-5" /> },
    { id: "task", label: "Task", icon: <FiList className="h-5 w-5" /> },
    { id: "bug", label: "Bug", icon: <BugIcon className="h-5 w-5" /> },
    { id: "mom", label: "Mom", icon: <LuFolderClock className="h-5 w-5" /> },
    { id: "document", label: "Document", icon: <Dock className="h-5 w-5" /> },
  ];

  // if (status.fetchProject === "loading" || showLoader) {
  //   return (
  //     <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-64px)]">
  //       <Spinner />
  //     </div>
  //   );
  // }

  const canEditStatus =
    currentUser?.role?.toLowerCase() === "cpc" ||
    isTeamLead ||
    currentUser?.position === "Team Lead";

  return (
    <div className="min-h-[100vh] bg-gray-50">
      <Card className="shadow-xl border border-gray-200 mx-auto">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
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
              <CardTitle className="text-2xl font-bold text-gray-900">
                {project?.data.projectName || "Unnamed Project"}
              </CardTitle>
            </div>
            {statusUpdateMessage && (
              <p
                className={`text-sm ${
                  successMessage ? "text-blue-600" : "text-red-600"
                } font-medium`}
              >
                {statusUpdateMessage}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="p-1 bg-gray-100 rounded-full flex flex-wrap justify-center sm:justify-start gap-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="details" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {/* Project Metrics Section */}
                <ProjectMetrics projectId={projectId} />

                {/* Project Details Section */}
                <div className="space-y-4 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FiInfo className="h-5 w-5 text-blue-600" />
                      Project Information
                    </h3>
                    {(currentUser?.role?.toLowerCase() === "cpc" ||
                      currentUser?.position === "Team Lead") && (
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/project/edit/${projectId}`)
                        }
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        aria-label="Edit project"
                      >
                        <FiEdit className="h-5 w-5 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pl-7">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-28">
                        Project ID:
                      </span>
                      <span>{project?.data.projectId || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPaperclip className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-28">
                        Category:
                      </span>
                      <span>
                        {project?.data.category
                          ? project.data.category
                              .toLowerCase()
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "N/A"}
                      </span>
                    </div>
                    {project?.data.clientId?.trim() && (
                      <div className="flex items-center gap-3">
                        <FiUser className="h-4 w-4 text-[#38b000]" />
                        <span className="font-semibold text-gray-900 w-28">
                          Client ID:
                        </span>
                        <span>{project?.data.clientId}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-28">
                        Status:
                      </span>
                      <TooltipProvider>
                        {canEditStatus ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => setIsStatusModalOpen(true)}
                                className={`inline-flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md text-sm font-medium ${
                                  project?.data.status === "Completed"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : project?.data.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : project?.data.status === "Cancelled"
                                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {project?.data.status || "N/A"}
                                <Pencil className="w-4 h-4 opacity-70" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to update project status</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div
                            className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                              project?.data.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : project?.data.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : project?.data.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project?.data.status || "N/A"}
                          </div>
                        )}
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiUser className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-28">
                        Team Lead:
                      </span>
                      <span>{project?.data.teamLeadName || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiCalendar className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-30">
                        Onboarding Date:
                      </span>
                      <span>
                        {project?.data.createdAt
                          ? formatDateUTC(project?.data.createdAt)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {(project?.data.startDate ||
                  project?.data.endDate ||
                  project?.data.attachments?.length > 0) && (
                  <div className="space-y-4 pb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FiCalendar className="h-5 w-5 text-blue-600" />
                      Timeline & Attachments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pl-7">
                      {project?.data.startDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendar className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            Start Date:
                          </span>
                          <span>{formatDateUTC(project?.data.startDate)}</span>
                        </div>
                      )}
                      {project?.data.endDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendar className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            End Date:
                          </span>
                          <span>{formatDateUTC(project?.data.endDate)}</span>
                        </div>
                      )}
                      {project?.data.expectedEndDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendar className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            Expected End Date:
                          </span>
                          <span>
                            {formatDateUTC(project?.data.expectedEndDate)}
                          </span>
                        </div>
                      )}
                    </div>
                    {project?.data.attachments?.length > 0 && (
                      <div className="flex flex-col gap-3 pl-7">
                        <div className="flex items-center gap-3">
                          <FileStack className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-28">
                            Attachments:
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {project?.data.attachments.map(
                            (attachment, index) => (
                              <Button
                                key={index}
                                onClick={() =>
                                  handleDownload(
                                    attachment.url,
                                    attachment.filename
                                  )
                                }
                                disabled={isDownloading}
                                variant="outline"
                                className="flex items-center gap-2 w-full justify-start text-left border-gray-200 hover:bg-blue-50"
                                aria-label={`Download ${attachment.filename}`}
                              >
                                <FiDownload className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700 truncate">
                                  {attachment.filename}
                                </span>
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 pb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FiFileText className="h-5 w-5 text-blue-600" />
                    Description
                  </h3>
                  {project?.data.description ? (
                    <p className="text-sm text-gray-600 leading-relaxed pl-7">
                      {project?.data.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic pl-7">
                      No description available
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="budget" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-6">
                <ProjectBudgetWrapper projectId={projectId} />
              
              </div>
            </TabsContent>

            <TabsContent value="task" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <AllTaskListByProjectId
                  project={project?.data}
                  projectId={project?.data.projectId}
                />
              </div>
            </TabsContent>

            <TabsContent value="team" className="min-h-[calc(100vh-100px)]">
              <TeamManagement project={project} projectId={projectId} />
            </TabsContent>

            <TabsContent value="bug" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <ProjectWisebugList
                  project={project}
                  projectId={projectId}
                  teamLeadId={project?.data?.teamLeadId}
                />
              </div>
            </TabsContent>

            <TabsContent value="mom" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <ProjectwiseAllMeetingAndMom
                  projectName={project?.data?.projectName}
                  project={project?.data}
                  projectId={projectId}
                  teamLeadId={project?.data?.teamLeadId}
                />
              </div>
            </TabsContent>

            <TabsContent value="document" className="min-h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <DocumentManager
                  project={project?.data}
                  projectId={projectId}
                  teamLeadId={project?.data?.teamLeadId}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-900">
              Update Project Status
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions
                  .filter((status) => status !== project?.data.status)
                  .map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
              aria-label="Cancel status update"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={!newStatus}
              className="bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Proceed with status update"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Status Change */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Confirm Status Change
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to change the project status to{" "}
            <span className="font-semibold text-blue-600">{newStatus}</span>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
              aria-label="Cancel status change confirmation"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className="bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Confirm status change"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}










































// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProjectById,
//   changeProjectStatus,
//   resetSuccessMessage,
// } from "@/features/projectSlice";
// import {
//   FiDownload,
//   FiUsers,
//   FiList,
//   FiFileText,
//   FiInfo,
//   FiCalendar,
//   FiUser,
//   FiEdit,
//   FiPaperclip,
// } from "react-icons/fi";
// import {
//   Briefcase,
//   TrendingUp,
//   FileStack,
//   BugIcon,
//   Pencil,
//   Dock,
//   MoreHorizontal,
// } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import AllTaskListByProjectId from "@/modules/Tasks/task/AllTaskListByProjectId";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { LuFolderClock } from "react-icons/lu";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import ProjectWisebugList from "../bug/ProjectWisebugList";
// import Spinner from "@/components/loader/Spinner";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import ProjectwiseAllMeetingAndMom from "../meetings/project/ProjectwiseAllmeetingMom";
// import { formatDateUTC } from "@/utils/formatDate";
// import DocumentManager from "../document/project-doc/DocumentManager";
// import ProjectMetrics from "./ProjectMetrics";
// import TeamManagement from "../Teams/TeamManagement";
// import ProjectBudgetWrapper from "../budget/budgetWraper";

// export default function ViewProjectById({ projectId }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch();
//   const { project, status, error, successMessage } = useSelector(
//     (state) => state.project
//   );
//   const { currentUser, isTeamLead } = useCurrentUser(project?.data?.teamLeadId);

//   // Initialize activeTab with a fallback to the first tab's ID
//   const tabs = [
//     {
//       id: "details",
//       label: "Details",
//       icon: <FiInfo className="h-5 w-5" />,
//       subTabs: [
//         { id: "overview", label: "Overview" },
//         { id: "all-details", label: "All Details" },
//       ],
//     },
//     {
//       id: "budget",
//       label: "Budget",
//       icon: <FiInfo className="h-5 w-5" />,
//       subTabs: [{ id: "budget-overview", label: "Budget Overview" }],
//     },
//     {
//       id: "team",
//       label: "Team",
//       icon: <FiUsers className="h-5 w-5" />,
//       subTabs: [{ id: "team-management", label: "Team Management" }],
//     },
//     {
//       id: "task",
//       label: "Task",
//       icon: <FiList className="h-5 w-5" />,
//       subTabs: [{ id: "task-list", label: "Task List" }],
//     },
//     {
//       id: "bug",
//       label: "Bug",
//       icon: <BugIcon className="h-5 w-5" />,
//       subTabs: [{ id: "bug-list", label: "Bug List" }],
//     },
//     {
//       id: "mom",
//       label: "MoM",
//       icon: <LuFolderClock className="h-5 w-5" />,
//       subTabs: [{ id: "meetings", label: "Meetings & MoM" }],
//     },
//     {
//       id: "document",
//       label: "Document",
//       icon: <Dock className="h-5 w-5" />,
//       subTabs: [{ id: "document-manager", label: "Document Manager" }],
//     },
//   ];

//   // Validate initialTab against available tab IDs
//   const validTabIds = tabs.map((tab) => tab.id);
//   const initialTab = validTabIds.includes(searchParams.get("tab"))
//     ? searchParams.get("tab")
//     : tabs[0].id;

//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [activeSubTab, setActiveSubTab] = useState({});
//   const [isMoreOpen, setIsMoreOpen] = useState(false);
//   const [visibleTabs, setVisibleTabs] = useState([]);
//   const [hiddenTabs, setHiddenTabs] = useState([]);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [newStatus, setNewStatus] = useState("");
//   const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [hasFetchedAfterStatusChange, setHasFetchedAfterStatusChange] =
//     useState(false);
//   const [showLoader, setShowLoader] = useState(true);
//   const tabsListRef = useRef(null);

//   // Fetch project data
//   useEffect(() => {
//     if (projectId) {
//       dispatch(fetchProjectById(projectId));
//     }
//   }, [projectId, dispatch]);

//   // Initialize sub-tabs
//   useEffect(() => {
//     const initialSubTabs = {};
//     tabs.forEach((tab) => {
//       initialSubTabs[tab.id] = tab.subTabs[0]?.id || "";
//     });
//     setActiveSubTab(initialSubTabs);
//   }, []);

//   // Handle status update messages
//   useEffect(() => {
//     if (successMessage && !hasFetchedAfterStatusChange) {
//       setStatusUpdateMessage(successMessage);
//       setHasFetchedAfterStatusChange(true);
//       dispatch(fetchProjectById(projectId));
//       setNewStatus("");
//       setTimeout(() => {
//         setStatusUpdateMessage("");
//         dispatch(resetSuccessMessage());
//         setHasFetchedAfterStatusChange(false);
//       }, 3000);
//     }
//     if (error.statusChange) {
//       setStatusUpdateMessage(error.statusChange);
//       setTimeout(() => setStatusUpdateMessage(""), 3000);
//     }
//   }, [successMessage, error.statusChange, dispatch, projectId, hasFetchedAfterStatusChange]);

//   // Loader timeout
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowLoader(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   // Sync activeTab with URL changes
//   useEffect(() => {
//     const tabFromUrl = searchParams.get("tab");
//     if (tabFromUrl && validTabIds.includes(tabFromUrl) && tabFromUrl !== activeTab) {
//       setActiveTab(tabFromUrl);
//     }
//   }, [searchParams, activeTab, validTabIds]);

//   // Handle tab visibility
//   useEffect(() => {
//     const updateVisibleTabs = () => {
//       if (!tabsListRef.current) return;

//       const containerWidth = tabsListRef.current.offsetWidth;
//       let totalWidth = 0;
//       const moreButtonWidth = 48;
//       const newVisibleTabs = [];
//       const newHiddenTabs = [];

//       tabs.forEach((tab) => {
//         const tabWidth = 120; // Adjust based on actual tab width
//         totalWidth += tabWidth;

//         if (totalWidth + moreButtonWidth <= containerWidth || newVisibleTabs.length === 0) {
//           newVisibleTabs.push(tab);
//         } else {
//           newHiddenTabs.push(tab);
//         }
//       });

//       setVisibleTabs(newVisibleTabs);
//       setHiddenTabs(newHiddenTabs);
//     };

//     updateVisibleTabs();
//     window.addEventListener("resize", updateVisibleTabs);
//     return () => window.removeEventListener("resize", updateVisibleTabs);
//   }, []);

//   const handleDownload = (url, filename) => {
//     setIsDownloading(true);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setTimeout(() => setIsDownloading(false), 1000);
//   };

//   const handleStatusSubmit = () => {
//     if (newStatus) {
//       setIsStatusModalOpen(false);
//       setIsConfirmModalOpen(true);
//     }
//   };

//   const handleConfirmStatusChange = () => {
//     if (newStatus && projectId) {
//       dispatch(changeProjectStatus({ projectId, status: newStatus }));
//       setIsConfirmModalOpen(false);
//       toast.success("Status Updated!");
//     }
//   };

//   const handleTabSelect = (tabId) => {
//     setActiveTab(tabId);
//     setIsMoreOpen(false);
//     router.replace(`/project/${projectId}?tab=${tabId}`);
//   };

//   const statusOptions = ["In Progress", "Completed"];
//   const canEditStatus =
//     currentUser?.role?.toLowerCase() === "cpc" ||
//     isTeamLead ||
//     currentUser?.position === "Team Lead";

//   if (status.fetchProject === "loading" || showLoader || !project?.data) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-64px)]">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <Card className="shadow-lg border border-gray-100 mx-auto">
//         <CardHeader className="border-b border-gray-100 bg-white">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <Button
//                 onClick={() => router.back()}
//                 className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
//               >
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 Back
//               </Button>
//               <CardTitle className="text-2xl font-bold text-gray-900">
//                 {project?.data.projectName || "Unnamed Project"}
//               </CardTitle>
//             </div>
//             {statusUpdateMessage && (
//               <p
//                 className={`text-sm ${
//                   successMessage ? "text-green-600" : "text-red-600"
//                 } font-medium animate-pulse`}
//               >
//                 {statusUpdateMessage}
//               </p>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <Tabs
//             value={activeTab}
//             onValueChange={handleTabSelect}
//             className="w-full"
//           >
//             <TabsList
//               ref={tabsListRef}
//               className="w-full p-0 bg-white justify-start border-b border-gray-200 rounded-none flex items-center"
//             >
//               {visibleTabs.map((tab) => (
//                 <TabsTrigger
//                   key={tab.id}
//                   value={tab.id}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none bg-white h-full data-[state=active]:shadow-none border border-transparent border-b-gray-200 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 hover:bg-gray-50 transition-all duration-200 flex-shrink-0"
//                 >
//                   {tab.icon}
//                   <span>{tab.label}</span>
//                 </TabsTrigger>
//               ))}
//               {hiddenTabs.length > 0 && (
//                 <DropdownMenu open={isMoreOpen} onOpenChange={setIsMoreOpen}>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="ml-2 hover:bg-gray-50"
//                       aria-label="More tabs"
//                     >
//                       <MoreHorizontal className="h-5 w-5 text-gray-600" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md">
//                     {hiddenTabs.map((tab) => (
//                       <DropdownMenuItem
//                         key={tab.id}
//                         onClick={() => handleTabSelect(tab.id)}
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
//                       >
//                         {tab.icon}
//                         {tab.label}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </TabsList>

//             {tabs.map((tab) => (
//               <TabsContent
//                 key={tab.id}
//                 value={tab.id}
//                 className="min-h-[calc(100vh-200px)]"
//               >
//                 {tab.subTabs.length > 1 ? (
//                   <Tabs
//                     value={activeSubTab[tab.id] || tab.subTabs[0]?.id}
//                     onValueChange={(value) =>
//                       setActiveSubTab((prev) => ({ ...prev, [tab.id]: value }))
//                     }
//                     className="mt-4"
//                   >
//                     <TabsList className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-md">
//                       {tab.subTabs.map((subTab) => (
//                         <TabsTrigger
//                           key={subTab.id}
//                           value={subTab.id}
//                           className="px-3 py-1 text-sm font-medium rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-200 transition-all duration-200"
//                         >
//                           {subTab.label}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {tab.id === "details" && (
//                       <>
//                         <TabsContent value="overview">
//                           <div className="p-4 bg-white rounded-md shadow-sm">
//                             <ProjectMetrics projectId={projectId} />
//                           </div>
//                         </TabsContent>
//                         <TabsContent value="all-details">
//                           <div className="space-y-6 p-4 bg-white rounded-md shadow-sm">
//                             <div className="space-y-4">
//                               <div className="flex items-center justify-between">
//                                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                   <FiInfo className="h-5 w-5 text-blue-600" />
//                                   Project Information
//                                 </h3>
//                                 {(currentUser?.role?.toLowerCase() === "cpc" ||
//                                   currentUser?.position === "Team Lead") && (
//                                   <Button
//                                     size="sm"
//                                     onClick={() =>
//                                       router.push(`/project/edit/${projectId}`)
//                                     }
//                                     className="bg-blue-600 text-white hover:bg-blue-700"
//                                     aria-label="Edit project"
//                                   >
//                                     <FiEdit className="h-5 w-5 mr-2" />
//                                     Edit
//                                   </Button>
//                                 )}
//                               </div>
//                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pl-7">
//                                 <div className="flex items-center gap-3">
//                                   <Briefcase className="h-4 w-4 text-[#38b000]" />
//                                   <span className="font-semibold text-gray-900 w-28">
//                                     Project ID:
//                                   </span>
//                                   <span>{project?.data.projectId || "N/A"}</span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <FiPaperclip className="h-4 w-4 text-[#38b000]" />
//                                   <span className="font-semibold text-gray-900 w-28">
//                                     Category:
//                                   </span>
//                                   <span>
//                                     {project?.data.category
//                                       ? project.data.category
//                                           .toLowerCase()
//                                           .split(" ")
//                                           .map(
//                                             (word) =>
//                                               word.charAt(0).toUpperCase() +
//                                               word.slice(1)
//                                           )
//                                           .join(" ")
//                                       : "N/A"}
//                                   </span>
//                                 </div>
//                                 {project?.data.clientId?.trim() && (
//                                   <div className="flex items-center gap-3">
//                                     <FiUser className="h-4 w-4 text-[#38b000]" />
//                                     <span className="font-semibold text-gray-900 w-28">
//                                       Client ID:
//                                     </span>
//                                     <span>{project?.data.clientId}</span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-3">
//                                   <TrendingUp className="h-4 w-4 text-[#38b000]" />
//                                   <span className="font-semibold text-gray-900 w-28">
//                                     Status:
//                                   </span>
//                                   <TooltipProvider>
//                                     {canEditStatus ? (
//                                       <Tooltip>
//                                         <TooltipTrigger asChild>
//                                           <div
//                                             onClick={() =>
//                                               setIsStatusModalOpen(true)
//                                             }
//                                             className={`inline-flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
//                                               project?.data.status === "Completed"
//                                                 ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                                                 : project?.data.status ===
//                                                   "In Progress"
//                                                 ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                                                 : project?.data.status ===
//                                                   "Cancelled"
//                                                 ? "bg-red-100 text-red-800 hover:bg-red-200"
//                                                 : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                                             }`}
//                                           >
//                                             {project?.data.status || "N/A"}
//                                             <Pencil className="w-4 h-4 opacity-70" />
//                                           </div>
//                                         </TooltipTrigger>
//                                         <TooltipContent>
//                                           <p>Click to update project status</p>
//                                         </TooltipContent>
//                                       </Tooltip>
//                                     ) : (
//                                       <div
//                                         className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
//                                           project?.data.status === "Completed"
//                                             ? "bg-blue-100 text-blue-800"
//                                             : project?.data.status ===
//                                               "In Progress"
//                                             ? "bg-blue-100 text-blue-800"
//                                             : project?.data.status === "Cancelled"
//                                             ? "bg-red-100 text-red-800"
//                                             : "bg-gray-100 text-gray-800"
//                                         }`}
//                                       >
//                                         {project?.data.status || "N/A"}
//                                       </div>
//                                     )}
//                                   </TooltipProvider>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <FiUser className="h-4 w-4 text-[#38b000]" />
//                                   <span className="font-semibold text-gray-900 w-28">
//                                     Team Lead:
//                                   </span>
//                                   <span>
//                                     {project?.data.teamLeadName || "Unassigned"}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <FiCalendar className="h-4 w-4 text-[#38b000]" />
//                                   <span className="font-semibold text-gray-900 w-30">
//                                     Onboarding Date:
//                                   </span>
//                                   <span>
//                                     {project?.data.createdAt
//                                       ? formatDateUTC(project?.data.createdAt)
//                                       : "N/A"}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {(project?.data.startDate ||
//                               project?.data.endDate ||
//                               project?.data.attachments?.length > 0) && (
//                               <div className="space-y-4">
//                                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                   <FiCalendar className="h-5 w-5 text-blue-600" />
//                                   Timeline & Attachments
//                                 </h3>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pl-7">
//                                   {project?.data.startDate && (
//                                     <div className="flex items-center gap-3">
//                                       <FiCalendar className="h-4 w-4 text-[#38b000]" />
//                                       <span className="font-semibold text-gray-900 w-35">
//                                         Start Date:
//                                       </span>
//                                       <span>
//                                         {formatDateUTC(project?.data.startDate)}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {project?.data.endDate && (
//                                     <div className="flex items-center gap-3">
//                                       <FiCalendar className="h-4 w-4 text-[#38b000]" />
//                                       <span className="font-semibold text-gray-900 w-35">
//                                         End Date:
//                                       </span>
//                                       <span>
//                                         {formatDateUTC(project?.data.endDate)}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {project?.data.expectedEndDate && (
//                                     <div className="flex items-center gap-3">
//                                       <FiCalendar className="h-4 w-4 text-[#38b000]" />
//                                       <span className="font-semibold text-gray-900 w-35">
//                                         Expected End Date:
//                                       </span>
//                                       <span>
//                                         {formatDateUTC(project?.data.expectedEndDate)}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 {project?.data.attachments?.length > 0 && (
//                                   <div className="flex flex-col gap-3 pl-7">
//                                     <div className="flex items-center gap-3">
//                                       <FileStack className="h-4 w-4 text-[#38b000]" />
//                                       <span className="font-semibold text-gray-900 w-28">
//                                         Attachments:
//                                       </span>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                                       {project?.data.attachments.map(
//                                         (attachment, index) => (
//                                           <Button
//                                             key={index}
//                                             onClick={() =>
//                                               handleDownload(
//                                                 attachment.url,
//                                                 attachment.filename
//                                               )
//                                             }
//                                             disabled={isDownloading}
//                                             variant="outline"
//                                             className="flex items-center gap-2 w-full justify-start text-left border-gray-200 hover:bg-blue-50 transition-all duration-200"
//                                             aria-label={`Download ${attachment.filename}`}
//                                           >
//                                             <FiDownload className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 truncate">
//                                               {attachment.filename}
//                                             </span>
//                                           </Button>
//                                         )
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}

//                             <div className="space-y-4">
//                               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                 <FiFileText className="h-5 w-5 text-blue-600" />
//                                 Description
//                               </h3>
//                               {project?.data.description ? (
//                                 <p className="text-sm text-gray-600 leading-relaxed pl-7">
//                                   {project?.data.description}
//                                 </p>
//                               ) : (
//                                 <p className="text-sm text-gray-500 italic pl-7">
//                                   No description available
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </TabsContent>
//                       </>
//                     )}
//                   </Tabs>
//                 ) : (
//                   <div className="p-4 bg-white rounded-md shadow-sm">
//                     {tab.id === "budget" && (
//                       <ProjectBudgetWrapper projectId={projectId} />
//                     )}
//                     {tab.id === "team" && (
//                       <TeamManagement project={project} projectId={projectId} />
//                     )}
//                     {tab.id === "task" && (
//                       <AllTaskListByProjectId
//                         project={project?.data}
//                         projectId={project?.data.projectId}
//                       />
//                     )}
//                     {tab.id === "bug" && (
//                       <ProjectWisebugList
//                         project={project}
//                         projectId={projectId}
//                         teamLeadId={project?.data?.teamLeadId}
//                       />
//                     )}
//                     {tab.id === "mom" && (
//                       <ProjectwiseAllMeetingAndMom
//                         projectName={project?.data?.projectName}
//                         project={project?.data}
//                         projectId={projectId}
//                         teamLeadId={project?.data?.teamLeadId}
//                       />
//                     )}
//                     {tab.id === "document" && (
//                       <DocumentManager
//                         project={project?.data}
//                         projectId={projectId}
//                         teamLeadId={project?.data?.teamLeadId}
//                       />
//                     )}
//                   </div>
//                 )}
//               </TabsContent>
//             ))}
//           </Tabs>
//         </CardContent>
//       </Card>

//       <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
//         <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-blue-900">
//               Update Project Status
//             </DialogTitle>
//           </DialogHeader>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select New Status
//             </label>
//             <Select value={newStatus} onValueChange={setNewStatus}>
//               <SelectTrigger className="border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white">
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {statusOptions
//                   .filter((status) => status !== project?.data.status)
//                   .map((status) => (
//                     <SelectItem key={status} value={status}>
//                       {status}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsStatusModalOpen(false)}
//               className="text-gray-600 border-gray-300 hover:bg-gray-100"
//               aria-label="Cancel status update"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleStatusSubmit}
//               disabled={!newStatus}
//               className="bg-blue-600 text-white hover:bg-blue-700"
//               aria-label="Proceed with status update"
//             >
//               Proceed
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
//         <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-gray-900">
//               Confirm Status Change
//             </DialogTitle>
//           </DialogHeader>
//           <p className="text-sm text-gray-600 mb-4">
//             Are you sure you want to change the project status to{" "}
//             <span className="font-semibold text-blue-600">{newStatus}</span>?
//           </p>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsConfirmModalOpen(false)}
//               className="text-gray-600 border-gray-300 hover:bg-gray-100"
//               aria-label="Cancel status change confirmation"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleConfirmStatusChange}
//               className="bg-blue-600 text-white hover:bg-blue-700"
//               aria-label="Confirm status change"
//             >
//               Confirm
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }










