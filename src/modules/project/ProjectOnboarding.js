




"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { validateInput, sanitizeInput } from "@/utils/sanitize";
import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
import ClientSelect from "@/modules/project/ClientSelect";
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
import {
  createProject,
  fetchAllProjects,
  resetProjectCreation,
} from "@/features/projectSlice";
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
import { toast } from "sonner";

export default function ProjectOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => ({
    loading: state.project.status.projectCreation === "loading",
    error: state.project.error.projectCreation,
    successMessage: state.project.successMessage,
  }));

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const clientSelectRef = useRef(null);
  const teamLeadSelectRef = useRef(null);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientId: undefined,
    teamLeadId: "",
    teamLeadName: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
  });
  const [fileErrors, setFileErrors] = useState([]);
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isExpectedEndDatePickerOpen, setIsExpectedEndDatePickerOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  // Handle success and error navigation
  useEffect(() => {
    if (successMessage && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      dispatch(fetchAllProjects());
      router.push("/project-management");
      dispatch(resetProjectCreation());
    }
    if (error) {
      dispatch(resetProjectCreation());
    }
  }, [successMessage, error, router, dispatch, hasHandledSuccess]);

  // Click outside handler for select dropdowns and date pickers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clientSelectRef.current &&
        !clientSelectRef.current.contains(event.target)
      ) {
        setIsClientSelectOpen(false);
      }
      if (
        teamLeadSelectRef.current &&
        !teamLeadSelectRef.current.contains(event.target)
      ) {
        setIsTeamLeadSelectOpen(false);
      }
      if (
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setIsStartDatePickerOpen(false);
        setIsExpectedEndDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // Add touch support
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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

    if (name === "category" && sanitizedValue === "in house") {
      updatedFormData.clientId = undefined;
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

  const handleDateSelect = (name, date) => {
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    handleChange({ target: { name, value: formattedDate } });
    if (name === "startDate") {
      setIsStartDatePickerOpen(false);
    } else if (name === "expectedEndDate") {
      setIsExpectedEndDatePickerOpen(false);
    }
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
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/mov",
      "video/avi",
      "audio/mpeg",
      "audio/wav",
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
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }));
      setFileErrors([]);
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
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
      return;
    }

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
      submissionData.append("attachments", file);
    });

    try {
      await dispatch(createProject(submissionData)).unwrap();
      toast.success("Project created successfully!");
    } catch (err) {
      // console.error("Project creation error:", err);
      toast.error("Error while creating Project!");
    }
  };

  const getFileIcon = (file) => {
    const fileName = file.name || "unknown";
    const extension = fileName.split(".").pop().toLowerCase();
    return <FiFile className="text-gray-800" aria-hidden="true" />;
  };

  // Responsive Calendar Picker
  const CalendarPicker = ({ value, onSelect, name }) => {
    const currentDate = value ? new Date(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

    let selectedYear, selectedMonth, selectedDay;
    if (value) {
      const parts = value.split('-');
      selectedYear = parseInt(parts[0]);
      selectedMonth = parseInt(parts[1]) - 1;
      selectedDay = parseInt(parts[2]);
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weeks = [];
    let week = Array(7).fill(null);

    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null;
    }
    days.forEach((day, index) => {
      const weekIndex = (index + firstDayOfMonth) % 7;
      week[weekIndex] = day;
      if (weekIndex === 6 || index === days.length - 1) {
        weeks.push([...week]);
        week = Array(7).fill(null);
      }
    });

    return (
      <div className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg p-2 sm:p-4 mt-2 w-full max-w-[90vw] sm:max-w-xs max-h-[60vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="text-xs sm:text-sm"
          >
            Prev
          </Button>
          <span className="font-semibold text-xs sm:text-sm">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-[10px] sm:text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <Button
                key={`${weekIndex}-${dayIndex}`}
                variant="ghost"
                className={`p-1 h-7 w-7 sm:h-8 sm:w-8 text-[10px] sm:text-sm ${
                  day && selectedYear === currentYear && selectedMonth === currentMonth && selectedDay === day
                    ? "bg-[#1447e6] text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  day &&
                  onSelect(name, new Date(currentYear, currentMonth, day))
                }
                disabled={!day}
              >
                {day || ""}
              </Button>
            ))
          )}
        </div>
      </div>
    );
  };

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
            Onboard New Project
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form id="project-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Responsive Grid: Stack on mobile, side-by-side on larger screens */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left Column: Form Fields */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              {/* Project Name */}
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
                  disabled={loading}
                  placeholder="Enter project name"
                  className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
                    formErrors.projectName ? "border-red-300" : ""
                  } touch-manipulation`}
                  aria-label="Project name"
                />
              </div>

              {/* Category and Client */}
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
                    disabled={loading}
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
                        disabled={loading}
                        className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
                      />
                    </div>
                  ) : (
                    <div className="h-10 sm:h-11"></div>
                  )}
                </div>
              </div>

              {/* Team Lead */}
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
                  disabled={loading}
                  className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
                />
              </div>

              {/* Start Date and Expected End Date */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2 relative">
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
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      readOnly
                      required
                      disabled={loading}
                      placeholder="Select start date"
                      className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full pr-10 cursor-pointer ${
                        formErrors.startDate ? "border-red-300" : ""
                      } touch-manipulation`}
                      aria-label="Start date"
                      onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setIsStartDatePickerOpen(!isStartDatePickerOpen);
                        }
                      }}
                    />
                    <FiCalendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer h-4 w-4 sm:h-5 sm:w-5"
                      onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                    />
                    {isStartDatePickerOpen && (
                      <CalendarPicker
                        value={formData.startDate}
                        onSelect={handleDateSelect}
                        name="startDate"
                      />
                    )}
                  </div>
                </div>
                <div className={`flex-1 space-y-2 relative ${!formData.startDate ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  <div className="relative">
                    <Input
                      id="expectedEndDate"
                      type="text"
                      name="expectedEndDate"
                      value={formData.expectedEndDate}
                      readOnly
                      required
                      disabled={loading || !formData.startDate}
                      placeholder="Select expected end date"
                      className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full pr-10 cursor-pointer ${
                        formErrors.expectedEndDate ? "border-red-300" : ""
                      } touch-manipulation`}
                      aria-label="Expected end date"
                      onClick={() => formData.startDate && setIsExpectedEndDatePickerOpen(!isExpectedEndDatePickerOpen)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && formData.startDate) {
                          setIsExpectedEndDatePickerOpen(!isExpectedEndDatePickerOpen);
                        }
                      }}
                    />
                    <FiCalendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer h-4 w-4 sm:h-5 sm:w-5"
                      onClick={() => formData.startDate && setIsExpectedEndDatePickerOpen(!isExpectedEndDatePickerOpen)}
                    />
                    {isExpectedEndDatePickerOpen && (
                      <CalendarPicker
                        value={formData.expectedEndDate}
                        onSelect={handleDateSelect}
                        name="expectedEndDate"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: File Upload */}
            <div className="flex-1 space-y-2 lg:max-w-md">
              <Label className="font-semibold flex items-center gap-2 text-xs sm:text-sm text-gray-800">
                <FiUpload aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                File Upload
              </Label>
              <div className="border rounded-md bg-white flex flex-col h-[300px] sm:h-[400px] lg:h-full">
                {/* Choose Region */}
                <div
                  className={`p-4 border-b border-gray-200 transition-colors duration-200 flex flex-col items-center justify-center flex-grow ${
                    dragActive ? "border-blue-300 bg-gray-50" : "bg-white"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !loading && fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      !loading && fileInputRef.current?.click();
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
                    disabled={loading}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,audio/mpeg,audio/wav"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <FiUpload className="text-xl sm:text-2xl text-gray-800" aria-hidden="true" />
                    <p className="text-[10px] sm:text-sm text-gray-600 px-2">
                      Drag & drop files or tap to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, MP4, MOV, AVI, MP3, WAV)
                    </p>
                  </div>
                </div>
                {/* Display Region */}
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
                              className="relative group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-md text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 w-full"
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
                                disabled={loading}
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

          {/* Description */}
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
              disabled={loading}
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
              disabled={loading}
              className="flex items-center gap-2 bg-[#1447e6] hover:bg-[#0f3cb5] text-white rounded-md px-4 sm:px-6 py-2 text-xs sm:text-sm w-full sm:w-auto"
              aria-label="Create project"
            >
              {loading ? (
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
                  Creating...
                </>
              ) : (
                <>Create Project</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}