import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  OPTIMIZERTABLE,
  ADDOPTIMIZER,
  OPTIMIZERDETAILS,
  EDITOPTIMIZER,
  WEATHER,
  LOCATIONAPIKEY
} from "../../api/api";

export const OptimizerList = createAsyncThunk(

  "OptimizerList",

  async ({ GatewayId, header }, { rejectWithValue }) => {
    try {
      const response = await OPTIMIZERTABLE(GatewayId, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";

      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const OptimizerModel = createAsyncThunk(
  "OptimizerModel",

  async ({ data, header }, { rejectWithValue }) => {
    try {
      const response = await ADDOPTIMIZER(data, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";

      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const OptimizerDetails = createAsyncThunk(
  "OptimizerDetails",

  async ({ optimizerId, header }, { rejectWithValue }) => {
    try {
      const response = await OPTIMIZERDETAILS(optimizerId, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const EditOptimizer = createAsyncThunk(
  "EditOptimizer",

  async ({ OptimizerId, data, header }, { rejectWithValue }) => {
    try {
      const response = await EDITOPTIMIZER(OptimizerId, data, header);
      return response.data;
    } catch (error) {

      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error.response.data);
    }

  }
);

export const AccuWeather = createAsyncThunk(
  "AccuWeather",

  async ({ LocationKey }, { rejectWithValue }) => {
    try {
      const response = await WEATHER(LocationKey);
      console.log({ response });
      return response.data;
    } catch (error) {
      console.log({error});
      return rejectWithValue(error.response.data);
    }

  }
);

export const LocationApiKey = createAsyncThunk(
  "locationkeyapi",
  async ({ coordinate }, { rejectWithValue }) => {
    try {
      const response = await LOCATIONAPIKEY(coordinate);
      // console.log({ response });
      return response.data.Key;
    } catch (error) {
      console.log({ error });
      return rejectWithValue(error.response.data);
    }

  }
);


const initialState = {
  status: "",
  loading: false,

  optimizer_response: "",
  optimizer_error: null,

  add_optimizer_response: "",
  add_optimizer_error: null,

  add_optimizerlist_response: "",
  add_optimizerlist_error: null,

  edit_optimizer_response: "",
  edit_optimizer_error: null,

  weather_response: "",
  weather_error: null,

  location_response: "",
  location_error: null,
};

export const optimizerSlice = createSlice({
  name: "EnterpriseSlice",
  initialState,
  reducers: {
    // Logout reducer
    clear_location_response: (state) => {
      state.location_response = "";
    },
    clear_location_error: (state) => {
      state.location_error = null;
    },
    clear_weather_response: (state) => {
      state.weather_response = "";
    },
    clear_weather_error: (state) => {
      state.weather_error = null;
    },
    clearError: (state) => {
      state.optimizer_error = null;

    },
    clearEditOptimizerResponse: (state) => {
      state.edit_optimizer_response = "";
    },
    clearOptimizerResponse: (state) => {
      state.optimizer_response = "";
    },
    clearAddOptimizerResponse: (state) => {
      state.add_optimizerlist_response = "";
    },
    clearAddOptimizerlistError: (state) => {
      state.add_optimizerlist_error = "";
    },
    clearAdd_optimizer_response: (state) => {
      state.add_optimizer_response = "";
    },
    clearAdd_optimizer_error: (state) => {
      state.add_optimizer_error = "";
    },

  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(OptimizerList.pending, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Loading...";
      optimizer.loading = true;
    });
    builder.addCase(OptimizerList.fulfilled, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Success";
      optimizer.loading = false;
      optimizer.optimizer_response = payload;
      optimizer.optimizer_error = null;
    });
    builder.addCase(OptimizerList.rejected, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Failed";
      optimizer.loading = false;
      optimizer.optimizer_error = payload;
    });

    //   ------------------------------------------------------------------------------------------------

    builder.addCase(OptimizerModel.pending, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Loading...";
      optimizer.loading = true;
    });
    builder.addCase(OptimizerModel.fulfilled, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Success";
      optimizer.loading = false;
      optimizer.add_optimizerlist_response = payload;
      optimizer.add_optimizerlist_error = null;
    });
    builder.addCase(OptimizerModel.rejected, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Failed";
      optimizer.loading = false;
      optimizer.add_optimizerlist_error = payload;
    });

    //------------------------------------------------------------------------------------------

    builder.addCase(EditOptimizer.pending, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Loading...";
      optimizer.loading = true;
    });
    builder.addCase(EditOptimizer.fulfilled, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Success";
      optimizer.loading = false;
      optimizer.edit_optimizer_response = payload;
      optimizer.edit_optimizer_error = null;
    });
    builder.addCase(EditOptimizer.rejected, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Failed";
      optimizer.loading = false;
      optimizer.edit_optimizer_error = payload;
    });

    //-------------------------------------------------------------------------------------------

    builder.addCase(OptimizerDetails.pending, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Loading...";
      optimizer.loading = true;
    });
    builder.addCase(OptimizerDetails.fulfilled, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Success";
      optimizer.loading = false;
      optimizer.add_optimizer_response = payload;
      optimizer.add_optimizer_error = null;
    });
    builder.addCase(OptimizerDetails.rejected, (optimizer, { payload }) => {
      // Add user to the state array
      optimizer.status = "Failed";
      optimizer.loading = false;
      optimizer.add_optimizer_error = payload;
    });

    //-----------------------------------------------------------------------------------

    builder.addCase(AccuWeather.pending, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Loading...";
      weather.loading = true;
    });
    builder.addCase(AccuWeather.fulfilled, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Success";
      weather.loading = false;
      weather.weather_response = payload;
      weather.weather_error = null;
    });
    builder.addCase(AccuWeather.rejected, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Failed";
      weather.loading = false;
      weather.weather_error = payload;
    });

    //-----------------------------------------------------------------------------------

    builder.addCase(LocationApiKey.pending, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Loading...";
      weather.loading = true;
    });
    builder.addCase(LocationApiKey.fulfilled, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Success";
      weather.loading = false;
      weather.location_response = payload;
      weather.location_error = null;
    });
    builder.addCase(LocationApiKey.rejected, (weather, { payload }) => {
      // Add user to the state array
      weather.status = "Failed";
      weather.loading = false;
      weather.location_error = payload;
    });


  },
});

export const { clearAdd_optimizer_response, clearAddOptimizerlistError, clearAdd_optimizer_error, clearError, clearOptimizerResponse, clearEditOptimizerResponse, clearAddOptimizerResponse, clear_weather_error, clear_weather_response } = optimizerSlice.actions;

export default optimizerSlice.reducer;