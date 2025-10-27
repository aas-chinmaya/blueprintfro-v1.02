



"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { validateInput, sanitizeInput } from "@/utils/sanitize";
import { fetchProjectById, updateProject } from "@/features/projectSlice";
import {
  FiCalendar,
  FiUser,
  FiFileText,
  FiUpload,
  FiX,
  FiFolder,
  FiFile,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "sonner";
import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
import ClientSelect from "@/modules/project/ClientSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import gsap from "gsap";

export default function ProjectEditForm({ projectId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { project, status, error } = useSelector((state) => state.project);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const teamLeadSelectRef = useRef(null);
  const clientSelectRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    teamLeadName: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
    attachments: [],
  });

  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Fetch project data on component mount
  useEffect(() => {
    if (projectId && status.fetchProject === "idle") {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId, status.fetchProject]);

  // Animate form appearance
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
    );
  }, []);

  // Update form data when project data is fetched, only if not initialized
  useEffect(() => {
    if (
      project &&
      project.data &&
      !isFormInitialized &&
      status.fetchProject === "succeeded"
    ) {
      setFormData({
        projectName: project.data.projectName || "",
        description: project.data.description || "",
        clientId: project.data.clientId || "",
        teamLeadId: project.data.teamLeadId || "",
        teamLeadName: project.data.teamLeadName || "",
        startDate: project.data.startDate
          ? project.data.startDate.split("T")[0]
          : "",
        expectedEndDate: project.data.expectedEndDate
          ? project.data.expectedEndDate.split("T")[0]
          : "",
        category: project.data.category || "",
        attachments: [],
      });
      setIsFormInitialized(true);
    }
  }, [project, status.fetchProject, isFormInitialized]);

  // Click outside handler for select dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        teamLeadSelectRef.current &&
        !teamLeadSelectRef.current.contains(event.target)
      ) {
        setIsTeamLeadSelectOpen(false);
      }
      if (
        clientSelectRef.current &&
        !clientSelectRef.current.contains(event.target)
      ) {
        setIsClientSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const [formErrors, setFormErrors] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    teamLeadName: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);

    if (!validation.isValid) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validation.warning,
      }));
      return;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    const sanitizedValue = sanitizeInput(value);
    const updatedFormData = {
      ...formData,
      [name]: sanitizedValue,
    };

    // Reset clientId when category changes to in house
    if (name === "category" && sanitizedValue === "in house") {
      updatedFormData.clientId = "";
      setFormErrors((prev) => ({
        ...prev,
        clientId: "",
      }));
    }

    if (
      name === "startDate" &&
      updatedFormData.expectedEndDate &&
      new Date(sanitizedValue) > new Date(updatedFormData.expectedEndDate)
    ) {
      setFormErrors((prev) => ({
        ...prev,
        startDate: "Start date cannot be after expected end date",
      }));
    } else if (
      name === "expectedEndDate" &&
      updatedFormData.startDate &&
      new Date(updatedFormData.startDate) > new Date(sanitizedValue)
    ) {
      setFormErrors((prev) => ({
        ...prev,
        expectedEndDate: "Expected end date cannot be before start date",
      }));
    }

    setFormData(updatedFormData);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    newFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${file.name} has an unsupported type.`);
      } else if (file.size > maxSize) {
        errors.push(`File ${file.name} exceeds 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      toast.error(errors.join(" "));
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }));

      gsap.from(".file-item:last-child", {
        opacity: 0,
        x: -30,
        duration: 0.5,
        ease: "power4.out",
      });
    }
  };

  const removeFile = (index) => {
    const fileElement = document.querySelector(`.file-item:nth-child(${index + 1})`);
    gsap.to(fileElement, {
      opacity: 0,
      x: 30,
      duration: 0.5,
      ease: "power4.in",
      onComplete: () => {
        setFormData((prev) => ({
          ...prev,
          attachments: prev.attachments.filter((_, i) => i !== index),
        }));
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { ...formErrors };

    for (const [key, value] of Object.entries(formData)) {
      if (key === "attachments" || key === "teamLeadName") continue;
      if (key === "clientId" && formData.category === "in house") continue;
      const validation = validateInput(value);
      if (!validation.isValid) {
        newErrors[key] = validation.warning;
        hasErrors = true;
      }
    }

    if (formData.startDate && formData.expectedEndDate) {
      if (new Date(formData.startDate) > new Date(formData.expectedEndDate)) {
        newErrors.startDate = "Start date cannot be after expected end date";
        newErrors.expectedEndDate = "Expected end date cannot be before start date";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors(newErrors);
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append("projectName", formData.projectName);
      submissionData.append("description", formData.description);
      if (formData.category === "client") {
        submissionData.append("clientId", formData.clientId);
      }
      submissionData.append("teamLeadId", formData.teamLeadId);
      submissionData.append("teamLeadName", formData.teamLeadName);
      submissionData.append("startDate", formData.startDate);
      submissionData.append("expectedEndDate", formData.expectedEndDate);
      submissionData.append("category", formData.category);

      formData.attachments.forEach((file) => {
        submissionData.append("attachments[]", file);
      });

      await gsap.to(formRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power4.in",
      });

      await dispatch(
        updateProject({ projectId, updatedData: submissionData })
      ).unwrap();

      toast.success("Project updated successfully!");
      router.back();
    } catch (err) {
      toast.error(`Failed to update project: ${err.message || "Unknown error"}`);
      gsap.to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
      });
    }
  };

  const getFileIcon = (file) => {
    const fileName = file.name || "unknown";
    const extension = fileName.split(".").pop().toLowerCase();
    return <FiFile className="text-gray-800" aria-hidden="true" />;
  };

  if (status.fetchProject === "loading") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-t-3 border-[#1447e6] mb-4"></div>
        <p className="text-gray-600 font-medium text-sm sm:text-base">
          Loading project details...
        </p>
      </div>
    );
  }

  if (status.fetchProject === "failed") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Card className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-5 rounded-lg max-w-md w-full">
          <CardTitle className="font-semibold text-base sm:text-lg mb-2">
            Unable to load project
          </CardTitle>
          <p className="text-red-600 text-sm sm:text-base">
            {error.fetchProject || "An error occurred"}
          </p>
          <Button
            onClick={() => dispatch(fetchProjectById(projectId))}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium flex items-center gap-2 mx-auto transition-colors"
            aria-label="Retry loading project"
          >
            <FiArrowLeft className="h-4 w-4" />
            Retry
          </Button>
        </Card>
        </div>
      );
  }

  return (
    <Card
      ref={formRef}
      className="min-h-screen bg-white border border-gray-200 shadow-md w-full max-w-[100vw] mx-auto"
    >
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-gray-300 text-gray-800 hover:bg-gray-100 rounded-md text-xs sm:text-sm px-3 sm:px-4 py-2"
            aria-label="Back to projects"
          >
            <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Edit Project
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form id="project-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="projectName"
                  className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                    formErrors.projectName ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  <FiFileText aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                  Project Name
                  {formErrors.projectName && (
                    <span className="text-[10px] sm:text-xs ml-2">({formErrors.projectName})</span>
                  )}
                </Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  disabled={
                    status.fetchProject === "loading" ||
                    status.updateProject === "loading"
                  }
                  placeholder="Enter project name"
                  className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
                    formErrors.projectName ? "border-red-300" : ""
                  } touch-manipulation`}
                  aria-label="Project name"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="category"
                    className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                      formErrors.category ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    <FiFolder aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                    Project Type
                    {formErrors.category && (
                      <span className="text-[10px] sm:text-xs ml-2">({formErrors.category})</span>
                    )}
                  </Label>
               
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "category", value } })
                    }
                    disabled={
                      status.fetchProject === "loading" ||
                      status.updateProject === "loading"
                    }
                  >
                    <SelectTrigger
                      className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full ${
                        formErrors.category ? "border-red-300" : ""
                      } touch-manipulation`}
                      aria-label="Project type"
                    >
                      <SelectValue placeholder="Select Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="in house">In House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  {formData.category === "client" ? (
                    <div ref={clientSelectRef}>
                      <Label
                        htmlFor="clientId"
                        className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                          formErrors.clientId ? "text-red-500" : "text-gray-800"
                        }`}
                      >
                        <FiUser aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                        Client
                        {formErrors.clientId && (
                          <span className="text-[10px] sm:text-xs ml-2">({formErrors.clientId})</span>
                        )}
                      </Label>
                      <ClientSelect
                        value={formData.clientId}
                        isOpen={isClientSelectOpen}
                        onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, clientId: value }));
                          setIsClientSelectOpen(false);
                          setFormErrors((prev) => ({ ...prev, clientId: "" }));
                        }}
                        disabled={
                          status.fetchProject === "loading" ||
                          status.updateProject === "loading"
                        }
                        className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
                      />
                    </div>
                  ) : (
                    <div className="h-10 sm:h-11"></div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="teamLeadId"
                  className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                    formErrors.teamLeadId ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  <FiUser aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                  Team Lead
                  {formErrors.teamLeadId && (
                    <span className="text-[10px] sm:text-xs ml-2">({formErrors.teamLeadId})</span>
                  )}
                </Label>
                <TeamLeadSelect
                  value={formData.teamLeadId}
                  isOpen={isTeamLeadSelectOpen}
                  onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
                  onChange={({ teamLeadId, teamLeadName }) => {
                    setFormData((prev) => ({
                      ...prev,
                      teamLeadId,
                      teamLeadName,
                    }));
                    setIsTeamLeadSelectOpen(false);
                    setFormErrors((prev) => ({ ...prev, teamLeadId: "" }));
                  }}
                  disabled={
                    status.fetchProject === "loading" ||
                    status.updateProject === "loading"
                  }
                  className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="startDate"
                    className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                      formErrors.startDate ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    <FiCalendar aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                    Start Date
                    {formErrors.startDate && (
                      <span className="text-[10px] sm:text-xs ml-2">({formErrors.startDate})</span>
                    )}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    disabled={
                      status.fetchProject === "loading" ||
                      status.updateProject === "loading"
                    }
                    className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
                      formErrors.startDate ? "border-red-300" : ""
                    } touch-manipulation`}
                    aria-label="Start date"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="expectedEndDate"
                    className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                      formErrors.expectedEndDate ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    <FiCalendar aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                    Expected End Date
                    {formErrors.expectedEndDate && (
                      <span className="text-[10px] sm:text-xs ml-2">({formErrors.expectedEndDate})</span>
                    )}
                  </Label>
                  <Input
                    id="expectedEndDate"
                    type="date"
                    name="expectedEndDate"
                    value={formData.expectedEndDate}
                    onChange={handleChange}
                    required
                    disabled={
                      status.fetchProject === "loading" ||
                      status.updateProject === "loading"
                    }
                    className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
                      formErrors.expectedEndDate ? "border-red-300" : ""
                    } touch-manipulation`}
                    aria-label="Expected end date"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 lg:max-w-md">
              <Label className="font-semibold flex items-center gap-2 text-xs sm:text-sm text-gray-800">
                <FiUpload aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                File Upload
              </Label>
              <div className="border rounded-md bg-white flex flex-col h-[300px] sm:h-[400px] lg:h-full">
                <div
                  className={`p-4 border-b border-gray-200 transition-colors duration-200 flex flex-col items-center justify-center flex-grow ${
                    dragActive ? "border-blue-300 bg-gray-50" : "bg-white"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    status.fetchProject !== "loading" &&
                    status.updateProject !== "loading" &&
                    fileInputRef.current?.click()
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      status.fetchProject !== "loading" &&
                        status.updateProject !== "loading" &&
                        fileInputRef.current?.click();
                    }
                  }}
                  aria-label="File upload area"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={
                      status.fetchProject === "loading" ||
                      status.updateProject === "loading"
                    }
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <FiUpload className="text-xl sm:text-2xl text-gray-800" aria-hidden="true" />
                    <p className="text-[10px] sm:text-sm text-gray-600 px-2">
                      Drag & drop files or tap to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT)
                    </p>
                  </div>
                </div>
                <div className="p-4 flex flex-col">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-2">
                    {formData.attachments.length > 0
                      ? `${formData.attachments.length} file${
                          formData.attachments.length > 1 ? "s" : ""
                        } chosen`
                      : "No files chosen"}
                  </p>
                  {formData.attachments.length > 0 && (
                    <div className="max-h-40 sm:max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2 w-full">
                        {formData.attachments.map((file, index) => {
                          const fileName = file.name;
                          const extension = fileName.split(".").pop().toLowerCase();
                          const truncatedName = fileName.substring(
                            0,
                            Math.min(15, fileName.length - extension.length - 1)
                          );
                          const displayName = `${truncatedName}...${extension}`;

                          return (
                            <div
                              key={`attachment-${index}`}
                              className="file-item relative group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-md text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 w-full"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 truncate">
                                <div className="text-lg sm:text-2xl">{getFileIcon(file)}</div>
                                <span
                                  className="text-gray-600 text-xs sm:text-base truncate"
                                  title={fileName}
                                >
                                  {displayName}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={
                                  status.fetchProject === "loading" ||
                                  status.updateProject === "loading"
                                }
                                className="text-gray-800 hover:text-[#1447e6] p-1"
                                aria-label={`Remove ${fileName}`}
                              >
                                <FiX size={16} sm={18} />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
                formErrors.description ? "text-red-500" : "text-gray-800"
              }`}
            >
              <FiFileText aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
              Description
              {formErrors.description && (
                <span className="text-[10px] sm:text-xs ml-2">({formErrors.description})</span>
              )}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={
                status.fetchProject === "loading" ||
                status.updateProject === "loading"
              }
              className={`min-h-[40vh] sm:min-h-[60vh] border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm w-full ${
                formErrors.description ? "border-red-300" : ""
              } touch-manipulation`}
              placeholder="Describe your project..."
              aria-label="Project description"
            />
          </div>

          <div className="flex justify-end mt-4 sm:mt-6">
            <Button
              type="submit"
              form="project-form"
              disabled={
                status.fetchProject === "loading" ||
                status.updateProject === "loading"
              }
              className="flex items-center gap-2 bg-[#1447e6] hover:bg-[#0f3cb5] text-white rounded-md px-4 sm:px-6 py-2 text-xs sm:text-sm w-full sm:w-auto"
              aria-label="Save changes"
            >
              {status.fetchProject === "loading" ||
              status.updateProject === "loading" ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
















