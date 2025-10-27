

"use client";

import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  Inbox,
} from "lucide-react";

// Icon map
export const iconMap = {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  Inbox,
};

// Role groups
export const roleGroups = {
  cpcGroup: ["cpc", "Team Lead"],       // Team Lead mirrors cpc
  employeeGroup: ["employee(regular)"], // regular employee
};

// Full navigation
export const fullNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["cpcGroup", "employeeGroup"],
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: "Inbox",
    roles: ["cpcGroup", "employeeGroup"],
  },
  {
    title: "TimeSheet",
    url: "/time-sheet",
    icon: "Inbox",
    roles: ["cpcGroup", "employeeGroup"],
  },

  {
   title: "Project Management",
   url: "#",
   icon: "CalendarDays",
   roles: ["cpcGroup","employeeGroup"],
   items: [
     { title: "All Project", url: "/project-management", roles: ["cpcGroup","employeeGroup"] },
     { title: "Active Team", url: "/team", roles: ["cpcGroup","employeeGroup"] },
     { title: "All Task", url: "/task", roles: ["cpcGroup","employeeGroup"] },
     { title: "All Bug", url: "/bug", roles: ["cpcGroup"] },
     { title: "Assinged Bug", url: "/bug/assigned-bugs", roles: ["employeeGroup"] },
   ],
 },
   {
    title: "Contact",
    url: "/contact",
    icon: "PhoneCall",
    roles: ["cpcGroup"],
  },
   {
    title: "Client",
    url: "/client",
    icon: "User",
    roles: ["cpcGroup"],
  },
 

  {
    title: "Quotation",
    url: "/quotation",
    icon: "FileText",
    roles: ["cpcGroup"],
  },
  {
    title: "Meeting",
    url: "#",
    icon: "CalendarDays",
    roles: ["cpcGroup"],
    items: [
      { title: "Client Meeting", url: "/meetings/all", roles: ["cpcGroup"] },
      { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpcGroup"] },
      { title: "MOM Dashboard", url: "/meetings/mom", roles: ["cpcGroup"] },
      
    ],
  },
  

  {
    title: "Budget Management",
    url: "/budget-management/company",
    icon: "FolderClosed",
    roles: ["cpcGroup"],
    
  },
 
  {
    title: "Concerns",
    url: "#",
    icon: "FolderClosed",
    roles: ["cpcGroup"],
    items: [
      { title: "Cause Dashboard", url: "/meetings/cause", roles: ["cpcGroup"] },
    ],
  },
  {
    title: "Master",
    url: "#",
    icon: "FolderClosed",
    roles: ["cpcGroup"],
    items: [
      { title: "Service", url: "/master/services", roles: ["cpcGroup"] },
      { title: "Work Force", url: "/master/work-force-management", roles: ["cpcGroup"] },
      { title: "Industry", url: "/master/industry", roles: ["cpcGroup"] },
      { title: "Meeting Slots", url: "/master/slots", roles: ["cpcGroup"] },
    ],
  },
];









