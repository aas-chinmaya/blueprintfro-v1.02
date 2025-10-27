



// "use client";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchManpowers,
//   addManpower,
//   getManpowerById,
//   updateManpower,
//   deleteManpower,
// } from "@/features/master/manpowerMasterSlice";
// import { validateInput } from "@/utils/sanitize";
// import { toast } from "sonner";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import {
//   Plus,
//   Eye,
//   Trash2,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Edit,
// } from "lucide-react";

// export default function ManpowerMaster() {
//   const dispatch = useDispatch();
//   const { manpowers, status } = useSelector((state) => state.manpowers);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedManpowerId, setSelectedManpowerId] = useState(null);
//   const [manpowerToDelete, setManpowerToDelete] = useState(null);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [manpowersPerPage, setManpowersPerPage] = useState(() =>
//     typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 10
//   );
//   const [inputError, setInputError] = useState("");
//   const [viewData, setViewData] = useState(null);

//   const [formData, setFormData] = useState({
//     department: "",
//     role: "",
//     level: "",
//     primarySkill: "",
//     experienceMin: 0,
//     experienceMax: 1,
//     costType: "hourly",
//     rate: "",
//     currency: "INR",
//     description: "",
//     isActive: true,
//   });

//   useEffect(() => {
//     dispatch(fetchManpowers());
//   }, [dispatch]);

//   useEffect(() => {
//     const handleResize = () => {
//       setManpowersPerPage(window.innerWidth < 768 ? 5 : 10);
//       setCurrentPage(1);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleReset = () => {
//     setFormData({
//       department: "",
//       role: "",
//       level: "",
//       primarySkill: "",
//       experienceMin: 0,
//       experienceMax: 1,
//       costType: "hourly",
//       rate: "",
//       currency: "INR",
//       description: "",
//       isActive: true,
//     });
//     setSelectedManpowerId(null);
//     setInputError("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const validation = validateInput(value);

//     if (!validation.isValid) {
//       setInputError(validation.warning);
//     } else {
//       setInputError("");
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSliderChange = (name, [value]) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const openEditModal = async (id) => {
//     try {
//       const res = await dispatch(getManpowerById(id)).unwrap();
//       if (res) {
//         setFormData({
//           department: res.department || "",
//           role: res.role || "",
//           level: res.level || "",
//           primarySkill: res.primarySkill || "",
//           experienceMin: res.experienceRange?.min || 0,
//           experienceMax: res.experienceRange?.max || 1,
//           costType: res.costType || "hourly",
//           rate: res.rate || "",
//           currency: res.currency || "INR",
//           description: res.description || "",
//           isActive: res.isActive ?? true,
//         });
//         setSelectedManpowerId(id);
//         setIsModalOpen(true);
//       } else {
//         toast.error("Failed to load manpower.");
//       }
//     } catch {
//       toast.error("Error fetching manpower.");
//     }
//   };

//   const openViewModal = async (id) => {
//     try {
//       const res = await dispatch(getManpowerById(id)).unwrap();
//       if (res) {
//         setViewData(res);
//         setIsViewModalOpen(true);
//       } else {
//         toast.error("Failed to load manpower.");
//       }
//     } catch {
//       toast.error("Error loading manpower.");
//     }
//   };

//   const handleSubmit = async () => {
//     const {
//       department,
//       role,
//       level,
//       primarySkill,
//       experienceMin,
//       experienceMax,
//       costType,
//       rate,
//       currency,
//       description,
//     } = formData;

//     // Validate required fields
//     const validations = [
//       validateInput(department),
//       validateInput(role),
//       validateInput(level),
//       validateInput(primarySkill),
//       validateInput(rate),
//       validateInput(currency),
//     ];

//     const hasError = validations.some((v) => !v.isValid);
//     if (hasError) {
//       toast.warning("Please fix validation errors.");
//       return;
//     }

//     if (Number(experienceMin) > Number(experienceMax)) {
//       toast.warning("Min experience cannot be greater than max.");
//       return;
//     }

//     const submitData = {
//       department,
//       role,
//       level,
//       primarySkill,
//       experienceRange: { min: Number(experienceMin), max: Number(experienceMax) },
//       costType,
//       rate: Number(rate),
//       currency,
//       description,
//       isActive: formData.isActive,
//     };

//     try {
//       if (selectedManpowerId) {
//         await dispatch(
//           updateManpower({ id: selectedManpowerId, ...submitData })
//         ).unwrap();
//         toast.success("Manpower updated successfully.");
//       } else {
//         await dispatch(addManpower(submitData)).unwrap();
//         toast.success("Manpower created successfully.");
//       }

//       setIsModalOpen(false);
//       handleReset();
//       dispatch(fetchManpowers());
//     } catch (err) {
//       toast.error(err?.message || "Operation failed.");
//     }
//   };

//   const sortedManpowers = [...manpowers];
//   const totalItems = sortedManpowers.length;
//   const totalPages = Math.ceil(totalItems / manpowersPerPage);
//   const indexOfLast = currentPage * manpowersPerPage;
//   const indexOfFirst = indexOfLast - manpowersPerPage;
//   const currentManpowers = sortedManpowers.slice(indexOfFirst, indexOfLast);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   // Updated options for departments covering SDLC aspects
// const departments = [
//   "Frontend Development",
//   "Backend Development",
//   "Full Stack Development",
//   "Quality Assurance (QA)",
//   "DevOps & Cloud Engineering",
//   "UI/UX Design",
//   "Data Science & Analytics",
//   "Product Management",
//   "IT Support & Infrastructure",
//   "Business Analysis"
// ];


//   // Updated options for roles covering all required in Software Development Life Cycle (SDLC)
//   const roles = [
//     "Intern",
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "Next.js Developer",
//     "React Developer",
//     "Node.js Developer",
//     "QA Engineer",
//     "Test Engineer",
//     "Project Manager",
//     "Scrum Master",
//     "Network Engineer",
//     "DevOps Engineer",
//     "UI/UX Designer",
//     "Business Analyst",
//     "Data Analyst",
//     "Database Administrator",
//     "System Architect",
//     "Software Engineer",
//     "Mobile Developer",
//   ];

//   // Updated levels including Intern
//   const levels = ["Intern",
//   "Trainee",
//   "Associate",
//   "Junior",
//   "Mid-Level",
//   "Senior",
//   "Lead",
//   "Manager",
//   "Executive"];
// //   const levels = ["Intern", "Jr", "Mid", "Sr", "Expert"];

//   return (
//     <div className="space-y-6 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl font-bold">Manpower Master</h1>
//         <Dialog
//           open={isModalOpen}
//           onOpenChange={(isOpen) => {
//             if (!isOpen) handleReset();
//             setIsModalOpen(isOpen);
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="bg-blue-800 hover:bg-blue-800 text-white">
//               <Plus className="h-4 w-4 mr-2" /> Add Manpower
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-semibold">
//                 {selectedManpowerId ? "Edit Manpower" : "Add New Manpower"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-6 mt-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Department *</Label>
//                   <Select
//                     value={formData.department}
//                     onValueChange={(value) => handleSelectChange("department", value)}
//                   >
//                     <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {departments.map((dept) => (
//                         <SelectItem key={dept} value={dept}>{dept}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Role *</Label>
//                   <Select
//                     value={formData.role}
//                     onValueChange={(value) => handleSelectChange("role", value)}
//                   >
//                     <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {roles.map((role) => (
//                         <SelectItem key={role} value={role}>{role}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Level / Salutation *</Label>
//                   <Select
//                     value={formData.level}
//                     onValueChange={(value) => handleSelectChange("level", value)}
//                   >
//                     <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                       <SelectValue placeholder="Select level" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {levels.map((lvl) => (
//                         <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Primary Skill *</Label>
//                   <Input
//                     name="primarySkill"
//                     value={formData.primarySkill}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <Label className="text-sm font-medium">Experience Range (years) *</Label>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <Label className="mb-2 text-xs text-gray-500">Min Experience</Label>
//                     <Slider
//                       value={[formData.experienceMin]}
//                       onValueChange={(value) => handleSliderChange("experienceMin", value)}
//                       min={0}
//                       max={30}
//                       step={1}
//                       className="w-full"
//                     />
//                     <p className="mt-2 text-sm text-center">{formData.experienceMin} years</p>
//                   </div>
//                   <div>
//                     <Label className="mb-2 text-xs text-gray-500">Max Experience</Label>
//                     <Slider
//                       value={[formData.experienceMax]}
//                       onValueChange={(value) => handleSliderChange("experienceMax", value)}
//                       min={0}
//                       max={30}
//                       step={1}
//                       className="w-full"
//                     />
//                     <p className="mt-2 text-sm text-center">{formData.experienceMax} years</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Cost Type *</Label>
//                   <Select
//                     value={formData.costType}
//                     onValueChange={(value) => handleSelectChange("costType", value)}
//                   >
//                     <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="hourly">Hourly</SelectItem>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="fixed">Fixed</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Rate *</Label>
//                   <Input
//                     type="number"
//                     name="rate"
//                     value={formData.rate}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div>
//                   <Label className="mb-2 text-sm font-medium">Currency *</Label>
//                   <Select
//                     value={formData.currency}
//                     onValueChange={(value) => handleSelectChange("currency", value)}
//                   >
//                     <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="INR">INR</SelectItem>
//                       <SelectItem value="USD">USD</SelectItem>
//                       <SelectItem value="EUR">EUR</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div>
//                 <Label className="mb-2 text-sm font-medium">Description</Label>
//                 <Input
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <Label className="mb-2 text-sm font-medium">Active</Label>
//                 <Select
//                   value={formData.isActive.toString()}
//                   onValueChange={(value) => handleSelectChange("isActive", value === "true")}
//                 >
//                   <SelectTrigger className="w-full border border-gray-300 rounded-md">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="true">Yes</SelectItem>
//                     <SelectItem value="false">No</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {inputError && (
//                 <p className="text-sm text-red-500 mt-1">{inputError}</p>
//               )}
//               <DialogFooter className="gap-2 flex flex-col sm:flex-row">
//                 <DialogClose asChild>
//                   <Button variant="outline" className="w-full sm:w-auto rounded-md">
//                     Cancel
//                   </Button>
//                 </DialogClose>
//                 <Button
//                   onClick={handleSubmit}
//                   className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto rounded-md"
//                 >
//                   {selectedManpowerId ? "Save Changes" : "Create"}
//                 </Button>
//               </DialogFooter>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg border shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <TableRow>
//                 <TableHead className="text-center text-white w-16 sm:w-20">
//                   S.No.
//                 </TableHead>
//                 <TableHead className="text-center text-white">Department</TableHead>
//                 <TableHead className="text-center text-white">Role</TableHead>
//                 <TableHead className="text-center text-white">Level</TableHead>
//                 <TableHead className="text-center text-white">Rate</TableHead>
//                 <TableHead className="text-center text-white w-28 sm:w-32">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {status === "loading" ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//                     <p className="mt-2 text-sm text-muted-foreground">Loading manpowers...</p>
//                   </TableCell>
//                 </TableRow>
//               ) : totalItems === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={6}
//                     className="text-center py-8 text-muted-foreground"
//                   >
//                     <AlertCircle className="h-6 w-6 mx-auto mb-2" />
//                     No manpowers found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 currentManpowers.map((manpower, index) => (
//                   <TableRow key={manpower._id} className="hover:bg-gray-50">
//                     <TableCell className="text-center text-sm sm:text-base">
//                       {indexOfFirst + index + 1}
//                     </TableCell>
//                     <TableCell className="text-center text-sm sm:text-base truncate max-w-[150px]">
//                       {manpower.department}
//                     </TableCell>
//                     <TableCell className="text-center text-sm sm:text-base truncate max-w-[150px]">
//                       {manpower.role}
//                     </TableCell>
//                     <TableCell className="text-center text-sm sm:text-base">
//                       {manpower.level}
//                     </TableCell>
//                     <TableCell className="text-center text-sm sm:text-base">
//                       {manpower.currency} {manpower.rate} /{manpower.costType}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <TooltipProvider>
//                         <div className="flex justify-center space-x-1 sm:space-x-2">
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => openViewModal(manpower.manpowerId)}
//                                 className="text-blue-500 hover:text-blue-600"
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>View</TooltipContent>
//                           </Tooltip>

//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => openEditModal(manpower.manpowerId)}
//                                 className="text-green-500 hover:text-green-600"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Edit</TooltipContent>
//                           </Tooltip>

//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="text-red-500 hover:text-red-600"
//                                 onClick={() => {
//                                   setManpowerToDelete(manpower.manpowerId);
//                                   setIsDeleteConfirmOpen(true);
//                                 }}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Delete</TooltipContent>
//                           </Tooltip>
//                         </div>
//                       </TooltipProvider>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-gray-50">
//           <div className="text-sm text-gray-600">
//             Showing {currentManpowers.length} of {totalItems} manpowers
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <Label className="text-sm">Rows:</Label>
//               <Select
//                 value={manpowersPerPage.toString()}
//                 onValueChange={(value) => {
//                   setManpowersPerPage(Number(value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <SelectTrigger className="w-20 text-sm border border-gray-300 rounded-md">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="border border-gray-300 rounded-md"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <div className="px-2 text-sm">
//                 Page {currentPage} of {totalPages || 1}
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages || totalItems === 0}
//                 className="border border-gray-300 rounded-md"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation */}
//       <Dialog
//         open={isDeleteConfirmOpen}
//         onOpenChange={(isOpen) => {
//           if (!isOpen) setManpowerToDelete(null);
//           setIsDeleteConfirmOpen(isOpen);
//         }}
//       >
//         <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl shadow-2xl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-500 text-lg font-semibold">
//               <AlertCircle className="h-5 w-5" />
//               Confirm Deletion
//             </DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p className="text-sm">
//               Are you sure you want to delete this manpower entry? This action cannot be undone.
//             </p>
//           </div>
//           <DialogFooter className="gap-2 flex flex-col sm:flex-row">
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteConfirmOpen(false)}
//               className="w-full sm:w-auto rounded-md"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 if (manpowerToDelete) {
//                   dispatch(deleteManpower(manpowerToDelete))
//                     .unwrap()
//                     .then(() => {
//                       toast.success("Manpower deleted successfully.");
//                       dispatch(fetchManpowers());
//                       setCurrentPage(1);
//                     })
//                     .catch(() => {
//                       toast.error("Failed to delete manpower.");
//                     })
//                     .finally(() => {
//                       setIsDeleteConfirmOpen(false);
//                       setManpowerToDelete(null);
//                     });
//                 }
//               }}
//               className="w-full sm:w-auto rounded-md"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* View Modal */}
//       <Dialog
//         open={isViewModalOpen}
//         onOpenChange={(open) => {
//           if (!open) setViewData(null);
//           setIsViewModalOpen(open);
//         }}
//       >
//         <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl shadow-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">Manpower Details</DialogTitle>
//           </DialogHeader>
//           {viewData ? (
//             <div className="space-y-4 mt-2">
//               <div>
//                 <Label className="font-medium text-sm">Department:</Label>
//                 <p className="text-gray-600 text-sm break-words">
//                   {viewData.department}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Role:</Label>
//                 <p className="text-gray-600 text-sm break-words">
//                   {viewData.role}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Level:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.level}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Primary Skill:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.primarySkill}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Experience Range:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.experienceRange?.min} - {viewData.experienceRange?.max} years
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Cost Type:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.costType}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Rate:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.currency} {viewData.rate}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Description:</Label>
//                 <p className="text-gray-600 text-sm break-words">
//                   {viewData.description || "N/A"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Active:</Label>
//                 <p className="text-gray-600 text-sm">
//                   {viewData.isActive ? "Yes" : "No"}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-600 text-sm">
//               Loading manpower details...
//             </p>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }










"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManpowers,
  addManpower,
  getManpowerById,
  updateManpower,
  deleteManpower,
} from "@/features/master/manpowerMasterSlice";
import { validateInput } from "@/utils/sanitize";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";

export default function ManpowerMaster() {
  const dispatch = useDispatch();
  const { manpowers, status } = useSelector((state) => state.manpowers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedManpowerId, setSelectedManpowerId] = useState(null);
  const [manpowerToDelete, setManpowerToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [manpowersPerPage, setManpowersPerPage] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 10
  );
  const [inputError, setInputError] = useState("");
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    department: "",
    role: "",
    level: "",
    primarySkill: "",
    experienceMin: 0,
    experienceMax: 1,
    costType: "hourly",
    rate: "",
    currency: "INR",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchManpowers());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setManpowersPerPage(window.innerWidth < 768 ? 5 : 10);
      setCurrentPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReset = () => {
    setFormData({
      department: "",
      role: "",
      level: "",
      primarySkill: "",
      experienceMin: 0,
      experienceMax: 1,
      costType: "hourly",
      rate: "",
      currency: "INR",
      description: "",
      isActive: true,
    });
    setSelectedManpowerId(null);
    setInputError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);

    if (!validation.isValid) {
      setInputError(validation.warning);
    } else {
      setInputError("");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "department") {
      setFormData((prev) => ({ ...prev, [name]: value, role: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSliderChange = (name, [value]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = async (id) => {
    try {
      const res = await dispatch(getManpowerById(id)).unwrap();
      if (res) {
        setFormData({
          department: res.department || "",
          role: res.role || "",
          level: res.level || "",
          primarySkill: res.primarySkill || "",
          experienceMin: res.experienceRange?.min || 0,
          experienceMax: res.experienceRange?.max || 1,
          costType: res.costType || "hourly",
          rate: res.rate || "",
          currency: res.currency || "INR",
          description: res.description || "",
          isActive: res.isActive ?? true,
        });
        setSelectedManpowerId(id);
        setIsModalOpen(true);
      } else {
        toast.error("Failed to load manpower.");
      }
    } catch {
      toast.error("Error fetching manpower.");
    }
  };

  const openViewModal = async (id) => {
    try {
      const res = await dispatch(getManpowerById(id)).unwrap();
      if (res) {
        setViewData(res);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to load manpower.");
      }
    } catch {
      toast.error("Error loading manpower.");
    }
  };

  const handleSubmit = async () => {
    const {
      department,
      role,
      level,
      primarySkill,
      experienceMin,
      experienceMax,
      costType,
      rate,
      currency,
      description,
    } = formData;

    // Validate required fields
    const validations = [
      validateInput(department),
      validateInput(role),
      validateInput(level),
      validateInput(primarySkill),
      validateInput(rate),
      validateInput(currency),
    ];

    const hasError = validations.some((v) => !v.isValid);
    if (hasError) {
      toast.warning("Please fix validation errors.");
      return;
    }

    if (Number(experienceMin) > Number(experienceMax)) {
      toast.warning("Min experience cannot be greater than max.");
      return;
    }

    const submitData = {
      department,
      role,
      level,
      primarySkill,
      experienceRange: { min: Number(experienceMin), max: Number(experienceMax) },
      costType,
      rate: Number(rate),
      currency,
      description,
      isActive: formData.isActive,
    };

    try {
      if (selectedManpowerId) {
        await dispatch(
          updateManpower({ id: selectedManpowerId, ...submitData })
        ).unwrap();
        toast.success("Manpower updated successfully.");
      } else {
        await dispatch(addManpower(submitData)).unwrap();
        toast.success("Manpower created successfully.");
      }

      setIsModalOpen(false);
      handleReset();
      dispatch(fetchManpowers());
    } catch (err) {
      toast.error(err?.message || "Operation failed.");
    }
  };

  const sortedManpowers = [...manpowers];
  const totalItems = sortedManpowers.length;
  const totalPages = Math.ceil(totalItems / manpowersPerPage);
  const indexOfLast = currentPage * manpowersPerPage;
  const indexOfFirst = indexOfLast - manpowersPerPage;
  const currentManpowers = sortedManpowers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Updated options for departments covering SDLC aspects
  const departments = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Quality Assurance (QA)",
    "DevOps & Cloud Engineering",
    "UI/UX Design",
    "Data Science & Analytics",
    "Product Management",
    "IT Support & Infrastructure",
    "Business Analysis"
  ];

  // Mapping of departments to roles
  const departmentToRoles = {
    "Frontend Development": [
      "Intern",
      "Frontend Developer",
      "React Developer",
      "Next.js Developer",
      "Mobile Developer"
    ],
    "Backend Development": [
      "Intern",
      "Backend Developer",
      "Node.js Developer",
      "Database Administrator",
      "Software Engineer"
    ],
    "Full Stack Development": [
      "Intern",
      "Full Stack Developer",
      "Software Engineer"
    ],
    "Quality Assurance (QA)": [
      "Intern",
      "QA Engineer",
      "Test Engineer"
    ],
    "DevOps & Cloud Engineering": [
      "Intern",
      "DevOps Engineer",
      "Network Engineer",
      "System Architect"
    ],
    "UI/UX Design": [
      "Intern",
      "UI/UX Designer"
    ],
    "Data Science & Analytics": [
      "Intern",
      "Data Analyst"
    ],
    "Product Management": [
      "Intern",
      "Project Manager",
      "Scrum Master"
    ],
    "IT Support & Infrastructure": [
      "Intern",
      "Network Engineer",
      "System Architect",
      "Software Engineer"
    ],
    "Business Analysis": [
      "Intern",
      "Business Analyst"
    ]
  };

  // Get available roles based on selected department
  const availableRoles = formData.department ? departmentToRoles[formData.department] || [] : [];

  // Updated levels including Intern
  const levels = ["Intern",
  "Trainee",
  "Junior",
  "Senior",
  "Lead",
  "Manager",
  "Executive"];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Manpower Master</h1>
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleReset();
            setIsModalOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-800 hover:bg-blue-800 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Manpower
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selectedManpowerId ? "Edit Manpower" : "Add New Manpower"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 text-sm font-medium">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 text-sm font-medium">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    disabled={!formData.department}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 text-sm font-medium">Level / Salutation *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleSelectChange("level", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 text-sm font-medium">Primary Skill *</Label>
                  <Input
                    name="primarySkill"
                    value={formData.primarySkill}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Experience Range (years) *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 text-xs text-gray-500">Min Experience</Label>
                    <Slider
                      value={[formData.experienceMin]}
                      onValueChange={(value) => handleSliderChange("experienceMin", value)}
                      min={0}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <p className="mt-2 text-sm text-center">{formData.experienceMin} years</p>
                  </div>
                  <div>
                    <Label className="mb-2 text-xs text-gray-500">Max Experience</Label>
                    <Slider
                      value={[formData.experienceMax]}
                      onValueChange={(value) => handleSliderChange("experienceMax", value)}
                      min={0}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <p className="mt-2 text-sm text-center">{formData.experienceMax} years</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-2 text-sm font-medium">Cost Type *</Label>
                  <Select
                    value={formData.costType}
                    onValueChange={(value) => handleSelectChange("costType", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 text-sm font-medium">Rate *</Label>
                  <Input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <Label className="mb-2 text-sm font-medium">Currency *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="mb-2 text-sm font-medium">Description</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label className="mb-2 text-sm font-medium">Active</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => handleSelectChange("isActive", value === "true")}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {inputError && (
                <p className="text-sm text-red-500 mt-1">{inputError}</p>
              )}
              <DialogFooter className="gap-2 flex flex-col sm:flex-row">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto rounded-md">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto rounded-md"
                >
                  {selectedManpowerId ? "Save Changes" : "Create"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <TableRow>
                <TableHead className="text-center text-white w-16 sm:w-20">
                  S.No.
                </TableHead>
                <TableHead className="text-center text-white">Department</TableHead>
                <TableHead className="text-center text-white">Role</TableHead>
                <TableHead className="text-center text-white">Level</TableHead>
                <TableHead className="text-center text-white">Rate</TableHead>
                <TableHead className="text-center text-white w-28 sm:w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading manpowers...</p>
                  </TableCell>
                </TableRow>
              ) : totalItems === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                    No manpowers found.
                  </TableCell>
                </TableRow>
              ) : (
                currentManpowers.map((manpower, index) => (
                  <TableRow key={manpower._id} className="hover:bg-gray-50">
                    <TableCell className="text-center text-sm sm:text-base">
                      {indexOfFirst + index + 1}
                    </TableCell>
                    <TableCell className="text-center text-sm sm:text-base truncate max-w-[150px]">
                      {manpower.department}
                    </TableCell>
                    <TableCell className="text-center text-sm sm:text-base truncate max-w-[150px]">
                      {manpower.role}
                    </TableCell>
                    <TableCell className="text-center text-sm sm:text-base">
                      {manpower.level}
                    </TableCell>
                    <TableCell className="text-center text-sm sm:text-base">
                      {manpower.currency} {manpower.rate} /{manpower.costType}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <div className="flex justify-center space-x-1 sm:space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openViewModal(manpower.manpowerId)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(manpower.manpowerId)}
                                className="text-green-500 hover:text-green-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  setManpowerToDelete(manpower.manpowerId);
                                  setIsDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {currentManpowers.length} of {totalItems} manpowers
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Rows:</Label>
              <Select
                value={manpowersPerPage.toString()}
                onValueChange={(value) => {
                  setManpowersPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 text-sm border border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border border-gray-300 rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2 text-sm">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalItems === 0}
                className="border border-gray-300 rounded-md"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setManpowerToDelete(null);
          setIsDeleteConfirmOpen(isOpen);
        }}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500 text-lg font-semibold">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to delete this manpower entry? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="w-full sm:w-auto rounded-md"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (manpowerToDelete) {
                  dispatch(deleteManpower(manpowerToDelete))
                    .unwrap()
                    .then(() => {
                      toast.success("Manpower deleted successfully.");
                      dispatch(fetchManpowers());
                      setCurrentPage(1);
                    })
                    .catch(() => {
                      toast.error("Failed to delete manpower.");
                    })
                    .finally(() => {
                      setIsDeleteConfirmOpen(false);
                      setManpowerToDelete(null);
                    });
                }
              }}
              className="w-full sm:w-auto rounded-md"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) setViewData(null);
          setIsViewModalOpen(open);
        }}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Manpower Details</DialogTitle>
          </DialogHeader>
          {viewData ? (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="font-medium text-sm">Department:</Label>
                <p className="text-gray-600 text-sm break-words">
                  {viewData.department}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Role:</Label>
                <p className="text-gray-600 text-sm break-words">
                  {viewData.role}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Level:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.level}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Primary Skill:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.primarySkill}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Experience Range:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.experienceRange?.min} - {viewData.experienceRange?.max} years
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Cost Type:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.costType}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Rate:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.currency} {viewData.rate}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Description:</Label>
                <p className="text-gray-600 text-sm break-words">
                  {viewData.description || "N/A"}
                </p>
              </div>
              <div>
                <Label className="font-medium text-sm">Active:</Label>
                <p className="text-gray-600 text-sm">
                  {viewData.isActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              Loading manpower details...
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}