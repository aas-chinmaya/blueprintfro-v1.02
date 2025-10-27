import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/shared/authSlice';
import notificationReducer from '@/features/shared/notificationSlice';
import userReducer from '@/features/shared/userSlice';
import sidebarReducer from '@/features/shared/sidebarSlice';


import teamMembersReducer from '@/features/teamMembersSlice';
import viewTeamByProjectIdReducer from '@/features/viewTeamByProjectIdSlice';
//dashbaord & reports
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import dashReducer from '@/features/dashboard/dashSlice';


import projectReducer from '@/features/projectSlice';
import teamReducer from '@/features/teamSlice';
import taskReducer from '@/features/taskSlice';
import subTaskReducer from '@/features/subTaskSlice';

import bugReducer from '@/features/bugSlice';
import documentReducer from '@/features/documentSlice';

// module reducer
import contactReducer from '@/features/contactSlice';
import meetingReducer from '@/features/meetingSlice';
import teammeetingMomReducer from '@/features/calender/teammeetingMomSlice';
import meetingCalendarReducer from '@/features/calender/meetingCalendarSlice';
import teamMeetingsReducer from '@/features/calender/teammeetingCalenderSlice';
import momReducer from '@/features/momSlice';
import quotationReducer from '@/features/quotationSlice';
import clientReducer from '@/features/clientSlice';
import paymentReducer from '@/features/meeting/paymentSlice'
import causeReducer from '@/features/causeSlice';
import projectAnalyticsReducer from "@/features/projectAnalyticsSlice";
import timesheetReducer from "@/features/timesheet/timesheetSlice";


//master table
import slotReducer from '@/features/master/slotMasterSlice';
import serviceReducer from '@/features/master/serviceMasterSlice';
import industriesReducer from '@/features/master/industriesMasterSlice';
import manpowerMasterReducer from '@/features/master/manpowerMasterSlice';

import budgetReducer from '@/features/budget/budgetSlice'; // Import the budget request reducer
import budgetRequestReducer from '@/features/budget/budgetRequestSlice'; // Import the budget request reducer
import budgetCategoryReducer from '@/features/budget/budgetCategorySlice'; // Import the budget request reducer
import budgetEntityReducer from '@/features/budget/budgetEntitySlice'; // Import the budget request reducer



//meetings

import projectTeamMeetingReducer from "@/features/projectteammeetingSlice"
import projectMeetingsReducer from "@/features/projetMeetingSlice"


import projectMeetReducer from "@/features/projectmeetSlice"
import profileReducer from "@/features/shared/profileSlice"


import projectMeetingMomReducer from '@/features/projectmeetingmomSlice'; // Adjust path as needed
import projectShowCauseReducer from '@/features/projectShowCauseSlice';
const initialState = {
  initialized: false,
  loading: false,
  error: null
};

export const store = configureStore({
  reducer: {
    app: (state = initialState, action) => {
      switch (action.type) {
        case 'app/initialize':
          return { ...state, initialized: true };
        case 'app/setLoading':
          return { ...state, loading: action.payload };
        case 'app/setError':
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    sidebar:sidebarReducer,
  //shared reducers
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,
  timesheet: timesheetReducer,

    //dashboard
  dash: dashReducer,
  dashboard:dashboardReducer,
  projectAnalytics: projectAnalyticsReducer,

  // module reducer
 contact: contactReducer,
  meetings: meetingReducer,
  meetingCalendar: meetingCalendarReducer,
  mom: momReducer,
  quotation : quotationReducer,
  client:clientReducer,
  project:projectReducer,
  task:taskReducer,
  subTask:subTaskReducer,
  team: teamReducer,
  bugs: bugReducer,
  cause: causeReducer,
  budgetRequest: budgetRequestReducer,
  budget: budgetReducer,
  budgetCategory: budgetCategoryReducer,
budgetEntity: budgetEntityReducer,
  payment: paymentReducer,
  documents: documentReducer,
  profile: profileReducer,

  //master
  slots: slotReducer,
  services: serviceReducer,
  industries:industriesReducer,
manpowers:manpowerMasterReducer,

  teamMeetings:teamMeetingsReducer,
teammeetingMom:teammeetingMomReducer,
    teamMembers: teamMembersReducer,
  projectTeam: viewTeamByProjectIdReducer,

  projectTeamMeeting: projectTeamMeetingReducer,
  projectMeetings:projectMeetingsReducer,




  //project meeting
  projectMeet:projectMeetReducer,
     projectMeetingMom: projectMeetingMomReducer,
  

     //
     projectShowCause: projectShowCauseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

// Initialize store
store.dispatch({ type: 'app/initialize' });

export default store;