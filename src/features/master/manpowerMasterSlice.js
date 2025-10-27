



// features/master/manpowerMasterSlice.js (updated schema enum for levels to include "Intern")
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {axiosInstance} from '@/lib/axios';

const API_URL = '/manpower';

export const fetchManpowers = createAsyncThunk('manpowers/fetchManpowers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getallmanpower`);
    
    return response.data.data;
    
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addManpower = createAsyncThunk('manpowers/addManpower', async (manpowerData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/createmanpower`, manpowerData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getManpowerById = createAsyncThunk('manpowers/getManpowerById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getmanpowerbyid/${id}`);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateManpower = createAsyncThunk('manpowers/updateManpower', async ({ id, ...manpowerData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/updatemanpower/${id}`, manpowerData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteManpower = createAsyncThunk('manpowers/deleteManpower', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`${API_URL}/deletemanpower/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  manpowers: [],
  status: 'idle',
  error: null,
};

const manpowerMasterSlice = createSlice({
  name: 'manpowers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManpowers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchManpowers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.manpowers = action.payload;
      })
      .addCase(fetchManpowers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addManpower.fulfilled, (state, action) => {
        state.manpowers.push(action.payload);
      })
      .addCase(addManpower.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(getManpowerById.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateManpower.fulfilled, (state, action) => {
        const index = state.manpowers.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.manpowers[index] = action.payload;
        }
      })
      .addCase(updateManpower.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteManpower.fulfilled, (state, action) => {
        state.manpowers = state.manpowers.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteManpower.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = manpowerMasterSlice.actions;
export default manpowerMasterSlice.reducer;



