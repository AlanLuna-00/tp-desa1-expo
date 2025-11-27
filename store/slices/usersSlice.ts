import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { api } from "../api";

const LOCAL_USERS_KEY = "@local_users";

export interface User {
  id: number;
  email?: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  imageUrl?: string;
  job?: string;
  name?: string;
}

interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

interface CreateUserResponse {
  id: string;
  name: string;
  job: string;
  createdAt: string;
}

export enum Status {
  Idle = "idle",
  Loading = "loading",
  Succeeded = "succeeded",
  Failed = "failed",
}

interface UsersState {
  items: User[];
  localUsers: User[];
  fetchStatus: Status;
  createStatus: Status;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: UsersState = {
  items: [],
  localUsers: [],
  fetchStatus: Status.Idle,
  createStatus: Status.Idle,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number = 1) => {
    try {
      const response = await api.get<UsersResponse>(`/users?page=${page}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.message || "Error al cargar usuarios");
      }
      throw new Error("Error al cargar usuarios");
    }
  }
);

export const loadLocalUsers = createAsyncThunk(
  "users/loadLocalUsers",
  async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_USERS_KEY);
      if (stored) {
        return JSON.parse(stored) as User[];
      }
      return [];
    } catch (error) {
      console.error("Error loading local users:", error);
      return [];
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: {
    name: string;
    job: string;
    email?: string;
    imageUrl?: string;
  }) => {
    try {
      const response = await api.post<CreateUserResponse>("/users", {
        name: userData.name,
        job: userData.job,
      });
      const data = response.data;
      const newUser: User = {
        id: parseInt(data.id) || Date.now(),
        name: data.name,
        job: data.job,
        email: userData.email,
        first_name: data.name.split(" ")[0] || data.name,
        last_name: data.name.split(" ").slice(1).join(" ") || "",
        avatar: userData.imageUrl,
        imageUrl: userData.imageUrl,
      };

      // Guardar en AsyncStorage
      try {
        const stored = await AsyncStorage.getItem(LOCAL_USERS_KEY);
        const localUsers: User[] = stored ? JSON.parse(stored) : [];
        localUsers.push(newUser);
        await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
      } catch (storageError) {
        console.error("Error saving to AsyncStorage:", storageError);
      }

      return newUser;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.message || "Error al crear usuario");
      }
      throw new Error("Error al crear usuario");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = Status.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadLocalUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.localUsers = action.payload;
        }
      )
      .addCase(fetchUsers.pending, (state) => {
        state.fetchStatus = Status.Loading;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UsersResponse>) => {
          state.fetchStatus = Status.Succeeded;
          state.items = action.payload.data;
          state.currentPage = action.payload.page;
          state.totalPages = action.payload.total_pages;
          state.error = null;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchStatus = Status.Failed;
        state.error = action.error.message || "Error al cargar usuarios";
      })
      .addCase(createUser.pending, (state) => {
        state.createStatus = Status.Loading;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.createStatus = Status.Succeeded;
        state.localUsers = [action.payload, ...state.localUsers];
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = Status.Failed;
        state.error = action.error.message || "Error al crear usuario";
      });
  },
});

export const { clearError, clearCreateStatus } = usersSlice.actions;
export default usersSlice.reducer;
