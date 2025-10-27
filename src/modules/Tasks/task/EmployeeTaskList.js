






'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTaskByEmployeeId,
  getAllSubTaskByEmployeeId,
  selectAllTaskListByEmployeeId,
  selectAllSubTaskListByEmployeeId,
} from '@/features/taskSlice';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiCalendar,
} from 'react-icons/fi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateUTC } from '@/utils/formatDate';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Status and priority styling
const statusColors = {
  Planned: 'bg-green-100 text-green-800 border-green-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons = {
  Planned: <FiClock className="inline-block mr-1" />,
  'In Progress': <FiAlertCircle className="inline-block mr-1" />,
  Completed: <FiCheckCircle className="inline-block mr-1" />,
};

const priorityColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
};

const AllTasksList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const employeeTasks = useSelector(selectAllTaskListByEmployeeId);
  const employeeSubTasks = useSelector(selectAllSubTaskListByEmployeeId);
  const { loading: userLoading, employeeData } = useSelector((state) => state.user);
  const { isLoading, error } = useSelector((state) => state.task);
  const employeeId = employeeData?.employeeID;

  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(8);
  const [goToPage, setGoToPage] = useState('');

  useEffect(() => {
    if (employeeId) {
      dispatch(getAllTaskByEmployeeId(employeeId));
      dispatch(getAllSubTaskByEmployeeId(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedPriority, tasksPerPage, activeTab]);

  // Process tasks and subtasks
  const processedTasks = useMemo(() => {
    return employeeTasks.map((task) => ({
      ...task,
      id: task.task_id,
      _id: task._id,
      projectName: task.projectName || 'N/A',
    }));
  }, [employeeTasks]);

  const processedSubTasks = useMemo(() => {
    return employeeSubTasks.map((sub) => ({
      ...sub,
      id: sub.sub_task_id,
      _id: sub._id,
      projectName: sub.projectName || 'N/A',
    }));
  }, [employeeSubTasks]);

  // Task statistics
  const taskStats = useMemo(() => ({
    tasks: {
      total: processedTasks.length,
      planned: processedTasks.filter((item) => item.status === 'Planned').length,
      inProgress: processedTasks.filter((item) => item.status === 'In Progress').length,
      completed: processedTasks.filter((item) => item.status === 'Completed').length,
      highPriority: processedTasks.filter((item) => item.priority === 'High').length,
      mediumPriority: processedTasks.filter((item) => item.priority === 'Medium').length,
      lowPriority: processedTasks.filter((item) => item.priority === 'Low').length,
    },
    subtasks: {
      total: processedSubTasks.length,
      planned: processedSubTasks.filter((item) => item.status === 'Planned').length,
      inProgress: processedSubTasks.filter((item) => item.status === 'In Progress').length,
      completed: processedSubTasks.filter((item) => item.status === 'Completed').length,
      highPriority: processedSubTasks.filter((item) => item.priority === 'High').length,
      mediumPriority: processedSubTasks.filter((item) => item.priority === 'Medium').length,
      lowPriority: processedSubTasks.filter((item) => item.priority === 'Low').length,
    },
  }), [processedTasks, processedSubTasks]);

  // Filtering

const filterItems = useCallback((items) => {
  return items.filter((item) => {
    let matches = true;
    if (selectedStatus !== 'all') matches = matches && item.status === selectedStatus;
    if (selectedPriority !== 'all') matches = matches && item.priority === selectedPriority;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      matches = matches && (
        item.title?.toLowerCase().includes(term) ||
        item.projectName?.toLowerCase().includes(term) ||
        item.assignedBy?.toLowerCase().includes(term) ||
        item.id?.toString().includes(term)
      );
    }
    return matches;
  });
}, [selectedStatus, selectedPriority, searchTerm]);
 const filteredTasks = useMemo(() => filterItems(processedTasks), [filterItems, processedTasks]);
const filteredSubTasks = useMemo(() => filterItems(processedSubTasks), [filterItems, processedSubTasks]);



  // Sorting
  
const sortItems = useCallback((items) => {
  if (!sortField) return items;
  return [...items].sort((a, b) => {
    let fieldA = a[sortField] || '';
    let fieldB = b[sortField] || '';
    if (sortField === 'deadline') {
      fieldA = new Date(fieldA).getTime() || 0;
      fieldB = new Date(fieldB).getTime() || 0;
    }
    return sortDirection === 'asc'
      ? fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
      : fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
  });
}, [sortField, sortDirection]);
const sortedTasks = useMemo(() => sortItems(filteredTasks), [sortItems, filteredTasks]);
const sortedSubTasks = useMemo(() => sortItems(filteredSubTasks), [sortItems, filteredSubTasks]);
  // Pagination
  const items = activeTab === 'tasks' ? sortedTasks : sortedSubTasks;
  const stats = activeTab === 'tasks' ? taskStats.tasks : taskStats.subtasks;
  const totalPages = Math.ceil(items.length / tasksPerPage);
  const indexOfLastItem = currentPage * tasksPerPage;
  const indexOfFirstItem = indexOfLastItem - tasksPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPage('');
    } else {
      // toast.info(`Please enter a page number between 1 and ${totalPages}.`);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortField(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleView = (item) => {
    if (activeTab === 'tasks') {
      router.push(`/task/${item.task_id}`);
    } else {
      router.push(`/task/${item.task_id || 'unknown'}/${item.subtask_id}`);
    }
  };

  const tabs = [
    { id: 'tasks', label: `Tasks (${taskStats.tasks.total})`, icon: '📋' },
    { id: 'subtasks', label: `Subtasks (${taskStats.subtasks.total})`, icon: '📌' },
  ];

  if (isLoading || userLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 bg-white rounded-lg shadow-md border border-gray-200">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  

  const renderTable = () => (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="">
              <TableHead
                className="font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-3 text-xs sm:text-sm"
                onClick={() => handleSort('title')}
              >
                Title
                {sortField === 'title' && (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
              </TableHead>
              <TableHead
                className="font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-3 text-xs sm:text-sm"
                onClick={() => handleSort('projectName')}
              >
                Project
                {sortField === 'projectName' && (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
              </TableHead>
              <TableHead
                className="font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-3 text-xs sm:text-sm"
                onClick={() => handleSort('status')}
              >
                Status
                {sortField === 'status' && (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
              </TableHead>
              <TableHead
                className="font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-3 text-xs sm:text-sm"
                onClick={() => handleSort('deadline')}
              >
                Deadline
                {sortField === 'deadline' && (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
              </TableHead>
              <TableHead
                className="font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-3 text-xs sm:text-sm"
                onClick={() => handleSort('priority')}
              >
                Priority
                {sortField === 'priority' && (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
              </TableHead>
              <TableHead className="font-medium text-gray-700 p-3 text-right text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="text-gray-900 p-3 text-xs sm:text-sm">
                  <div className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none" title={item.title}>
                    {item.title}
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 p-3 text-xs sm:text-sm">
                  {item.projectName}
                </TableCell>
                <TableCell className="p-3">
                  <Badge className={`${statusColors[item.status || 'Planned']} text-xs font-medium border px-2 py-1`}>
                    {statusIcons[item.status || 'Planned'] || <FiClock className="inline-block mr-1" />}
                    {item.status || 'Planned'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900 p-3 text-xs sm:text-sm">
                  {formatDateUTC(item.deadline) || 'No Deadline'}
                </TableCell>
                <TableCell className="p-3">
                  <Badge className={`${priorityColors[item.priority || 'Medium']} text-xs font-medium border px-2 py-1`}>
                    {item.priority || 'Medium'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right p-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleView(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view {activeTab === 'subtasks' ? 'subtask' : 'task'} details</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 pb-4">
          <div className="text-xs sm:text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, items.length)} of {items.length} items
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-700">Items per page:</Label>
              <Select value={tasksPerPage.toString()} onValueChange={(value) => setTasksPerPage(Number(value))}>
                <SelectTrigger className="w-16 h-8 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-3 text-xs sm:text-sm"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0 text-xs sm:text-sm"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-xs sm:text-sm"
              >
                Next
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-700">Go to page:</Label>
              <Input
                type="number"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="w-16 h-8 text-xs sm:text-sm"
                min="1"
                max={totalPages}
              />
              <Button size="sm" onClick={handleGoToPage} className="h-8 px-3 text-xs sm:text-sm">
                Go
              </Button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              My Tasks
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, project, or ID..."
                  className="pl-10 pr-10 h-9 text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-9 text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <FiFilter />
                    <span className="hidden sm:inline">Filters</span>
                    <FiChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 sm:w-72 text-xs sm:text-sm">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Status</span>
                      <Badge variant="secondary">{stats.total}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Planned')}>
                    <div className="flex justify-between w-full">
                      <span>Planned</span>
                      <Badge className="bg-green-100 text-green-800">{stats.planned}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('In Progress')}>
                    <div className="flex justify-between w-full">
                      <span>In Progress</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.inProgress}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Completed')}>
                    <div className="flex justify-between w-full">
                      <span>Completed</span>
                      <Badge className="bg-gray-100 text-gray-800">{stats.completed}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Priority</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Priorities</span>
                      <Badge variant="secondary">{stats.total}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('High')}>
                    <div className="flex justify-between w-full">
                      <span>High</span>
                      <Badge className="bg-red-100 text-red-800">{stats.highPriority}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('Medium')}>
                    <div className="flex justify-between w-full">
                      <span>Medium</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.mediumPriority}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('Low')}>
                    <div className="flex justify-between w-full">
                      <span>Low</span>
                      <Badge className="bg-green-100 text-green-800">{stats.lowPriority}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="text-center font-medium text-red-600">
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="p-1  rounded-full flex flex-wrap justify-center sm:justify-start gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="text-base">{tab.icon}</span>
                <span className="inline">{tab.label}</span>
                {/* <span className="hidden sm:inline">{tab.label}</span> */}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="tasks" className="min-h-[calc(100vh-200px)]">
            {sortedTasks.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-center p-8">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                  <p className="text-gray-500 max-w-md text-sm">
                    {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
                      ? 'No tasks assigned.'
                      : 'No tasks match your filters. Try adjusting your search or filter criteria.'}
                  </p>
                </div>
              </div>
            ) : (
              renderTable()
            )}
          </TabsContent>
          <TabsContent value="subtasks" className="min-h-[calc(100vh-200px)]">
            {sortedSubTasks.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-center p-8">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subtasks Found</h3>
                  <p className="text-gray-500 max-w-md text-sm">
                    {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
                      ? 'No subtasks assigned.'
                      : 'No subtasks match your filters. Try adjusting your search or filter criteria.'}
                  </p>
                </div>
              </div>
            ) : (
              renderTable()
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AllTasksList;






