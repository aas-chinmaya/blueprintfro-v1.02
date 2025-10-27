// // features/timesheet/timesheetSlice.js
// "use client";

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@/lib/axios"; // import your custom axios instance

// // 1. Fetch timesheets (by employee, optional date and project)
// export const fetchTimesheets = createAsyncThunk(
//   "timesheet/fetchTimesheets",
//   async ({ employeeId, date, projectId }, { rejectWithValue }) => {
//     try {
//       let query = `?employeeId=${employeeId}`;
//       if (date) query += `&date=${date}`;
//       if (projectId) query += `&projectId=${projectId}`;
//       const response = await axiosInstance.get(`/timesheets${query}`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 2. Fetch timesheet entry by timerId
// export const fetchTimesheetByTimerId = createAsyncThunk(
//   "timesheet/fetchByTimerId",
//   async (timerId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/timesheets/timer/${timerId}`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 3. Create a new timesheet entry
// export const createTimesheetEntry = createAsyncThunk(
//   "timesheet/createEntry",
//   async ({ employeeId, entry }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(`/timesheets/employee/${employeeId}`, entry);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 4. Update a timesheet entry
// export const updateTimesheetEntry = createAsyncThunk(
//   "timesheet/updateEntry",
//   async ({ timerId, updatedEntry }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`/timesheets/timer/${timerId}`, updatedEntry);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 5. Delete a timesheet entry
// export const deleteTimesheetEntry = createAsyncThunk(
//   "timesheet/deleteEntry",
//   async (timerId, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/timesheets/timer/${timerId}`);
//       return timerId;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   timesheets: [],
//   currentTimesheet: null,
//   loading: false,
//   error: null
// };

// // Slice
// const timesheetSlice = createSlice({
//   name: "timesheet",
//   initialState,
//   reducers: {
//     clearTimesheetState: (state) => {
//       state.timesheets = [];
//       state.currentTimesheet = null;
//       state.loading = false;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch timesheets
//       .addCase(fetchTimesheets.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTimesheets.fulfilled, (state, action) => {
//         state.loading = false;
//         state.timesheets = action.payload;
//       })
//       .addCase(fetchTimesheets.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch timesheet by timerId
//       .addCase(fetchTimesheetByTimerId.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTimesheetByTimerId.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentTimesheet = action.payload;
//       })
//       .addCase(fetchTimesheetByTimerId.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Create timesheet entry
//       .addCase(createTimesheetEntry.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createTimesheetEntry.fulfilled, (state, action) => {
//         state.loading = false;
//         state.timesheets.push(action.payload);
//       })
//       .addCase(createTimesheetEntry.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Update timesheet entry
//       .addCase(updateTimesheetEntry.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateTimesheetEntry.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.timesheets.findIndex(ts =>
//           ts.entries.some(e => e.timerId === action.payload.timerId)
//         );
//         if (index !== -1) {
//           const entryIndex = state.timesheets[index].entries.findIndex(
//             e => e.timerId === action.payload.timerId
//           );
//           state.timesheets[index].entries[entryIndex] = action.payload;
//         }
//       })
//       .addCase(updateTimesheetEntry.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Delete timesheet entry
//       .addCase(deleteTimesheetEntry.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteTimesheetEntry.fulfilled, (state, action) => {
//         state.loading = false;
//         state.timesheets = state.timesheets.map(ts => ({
//           ...ts,
//           entries: ts.entries.filter(e => e.timerId !== action.payload)
//         }));
//       })
//       .addCase(deleteTimesheetEntry.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearTimesheetState } = timesheetSlice.actions;
// export default timesheetSlice.reducer;
// features/timesheet/timesheetSlice.js
"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

const API_URL = '/timesheets';

// ==========================
// Async Thunks
// ==========================
export const fetchTimesheets = createAsyncThunk(
  'timesheet/fetchTimesheets',
  async ({ employeeId, date, projectId }, { rejectWithValue }) => {
    try {
      let query = `?employeeId=${employeeId}`;
      if (date) query += `&date=${date}`;
      if (projectId) query += `&projectId=${projectId}`;
      const response = await axiosInstance.get(`${API_URL}${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTimesheetByTimerId = createAsyncThunk(
  'timesheet/fetchTimesheetByTimerId',
  async (timerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/timer/${timerId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTimesheetEntry = createAsyncThunk(
  'timesheet/createTimesheetEntry',
  async ({ employeeId, entry }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/employee/${employeeId}`, entry);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateTimesheetEntry = createAsyncThunk(
  'timesheet/updateTimesheetEntry',
  async ({ timerId, updatedEntry }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/timer/${timerId}`, updatedEntry);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteTimesheetEntry = createAsyncThunk(
  'timesheet/deleteTimesheetEntry',
  async (timerId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL}/timer/${timerId}`);
      return timerId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==========================
// Initial State
// ==========================
const initialState = {
  timesheets: [],             // All timesheets
  selectedTimesheet: null,    // Single timesheet (by timerId)
  status: 'idle',             // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ==========================
// Slice
// ==========================
const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    clearTimesheetError: (state) => { state.error = null; },
    clearSelectedTimesheet: (state) => { state.selectedTimesheet = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTimesheets.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timesheets = action.payload;
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Fetch by timerId
      .addCase(fetchTimesheetByTimerId.pending, (state) => {
        state.status = 'loading';
        state.selectedTimesheet = null;
      })
      .addCase(fetchTimesheetByTimerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTimesheet = action.payload;
      })
      .addCase(fetchTimesheetByTimerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.selectedTimesheet = null;
      })

      // Create
      .addCase(createTimesheetEntry.pending, (state) => { state.status = 'loading'; })
      .addCase(createTimesheetEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timesheets.push(action.payload);
      })
      .addCase(createTimesheetEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Update
      .addCase(updateTimesheetEntry.pending, (state) => { state.status = 'loading'; })
      .addCase(updateTimesheetEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.timesheets.findIndex(ts =>
          ts.entries.some(e => e.timerId === action.payload.timerId)
        );
        if (index !== -1) {
          const entryIndex = state.timesheets[index].entries.findIndex(
            e => e.timerId === action.payload.timerId
          );
          state.timesheets[index].entries[entryIndex] = action.payload;
        }
      })
      .addCase(updateTimesheetEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteTimesheetEntry.pending, (state) => { state.status = 'loading'; })
      .addCase(deleteTimesheetEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timesheets = state.timesheets.map(ts => ({
          ...ts,
          entries: ts.entries.filter(e => e.timerId !== action.payload)
        }));
      })
      .addCase(deleteTimesheetEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearTimesheetError, clearSelectedTimesheet } = timesheetSlice.actions;
export default timesheetSlice.reducer;
