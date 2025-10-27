




'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Play, StopCircle, Plus, ChevronDown } from 'lucide-react';

const TimesheetUI = () => {
  const [timeEntries, setTimeEntries] = useState([
    { timerId: 'T001', type: 'project', projectId: '66f8a1b2c3d4e5f678901234', title: 'Getting started with Everhour', category: 'task', startTime: new Date('2025-10-22T09:00:00'), endTime: new Date('2025-10-22T17:05:00'), durationHours: 8.0833 },
    { timerId: 'T002', type: 'project', projectId: '66f8a1b2c3d4e5f678901234', title: 'Getting started with Everhour', category: 'task', startTime: new Date('2025-10-23T14:00:00'), endTime: new Date('2025-10-23T14:04:00'), durationHours: 0.0667 },
    { timerId: 'T003', type: 'project', projectId: '66f8a1b2c3d4e5f678901234', title: 'Getting started with Everhour', category: 'task', startTime: new Date('2025-10-24T10:00:00'), endTime: new Date('2025-10-24T10:01:00'), durationHours: 0.0167 },
    { timerId: 'T004', type: 'non-project', projectId: null, title: 'Fly', category: 'others', startTime: new Date('2025-10-22T09:00:00'), endTime: new Date('2025-10-22T17:01:00'), durationHours: 8.0167 },
    { timerId: 'T005', type: 'non-project', projectId: null, title: 'Fly', category: 'others', startTime: new Date('2025-10-23T15:00:00'), endTime: new Date('2025-10-23T15:02:00'), durationHours: 0.0333 },
    { timerId: 'T006', type: 'project', projectId: '66f8a2b3c4d5e6f789012345', title: 'Business Development', category: 'task', startTime: new Date('2025-10-22T09:00:00'), endTime: new Date('2025-10-22T17:05:00'), durationHours: 8.0833 },
    { timerId: 'T007', type: 'project', projectId: '66f8a2b3c4d5e6f789012345', title: 'Business Development', category: 'task', startTime: new Date('2025-10-23T14:00:00'), endTime: new Date('2025-10-23T14:02:00'), durationHours: 0.0333 },
  ]);

  const projects = [
    { id: '66f8a1b2c3d4e5f678901234', name: 'Getting started with Everhour' },
    { id: '66f8a2b3c4d5e6f789012345', name: 'Sample Project' },
    { id: '66f8a3b4c5d6e7f890123456', name: 'Sample Project' },
    { id: '66f8a4b5c6d7e8f901234567', name: 'Sample Project' }
  ];

  const [tasks, setTasks] = useState([
    { id: '1', name: 'Getting started with Everhour' },
    { id: '2', name: 'Fly' },
    { id: '3', name: 'Business Development' },
    { id: '4', name: 'Design' },
    { id: '5', name: 'Project Management' },
  ]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState(null);
  const [timerDuration, setTimerDuration] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 23));
  const [numWeeks, setNumWeeks] = useState(4);

  const [currentEntry, setCurrentEntry] = useState({
    timerId: '',
    type: 'project',
    projectId: '',
    title: '',
    category: 'task',
    startTime: new Date(),
    endTime: new Date(),
    durationHours: 0
  });

  // Timer interval
  useEffect(() => {
    let interval;
    if (timerRunning && timerStart) {
      interval = setInterval(() => {
        const durationHours = (Date.now() - timerStart) / (1000 * 60 * 60);
        setTimerDuration(durationHours);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerStart]);

  // Initialize expanded sections
  useEffect(() => {
    setExpandedSections(prev => ({ ...prev, 'week-0': true }));
  }, [selectedDate, numWeeks]);

  // Format functions
  const formatTime = useCallback((hours) => {
    if (hours === 0) return '0:00';
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  }, []);

  const formatWeekTotal = useCallback((hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return `${h}h ${m}m`;
  }, []);

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  // Utility functions
  const getWeekStart = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  }, []);

  const getWeekDays = useCallback((startDate) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }, []);

  // Memoized weeks
  const weeks = useMemo(() => {
    const weeksArray = [];
    let weekStart = getWeekStart(selectedDate);
    for (let i = 0; i < numWeeks; i++) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const title = i === 0 ? 'This Week' :
                    i === 1 ? 'Last Week' :
                    `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      const key = `week-${i}`;
      weeksArray.push({
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
        title,
        key
      });
      weekStart = new Date(weekStart);
      weekStart.setDate(weekStart.getDate() - 7);
    }
    return weeksArray;
  }, [selectedDate, numWeeks, getWeekStart, formatDate]);

  // Timer functions
  const startTimer = useCallback((taskName = '') => {
    const now = Date.now();
    const timerId = `T${now}`;
    setTimerStart(now);
    setTimerRunning(true);
    setTimerDuration(0);
    setCurrentEntry({
      timerId,
      type: 'project',
      projectId: projects[0].id,
      title: taskName,
      category: 'task',
      startTime: new Date(now),
      endTime: new Date(now),
      durationHours: 0
    });
  }, [projects]);

  const stopTimer = useCallback(() => {
    if (!timerRunning || !currentEntry.startTime) return;
    
    const endTime = new Date();
    const durationHours = (endTime - currentEntry.startTime) / (1000 * 60 * 60);
    const newEntry = {
      ...currentEntry,
      endTime,
      durationHours
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
    
    if (newEntry.title && !tasks.some(t => t.name === newEntry.title)) {
      setTasks(prev => [...prev, { id: (prev.length + 1).toString(), name: newEntry.title }]);
    }
    
    setTimerRunning(false);
    setTimerStart(null);
    setTimerDuration(0);
  }, [timerRunning, currentEntry, tasks]);

  // Data functions
  const getTasksForSelectedDate = useCallback(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return [...new Set(
      timeEntries
        .filter(e => new Date(e.startTime).toISOString().split('T')[0] === dateStr)
        .map(e => e.title)
    )];
  }, [timeEntries, selectedDate]);

  const getDurationForTaskDay = useCallback((taskName, date) => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const entries = timeEntries.filter(e => 
      e.title === taskName && 
      new Date(e.startTime).toISOString().split('T')[0] === dateStr
    );
    return entries.reduce((sum, e) => sum + e.durationHours, 0);
  }, [timeEntries]);

  const getWeekTotal = useCallback((week) => {
    const weekEntries = timeEntries.filter(e => {
      const entryDate = new Date(e.startTime).toISOString().split('T')[0];
      return entryDate >= week.start && entryDate <= week.end;
    });
    return weekEntries.reduce((sum, e) => sum + e.durationHours, 0);
  }, [timeEntries]);

  // Modal functions
  const openAddModal = useCallback(() => {
    const start = new Date(selectedDate);
    start.setHours(10, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(19, 0, 0, 0);
    
    setCurrentEntry({
      timerId: `T${Date.now()}`,
      type: 'project',
      projectId: projects[0].id,
      title: '',
      category: 'task',
      startTime: start,
      endTime: end,
      durationHours: 9
    });
    setModalOpen(true);
  }, [selectedDate, projects]);

  const updateCurrentEntry = useCallback((updates) => {
    setCurrentEntry(prev => ({ ...prev, ...updates }));
  }, []);

  const handleTimeChange = useCallback((isStart, timeValue) => {
    const [h, m] = timeValue.split(':');
    const time = new Date(selectedDate);
    time.setHours(parseInt(h), parseInt(m), 0, 0);
    
    if (isStart) {
      updateCurrentEntry({ startTime: time });
    } else {
      updateCurrentEntry({ endTime: time });
    }
  }, [selectedDate, updateCurrentEntry]);

  const calculateDuration = useCallback((start, end) => {
    return (end - start) / (1000 * 60 * 60);
  }, []);

  const addEntry = useCallback(() => {
    const durationHours = calculateDuration(currentEntry.startTime, currentEntry.endTime);
    const newEntry = { 
      ...currentEntry, 
      durationHours: durationHours > 0 ? durationHours : 0 
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
    
    if (newEntry.title && !tasks.some(t => t.name === newEntry.title)) {
      setTasks(prev => [...prev, { id: (prev.length + 1).toString(), name: newEntry.title }]);
    }
    
    setModalOpen(false);
  }, [currentEntry, tasks, calculateDuration]);

  // Time Entry Dialog Component
  const TimeEntryDialog = useMemo(() => {
    const startTimeStr = currentEntry.startTime.toTimeString().slice(0, 5);
    const endTimeStr = currentEntry.endTime.toTimeString().slice(0, 5);
    const duration = calculateDuration(currentEntry.startTime, currentEntry.endTime);

    return (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input 
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup 
                className="flex flex-row gap-4" 
                value={currentEntry.type} 
                onValueChange={(value) => updateCurrentEntry({ 
                  type: value, 
                  projectId: value === 'project' ? projects[0].id : null 
                })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-project" id="non-project" />
                  <Label htmlFor="non-project">Non-project</Label>
                </div>
              </RadioGroup>
            </div>

            {currentEntry.type === 'project' && (
              <div className="space-y-2">
                <Label>Project</Label>
                <Select 
                  value={currentEntry.projectId} 
                  onValueChange={(value) => updateCurrentEntry({ projectId: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={currentEntry.title} 
                onChange={(e) => updateCurrentEntry({ title: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup 
                className="flex flex-row gap-4" 
                value={currentEntry.category} 
                onValueChange={(value) => updateCurrentEntry({ category: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="task" id="task" />
                  <Label htmlFor="task">Task</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="meeting" id="meeting" />
                  <Label htmlFor="meeting">Meeting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="others" id="others" />
                  <Label htmlFor="others">Others</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={startTimeStr}
                  onChange={(e) => handleTimeChange(true, e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={endTimeStr}
                  onChange={(e) => handleTimeChange(false, e.target.value)}
                />
              </div>
            </div>

            <div className="text-right">
              <Badge variant="secondary">Duration: {formatTime(duration)}</Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={addEntry}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [
    modalOpen, currentEntry, selectedDate, projects, 
    updateCurrentEntry, handleTimeChange, addEntry, 
    calculateDuration, formatTime, tasks
  ]);

  // WeekTimesheet Component
  const WeekTimesheet = useCallback(({ week }) => {
    const weekDays = getWeekDays(week.start);
    const currentDayIndex = weekDays.indexOf(selectedDate.toISOString().split('T')[0]);
    const weekTotal = getWeekTotal(week);
    const tasksForDay = getTasksForSelectedDate();
    
    if (tasksForDay.length === 0) {
      return (
        <Card className="mb-4">
          <CardHeader className="p-4">
            <span className="text-sm font-medium">{week.title} ... {formatWeekTotal(weekTotal)}</span>
          </CardHeader>
        </Card>
      );
    }

    const groupedTasks = tasksForDay.map((name, index) => ({ 
      type: 'task', 
      id: `temp-${index}`, 
      name, 
      indented: false 
    }));

    return (
      <Card className="mb-4">
        <CardHeader 
          className="p-4 cursor-pointer hover:bg-muted/50 flex flex-row items-center justify-between"
          onClick={() => setExpandedSections(prev => ({ ...prev, [week.key]: !prev[week.key] }))}
        >
          <div className="flex items-center gap-2">
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections[week.key] ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{week.title} ... {formatWeekTotal(weekTotal)}</span>
          </div>
        </CardHeader>
        
        {expandedSections[week.key] && (
          <CardContent className="p-0">
            <ScrollArea className="w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px] text-left sticky left-0 bg-white z-10">Tasks</TableHead>
                    {weekDays.map((day, index) => {
                      const isSunday = new Date(day).getDay() === 0;
                      return (
                        <TableHead 
                          key={day} 
                          className={`text-center min-w-[100px] ${
                            index === currentDayIndex ? 'bg-green-50 font-semibold border-b-2 border-green-500' : ''
                          } ${isSunday ? 'bg-muted' : ''}`}
                        >
                          {formatDate(day)}
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-center min-w-[100px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedTasks.map((task) => {
                    const taskHoursPerDay = weekDays.map(day => getDurationForTaskDay(task.name, day));
                    const taskTotal = taskHoursPerDay.reduce((a, b) => a + b, 0);
                    
                    return (
                      <TableRow key={task.id} className="hover:bg-muted/50">
                        <TableCell className="pl-4 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            {task.name}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => startTimer(task.name)} 
                              disabled={timerRunning}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        {taskHoursPerDay.map((hours, i) => {
                          const isSunday = new Date(weekDays[i]).getDay() === 0;
                          if (isSunday) {
                            return <TableCell key={weekDays[i]} className="text-center bg-muted">-</TableCell>;
                          }
                          return (
                            <TableCell
                              key={weekDays[i]}
                              className={`text-center p-2 ${
                                i === currentDayIndex ? 'bg-green-50' : ''
                              } ${hours > 0 ? 'bg-yellow-50' : ''}`}
                            >
                              <Badge variant={hours > 0 ? "default" : "secondary"} className="text-xs">
                                {formatTime(hours)}
                              </Badge>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-semibold">
                          {formatTime(taskTotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    );
  }, [
    getWeekDays, selectedDate, getWeekTotal, getTasksForSelectedDate, 
    formatWeekTotal, expandedSections, getDurationForTaskDay, 
    formatDate, startTimer, timerRunning, formatTime
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Timesheet</h1>
          <div className="flex items-center gap-4">
            {timerRunning ? (
              <div className="flex items-center gap-2 bg-destructive/10 p-2 rounded-md border">
                <Badge variant="destructive">{formatTime(timerDuration)}</Badge>
                <Button size="sm" variant="destructive" onClick={stopTimer}>
                  <StopCircle className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => startTimer()} className="gap-2">
                <Play className="w-4 h-4" />
                Start Timer
              </Button>
            )}
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {weeks.map(week => (
            <WeekTimesheet key={week.key} week={week} />
          ))}
        </div>

        <Button 
          onClick={() => setNumWeeks(prev => prev + 4)} 
          className="w-full mt-4"
          variant="outline"
        >
          Load More
        </Button>
      </div>

      {TimeEntryDialog}
    </div>
  );
};

export default TimesheetUI;





















