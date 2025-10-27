


// 'use client';

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBugByEmployeeId,
 
// } from "@/features/bugSlice";
// import {
//   Bug as BugIcon,
//   Loader2,
//   Search,
//   Filter,
//   ChevronDown,
//   ArrowUp,
//   ArrowDown,
//   Eye,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

// import { FiX } from "react-icons/fi";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import BugDetailsViewModal from "./BugDetailsViewModal";

// // Status and priority styling
// const statusColors = {
//   open: "bg-red-100 text-red-800 border-red-200",
//   resolved: "bg-green-100 text-green-800 border-green-200",
// };

// const priorityColors = {
//   High: "bg-red-100 text-red-800 border-red-200",
//   Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   Low: "bg-green-100 text-green-800 border-green-200",
// };

// const reviewStatusColors = {
//   NA: "bg-gray-100 text-gray-800 border-gray-300",
//   INREVIEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   BUGREPORTED: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   RESOLVED: "bg-green-100 text-green-800 border-green-200",
// };

// export default function AllBugByEmployeeId() {
//   const { currentUser } = useCurrentUser();
//   const employeeId = currentUser?.id;
//   const dispatch = useDispatch();

//   // Define selectors inside component
//   const selectBugsByEmployeeId = (state) => state.bugs.bugsByEmployeeId;
//   const selectLoading = (state) => state.bugs.loading;
//   const selectError = (state) => state.bugs.error;

//   const bugsByEmployeeId = useSelector(selectBugsByEmployeeId);
//   const loading = useSelector(selectLoading);
//   const error = useSelector(selectError);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [selectedPriority, setSelectedPriority] = useState("all");
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);
//   const [selectedBug, setSelectedBug] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (employeeId) {
//       dispatch(fetchBugByEmployeeId(employeeId))
      
//     }
  
//   }, [dispatch, employeeId]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, selectedStatus, selectedPriority, itemsPerPage]);

//   // Update currentPage if it exceeds totalPages after data changes (e.g., after resolve and refetch)
//   useEffect(() => {
//     const totalPages = Math.ceil((bugsByEmployeeId?.length || 0) / itemsPerPage);
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     } else if (totalPages === 0 && currentPage !== 1) {
//       setCurrentPage(1);
//     }
//   }, [bugsByEmployeeId, itemsPerPage, currentPage]);

//   // Calculate bug statistics
//   const bugStats = {
//     total: bugsByEmployeeId?.length || 0,
//     open: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === "open").length || 0,
//     resolved: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === "resolved").length || 0,
//     highPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "High").length || 0,
//     mediumPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "Medium").length || 0,
//     lowPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "Low").length || 0,
//   };

//   // Filter and sort bugs
//   const filteredAndSortedBugs = () => {
//     let filtered = bugsByEmployeeId || [];

//     if (selectedStatus !== "all") {
//       filtered = filtered.filter((bug) => bug.status.toLowerCase() === selectedStatus);
//     }

//     if (selectedPriority !== "all") {
//       filtered = filtered.filter((bug) => bug.priority === selectedPriority);
//     }

//     if (searchTerm.trim() !== "") {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (bug) =>
//           bug.bug_id?.toLowerCase().includes(term) ||
//           bug.title?.toLowerCase().includes(term) ||
//           bug.description?.toLowerCase().includes(term) ||
//           bug.taskRef?.toLowerCase().includes(term)
//       );
//     }

//     if (sortField) {
//       return [...filtered].sort((a, b) => {
//         const fieldA = a[sortField] || "";
//         const fieldB = b[sortField] || "";
//         return sortDirection === "asc"
//           ? fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
//           : fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
//       });
//     }

//     return filtered;
//   };

//   // Pagination logic
//   const sortedBugs = filteredAndSortedBugs();
//   const totalPages = Math.ceil(sortedBugs.length / itemsPerPage);
//   const indexOfLastBug = currentPage * itemsPerPage;
//   const indexOfFirstBug = indexOfLastBug - itemsPerPage;
//   const currentBugs = sortedBugs.slice(indexOfFirstBug, indexOfLastBug);

//   // Generate pagination buttons (max 8, with ellipsis)
//   const getPaginationButtons = () => {
//     const maxButtons = 8;
//     const buttons = [];
//     const ellipsis = <span key={`ellipsis-${buttons.length}`} className="text-gray-800 text-sm">...</span>;

//     if (totalPages <= maxButtons) {
//       for (let i = 1; i <= totalPages; i++) {
//         buttons.push(i);
//       }
//     } else {
//       const startPage = Math.max(2, currentPage - 2);
//       const endPage = Math.min(totalPages - 1, currentPage + 2);

//       buttons.push(1);
//       if (startPage > 2) buttons.push(ellipsis);
//       for (let i = startPage; i <= endPage; i++) {
//         buttons.push(i);
//       }
//       if (endPage < totalPages - 1) buttons.push(ellipsis);
//       buttons.push(totalPages);
//     }

//     return buttons;
//   };

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleViewClick = (bug) => {
//     setSelectedBug(bug);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     dispatch(fetchBugByEmployeeId(employeeId));
//     setIsModalOpen(false);
//     setSelectedBug(null);
//   };

//   const handleResolveSuccess = () => {
//     setIsModalOpen(false);
//     setSelectedBug(null);
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   const handleStatusFilter = (status) => {
//     setSelectedStatus(status);
//   };

//   const handlePriorityFilter = (priority) => {
//     setSelectedPriority(priority);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSelectedStatus("all");
//     setSelectedPriority("all");
//     setSortField(null);
//     setSortDirection("asc");
//   };



//   // Loading state
//   if (loading.bugsByEmployeeId) {
//     return (
//       <div className="p-4 sm:p-6 space-y-4 bg-white rounded-lg shadow-md border border-gray-200">
//         {[...Array(5)].map((_, i) => (
//           <Skeleton key={i} className="h-12 w-full rounded-lg" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto px-4 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//                 Assigned Issues
//               </h1>
//             </div>
//             <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//               <div className="relative w-full sm:w-64">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
//                 <Input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search bugs..."
//                   className="pl-9 text-sm border-gray-300 focus:border-[#1447e6] focus:ring-[#1447e6] text-gray-800"
//                 />
//                 {searchTerm && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-[#1447e6] hover:bg-gray-100"
//                   >
//                     <FiX className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-2 border-gray-300 text-gray-800 hover:bg-gray-100 text-sm"
//                   >
//                     <Filter className="h-4 w-4" />
//                     <span className="hidden sm:inline">Filter</span>
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200">
//                   <DropdownMenuLabel className="text-gray-800">Filter by Status</DropdownMenuLabel>
//                   <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
//                     <div className="flex justify-between w-full">
//                       <span>All Bugs</span>
//                       <Badge variant="secondary" className="bg-gray-100 text-gray-800">
//                         {bugStats.total}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleStatusFilter("open")}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <span className="mr-1.5 text-gray-800">●</span>
//                         Open
//                       </div>
//                       <Badge variant="secondary" className="bg-red-100 text-gray-800">
//                         {bugStats.open}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleStatusFilter("resolved")}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <span className="mr-1.5 text-gray-800">●</span>
//                         Resolved
//                       </div>
//                       <Badge variant="secondary" className="bg-green-100 text-gray-800">
//                         {bugStats.resolved}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuLabel className="text-gray-800">Filter by Priority</DropdownMenuLabel>
//                   <DropdownMenuItem onClick={() => handlePriorityFilter("all")}>
//                     <div className="flex justify-between w-full">
//                       <span>All Priorities</span>
//                       <Badge variant="secondary" className="bg-gray-100 text-gray-800">
//                         {bugStats.total}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handlePriorityFilter("High")}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <span className="mr-1.5 text-gray-800">●</span>
//                         High
//                       </div>
//                       <Badge variant="secondary" className="bg-red-100 text-gray-800">
//                         {bugStats.highPriority}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handlePriorityFilter("Medium")}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <span className="mr-1.5 text-gray-800">●</span>
//                         Medium
//                       </div>
//                       <Badge variant="secondary" className="bg-yellow-100 text-gray-800">
//                         {bugStats.mediumPriority}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handlePriorityFilter("Low")}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <span className="mr-1.5 text-gray-800">●</span>
//                         Low
//                       </div>
//                       <Badge variant="secondary" className="bg-green-100 text-gray-800">
//                         {bugStats.lowPriority}
//                       </Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={clearFilters} className="justify-center text-gray-800">
//                     Clear All Filters
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bugs Table */}
//       <div className="mt-4 bg-white rounded-md shadow-md border border-gray-200 flex-1 flex flex-col">
//         <div className="overflow-x-auto flex-1">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12">
              
//                 <TableHead
//                   className="text-white cursor-pointer hidden sm:table-cell"
//                   onClick={() => handleSort("title")}
//                 >
//                   Title
//                   {sortField === "title" &&
//                     (sortDirection === "asc" ? (
//                       <ArrowUp className="inline ml-1 h-4 w-4" />
//                     ) : (
//                       <ArrowDown className="inline ml-1 h-4 w-4" />
//                     ))}
//                 </TableHead>
//                 <TableHead className="text-white hidden md:table-cell">Project Name</TableHead>
//                 <TableHead
//                   className="text-white cursor-pointer"
//                   onClick={() => handleSort("status")}
//                 >
//                   Status
//                   {sortField === "status" &&
//                     (sortDirection === "asc" ? (
//                       <ArrowUp className="inline ml-1 h-4 w-4" />
//                     ) : (
//                       <ArrowDown className="inline ml-1 h-4 w-4" />
//                     ))}
//                 </TableHead>
//                 <TableHead className="text-white hidden lg:table-cell">Created At</TableHead>
//                 <TableHead
//                   className="text-white cursor-pointer hidden sm:table-cell"
//                   onClick={() => handleSort("priority")}
//                 >
//                   Priority
//                   {sortField === "priority" &&
//                     (sortDirection === "asc" ? (
//                       <ArrowUp className="inline ml-1 h-4 w-4" />
//                     ) : (
//                       <ArrowDown className="inline ml-1 h-4 w-4" />
//                     ))}
//                 </TableHead>
//                 <TableHead className="text-white">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {sortedBugs.length === 0 ? (
//                 <TableRow className="h-[24rem]">
//                   <TableCell colSpan={7}>
//                     <div className="flex flex-col items-center justify-center h-full text-center">
//                       <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-800 mb-4">
//                         <BugIcon className="text-3xl" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-gray-800 mb-2">No bugs found</h3>
//                       <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                         {selectedStatus === "all" && selectedPriority === "all" && !searchTerm
//                           ? "No bugs are assigned to this employee."
//                           : "No bugs match your current filters. Try adjusting your search or filter criteria."}
//                       </p>
//                       <Button
//                         variant="outline"
//                         onClick={clearFilters}
//                         className="flex items-center gap-2 mx-auto border-gray-300 text-gray-800 hover:bg-gray-100"
//                       >
//                         <FiX />
//                         Clear Filters
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 <>
//                   {currentBugs.map((bug) => (
//                     <TableRow key={bug._id} className="hover:bg-gray-100 h-12">
//                       <TableCell className="text-gray-800 text-sm max-w-xs truncate hidden sm:table-cell">
//                         {bug.title}
//                       </TableCell>
//                       <TableCell className="text-gray-800 text-sm hidden md:table-cell">{bug.projectName}</TableCell>
//                       <TableCell>
//                         <Badge className={`${statusColors[bug.status.toLowerCase()]} border capitalize text-xs`}>
//                           {bug.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-gray-800 text-sm hidden lg:table-cell">
//                         {new Date(bug.deadline).toLocaleString("en-IN", {
//                           dateStyle: "medium",
//                           timeStyle: "short",
//                         })}
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className={`${priorityColors[bug.priority]} border text-xs`}>{bug.priority}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="text-gray-800 hover:text-[#1447e6] hover:bg-gray-100"
//                           onClick={() => handleViewClick(bug)}
//                           aria-label={`View bug ${bug.bug_id}`}
//                         >
//                           <Eye className="w-4 h-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {Array.from({ length: itemsPerPage - currentBugs.length }).map((_, i) => (
//                     <TableRow key={`empty-${i}`} className="h-12">
//                       <TableCell>&nbsp;</TableCell>
//                       <TableCell className="hidden sm:table-cell">&nbsp;</TableCell>
//                       <TableCell className="hidden md:table-cell">&nbsp;</TableCell>
//                       <TableCell>&nbsp;</TableCell>
//                       <TableCell className="hidden lg:table-cell">&nbsp;</TableCell>
//                       <TableCell className="hidden sm:table-cell">&nbsp;</TableCell>
//                       <TableCell>&nbsp;</TableCell>
//                     </TableRow>
//                   ))}
//                 </>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 0 && (
//           <div className="h-12 flex items-center justify-between px-4 bg-white border-t border-gray-200">
//             <Button
//               variant="outline"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="text-gray-800 hover:bg-gray-100 border-gray-300 text-sm px-3 py-1"
//             >
//               Previous
//             </Button>
//             <div className="flex items-center space-x-2">
//               {getPaginationButtons().map((page, idx) =>
//                 typeof page === "number" ? (
//                   <Button
//                     key={idx}
//                     variant={currentPage === page ? "default" : "outline"}
//                     onClick={() => handlePageChange(page)}
//                     className={
//                       currentPage === page
//                         ? "bg-[#1447e6] text-white hover:bg-[#0f3cb5] text-sm px-3 py-1"
//                         : "text-gray-800 hover:bg-gray-100 border-gray-300 text-sm px-3 py-1"
//                     }
//                   >
//                     {page}
//                   </Button>
//                 ) : (
//                   page
//                 )
//               )}
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="text-gray-800 hover:bg-gray-100 border-gray-300 text-sm px-3 py-1"
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Bug Details Modal */}
//       <BugDetailsViewModal
//         isOpen={isModalOpen}
//         onOpenChange={handleModalClose}
//         bug={selectedBug}
//         bugId={selectedBug?.bug_id}
//         employeeId={employeeId}
//         onResolveSuccess={handleResolveSuccess}
//       />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBugByEmployeeId } from "@/features/bugSlice";
import {
  Bug as BugIcon,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Pagination";
import { FiX } from "react-icons/fi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BugDetailsViewModal from "./BugDetailsViewModal";
import { formatDateTimeIST } from "@/utils/formatDate";

// Status and priority styling
const statusColors = {
  open: "bg-red-100 text-red-700 border-red-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
};

const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const reviewStatusColors = {
  NA: "bg-gray-100 text-gray-700 border-gray-200",
  INREVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
  BUGREPORTED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
};

// Status and priority filter options
const statusFilterOptions = [
  { value: "all", label: "All Bugs" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

const priorityFilterOptions = [
  { value: "all", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

// Sort options
const sortOptions = [
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "status-asc", label: "Status (A-Z)" },
  { value: "status-desc", label: "Status (Z-A)" },
  { value: "priority-asc", label: "Priority (Low to High)" },
  { value: "priority-desc", label: "Priority (High to Low)" },
  { value: "deadline-desc", label: "Newest First" },
  { value: "deadline-asc", label: "Oldest First" },
];

export default function AllBugByEmployeeId() {
  const { currentUser } = useCurrentUser();
  const employeeId = currentUser?.id;
  const dispatch = useDispatch();

  // Define selectors inside component
  const selectBugsByEmployeeId = (state) => state.bugs.bugsByEmployeeId;
  const selectLoading = (state) => state.bugs.loading;
  const selectError = (state) => state.bugs.error;

  const bugsByEmployeeId = useSelector(selectBugsByEmployeeId);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedBug, setSelectedBug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchBugByEmployeeId(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedPriority]);

  // Update currentPage if it exceeds totalPages
  useEffect(() => {
    const totalPages = Math.ceil((bugsByEmployeeId?.length || 0) / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [bugsByEmployeeId, itemsPerPage, currentPage]);

  // Calculate bug statistics
  const bugStats = {
    total: bugsByEmployeeId?.length || 0,
    open: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === "open").length || 0,
    resolved: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === "resolved").length || 0,
    highPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "High").length || 0,
    mediumPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "Medium").length || 0,
    lowPriority: bugsByEmployeeId?.filter((bug) => bug.priority === "Low").length || 0,
  };

  // Filter and sort bugs
 // Filter and sort bugs
const filteredAndSortedBugs = () => {
  let filtered = bugsByEmployeeId || [];

  if (selectedStatus !== "all") {
    filtered = filtered.filter((bug) => bug.status.toLowerCase() === selectedStatus);
  }

  if (selectedPriority !== "all") {
    filtered = filtered.filter((bug) => bug.priority === selectedPriority);
  }

  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (bug) =>
        bug.bug_id?.toLowerCase().includes(term) ||
        bug.title?.toLowerCase().includes(term) ||
        bug.description?.toLowerCase().includes(term) ||
        bug.taskRef?.toLowerCase().includes(term)
    );
  }

  // Create a shallow copy of the filtered array before sorting
  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "title-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "status-asc":
        return (a.status || "").localeCompare(b.status || "");
      case "status-desc":
        return (b.status || "").localeCompare(a.status || "");
      case "priority-asc":
        return (a.priority || "").localeCompare(b.priority || "");
      case "priority-desc":
        return (b.priority || "").localeCompare(a.priority || "");
      case "deadline-desc":
        return new Date(b.deadline) - new Date(a.deadline);
      case "deadline-asc":
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });
};

  // Pagination logic
  const sortedBugs = filteredAndSortedBugs();
  const totalPages = Math.ceil(sortedBugs.length / itemsPerPage);
  const paginatedBugs = sortedBugs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewClick = (bug) => {
    setSelectedBug(bug);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    dispatch(fetchBugByEmployeeId(employeeId));
    setIsModalOpen(false);
    setSelectedBug(null);
  };

  const handleResolveSuccess = () => {
    setIsModalOpen(false);
    setSelectedBug(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSortBy("deadline-desc");
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center gap-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // No results message
  const NoResults = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <BugIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No bugs found
      </h3>
      <p className="text-gray-600 mb-6">
        {selectedStatus === "all" && selectedPriority === "all" && !searchTerm
          ? "No bugs are assigned to this employee."
          : "No bugs match your current filters. Try adjusting your search or filter criteria."}
      </p>
      <Button
        onClick={clearFilters}
        variant="outline"
        className="text-sm"
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (loading.bugsByEmployeeId && bugsByEmployeeId.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white p-4 sm:p-8">
        <Card className="mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-100 text-white rounded-t-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="animate-pulse">
                <div className="h-6 bg-blue-400 rounded w-32 mb-2"></div>
                <div className="h-4 bg-blue-300 rounded w-24"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <LoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <Card className="mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="bg-gray-200 rounded-t-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            
              <h1 className="text-xl sm:text-2xl font-bold">Assigned Issues</h1>
             
            
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Search and Controls */}
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[180px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm w-full"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[140px]">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="text-sm w-full">
                  <SelectValue placeholder="All Bugs" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      <div className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className={`ml-2 ${statusColors[option.value] || "bg-gray-100 text-gray-700"}`}>
                          {option.value === "all"
                            ? bugStats.total
                            : option.value === "open"
                            ? bugStats.open
                            : bugStats.resolved}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="flex-1 min-w-[140px]">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="text-sm w-full">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  {priorityFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      <div className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className={`ml-2 ${priorityColors[option.value] || "bg-gray-100 text-gray-700"}`}>
                          {option.value === "all"
                            ? bugStats.total
                            : option.value === "High"
                            ? bugStats.highPriority
                            : option.value === "Medium"
                            ? bugStats.mediumPriority
                            : bugStats.lowPriority}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex-1 min-w-[140px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-sm w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bugs Table */}
          {loading.bugsByEmployeeId && sortedBugs.length > 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
            </div>
          ) : sortedBugs.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 text-xs sm:text-sm">
                      <TableHead className="font-bold text-gray-700">Bug Title</TableHead>
                      <TableHead className="font-bold text-gray-700 hidden md:table-cell">Project Name</TableHead>
                      <TableHead className="font-bold text-gray-700">Status</TableHead>
                      <TableHead className="font-bold text-gray-700 hidden lg:table-cell">Deadline</TableHead>
                      <TableHead className="font-bold text-gray-700 hidden sm:table-cell">Priority</TableHead>
                      <TableHead className="font-bold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBugs.map((bug) => (
                      <TableRow key={bug._id} className="text-xs sm:text-sm">
                        <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                          {bug.title}
                        </TableCell>
                        <TableCell className="text-gray-600 hidden md:table-cell">
                          {bug.projectName}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[bug.status.toLowerCase()]} text-xs capitalize`}>
                            {bug.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 hidden lg:table-cell">
                          {
                            formatDateTimeIST(bug.deadline)
                          }
                        
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={`${priorityColors[bug.priority]} text-xs`}>
                            {bug.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-blue-600 hover:text-blue-700"
                            onClick={() => handleViewClick(bug)}
                            aria-label={`View bug ${bug.bug_id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-700">
                  Page {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedBugs.length)} of{" "}
                  {sortedBugs.length} Bugs
                </div>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === pageNum}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNum);
                                }}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bug Details Modal */}
      <BugDetailsViewModal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        bug={selectedBug}
        bugId={selectedBug?.bug_id}
        employeeId={employeeId}
        onResolveSuccess={handleResolveSuccess}
      />
    </div>
  );
}