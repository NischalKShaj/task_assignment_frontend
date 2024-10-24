// <=========================== file to create all the types for the application ================>

// interface for the api error
export interface ApiError {
  message: string;
}

// interface for the signup FormData
export interface FormData {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
}

// interface for the signup response
export interface SignupResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// interface for the login FormData
export interface LoginFormData {
  email?: string;
  password?: string;
}

// interface fro the login response
export interface LoginResponse {
  message: string;
  token: string;
  data: {
    _id: string;
    username: string;
    email: string;
    role: string;
    profile: string;
  };
}

// interface for the global state management
export interface UserState {
  isAuthorized: boolean;
  user: {
    username: string;
    email: string;
    role: string;
    _id: string;
    profile: string;
  } | null;
  isLoggedIn: (user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    profile: string;
  }) => void;
  isLoggedOut: () => void;
}

// interface setting the date for the task manager
export interface SelectDate {
  date: Date | null;
  changeDate: (date: Date | null) => void;
}

export interface SelectedTask {
  managerName: string;
  employeeName: string;
  _doc: {
    _id: string;
    title: string;
    description: string;
    createdAt: Date | string;
    dueDate: Date | string;
    createdBy: string;
    assignedTo: string;
    status: string;
  };
}

export interface IndividualTask {
  title: string;
  description: string;
  employee: string;
  createdAt: string;
  dueDate: string | undefined;
  createdBy: string | undefined;
}

export interface TaskDoc {
  _id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  dueDate: string | Date;
  createdBy: string;
  assignedTo: string;
  status: string;
}
