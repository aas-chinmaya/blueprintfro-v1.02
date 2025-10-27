




'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectsByEmployeeId,
  fetchAllProjects,
  deleteProject,
} from '@/features/projectSlice';
import { useRouter } from 'next/navigation';
import {
  FiPaperclip,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiX,
  FiTrash2,
  FiCalendar,
  FiTarget,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';


const statusConfig = {
  Planned: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <FiClock className="w-4 h-4" />,
    progressColor: 'bg-amber-500',
    progressValue: 10,
  },
  'In Progress': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <FiAlertCircle className="w-4 h-4" />,
    progressColor: 'bg-blue-500',
    progressValue: 50,
  },
  Completed: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: <FiCheckCircle className="w-4 h-4" />,
    progressColor: 'bg-emerald-500',
    progressValue: 100,
  },
};

export default function ProjectList({
  mode = 'all',
  employeeId,
  canCreate = false,
  canDelete = false,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    employeeProjects = [],
    projects = [],
    status = {},
  } = useSelector((state) => state.project || {});

  const loadingKey = mode === 'my' ? 'fetchEmployeeProjects' : 'fetchAllProjects';
  const isLoading = status[loadingKey] === 'loading';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('projectName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8; // Configurable number of projects per page

  useEffect(() => {
    if (mode === 'my' && employeeId) {
      dispatch(fetchProjectsByEmployeeId(employeeId));
    } else if (mode === 'all') {
      dispatch(fetchAllProjects());
    }
  }, [dispatch, mode, employeeId]);

  const rawProjects = mode === 'my' ? employeeProjects : projects;

  const projectStats = Array.isArray(rawProjects)
    ? {
        total: rawProjects.length,
        planned: rawProjects.filter((p) => p.status === 'Planned').length,
        inProgress: rawProjects.filter((p) => p.status === 'In Progress').length,
        completed: rawProjects.filter((p) => p.status === 'Completed').length,
      }
    : { total: 0, planned: 0, inProgress: 0, completed: 0 };

  const getFilteredSorted = () => {
    if (!Array.isArray(rawProjects)) return [];

    let list = [...rawProjects];

    if (selectedStatus !== 'all') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.projectName?.toLowerCase().includes(term) ||
          p.teamLeadName?.toLowerCase().includes(term) ||
          String(p.projectId).includes(term)
      );
    }

    list.sort((a, b) => {
      const A = (a[sortField] ?? '').toString().toLowerCase();
      const B = (b[sortField] ?? '').toString().toLowerCase();
      const order = sortDirection === 'asc' ? 1 : -1;
      return A.localeCompare(B) * order;
    });

    return list;
  };

  const projectsToShow = getFilteredSorted();

  // Pagination logic
  const totalPages = Math.ceil(projectsToShow.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = projectsToShow.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (id) => router.push(`/project-management/${id}`);
  const handleCreate = () => router.push('/project-management/onboarding');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status) => setSelectedStatus(status);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSortField('projectName');
    setSortDirection('asc');
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const openDeleteDialog = (id) => {
    setDeleteProjectId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteProjectId) {
      // await dispatch(deleteProject(deleteProjectId)); // Fixed: Use deleteProjectId
      try {
    await dispatch(deleteProject(deleteProjectId)).unwrap(); // unwrap to catch errors
    toast.success("Project deleted successfully!");
  } catch (error) {
    toast.error(error?.message || "Failed to delete project.");
  }
      if (mode === 'all') dispatch(fetchAllProjects());
      setIsDeleteModalOpen(false);
      setDeleteProjectId(null);
      // Adjust current page if necessary
      if (paginatedProjects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Inline Skeleton Components
  const HeaderSkeleton = () => (
    <div className="bg-card rounded-xl border p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Skeleton className="h-11 w-full sm:w-72 rounded-lg" />
          <Skeleton className="h-11 w-full sm:w-44 rounded-lg" />
          {canCreate && <Skeleton className="h-11 w-32 rounded-lg" />}
        </div>
      </div>
    </div>
  );

  const ProjectCardSkeleton = () => (
    <Card className="overflow-hidden border rounded-xl shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-4/5 rounded" />
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>
        <div className="pt-2">
          <Skeleton className="h-2 w-full rounded-full mb-2" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-muted/50">
        <Skeleton className="h-5 w-full rounded" />
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <HeaderSkeleton />
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="py-6 px-4 md:px-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
          {/* Left: Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">
              {mode === 'my' ? 'My Projects' : 'All Projects'}
            </h1>
          </div>

          {/* Right: Search + Filters + New Project */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, or lead..."
                className="pl-10 w-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <FiX className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 justify-between w-full sm:w-auto">
                  <FiFilter className="h-4 w-4" />
                  Filters
                  <FiChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                {['all', 'Planned', 'In Progress', 'Completed'].map((st) => (
                  <DropdownMenuItem key={st} onClick={() => handleStatusFilter(st)}>
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        {st !== 'all' && statusConfig[st].icon}
                        {st === 'all' ? 'All Status' : st}
                      </span>
                      <Badge variant="secondary">
                        {st === 'all'
                          ? projectStats.total
                          : projectStats[st.toLowerCase().replace(' ', '')]}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                {['projectName', 'projectId', 'status'].map((field) => (
                  <DropdownMenuItem key={field} onClick={() => handleSort(field)}>
                    <span className="flex items-center justify-between w-full">
                      {field === 'projectName'
                        ? 'Name'
                        : field === 'projectId'
                        ? 'ID'
                        : 'Status'}
                      {sortField === field &&
                        (sortDirection === 'asc' ? (
                          <FiArrowUp className="h-4 w-4" />
                        ) : (
                          <FiArrowDown className="h-4 w-4" />
                        ))}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* New Project Button */}
            {canCreate && (
              <Button className="gap-2 w-full sm:w-auto justify-center" onClick={handleCreate}>
                <FiPlus className="h-4 w-4" />
                New Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              The project and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Projects Grid */}
      {projectsToShow.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <FiPaperclip className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating your first project.'}
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProjects.map((project) => {
              const config = statusConfig[project.status] || {};
              return (
                <Card
                  key={project.projectId}
                  className="overflow-hidden border rounded-xl shadow-sm hover:shadow transition-shadow cursor-pointer group"
                  onClick={() => handleView(project.projectId)}
                >
                  <CardHeader className="pb-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={config.badge}>
                        {config.icon}
                        <span className="ml-1">{project.status}</span>
                      </Badge>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(project.projectId);
                          }}
                        >
                          <FiTrash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {project.projectName || 'Untitled Project'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">ID: {project.projectId}</p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10">
                            <Briefcase className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{project.teamLeadName || 'Unassigned'}</p>
                          <p className="text-muted-foreground">Team Lead</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                          <FiCalendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{project?.startDate}</p>
                          <p className="text-muted-foreground">Start Date</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                          <FiTarget className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{project?.expectedEndDate}</p>
                          <p className="text-muted-foreground">Expected End Date</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-muted/50">
                    <Button variant="ghost" className="w-full text-primary font-medium">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {projectsToShow.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </Button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <FiChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}