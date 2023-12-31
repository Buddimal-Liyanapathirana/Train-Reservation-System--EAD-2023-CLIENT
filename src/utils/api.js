export const Auth = {
  login: "/api/User/login",
};
export const ImageAPI = {
  uplaod: "/api/images",
};
export const AutherizationAPI = {
  info: "/api/Atherization/info",
  reset_password: "/api/Atherization/reset_password",
};

export const UserManagementAPI = {
  getAllUsers: "/api/User",
  user_create: "/api/User/create_user",
  activate_user: "/api/User/activate",
  user_update: "/api/User/update_user",
  user_activate_request: "/api/User/request_active_account",
};

export const TrainRoutesManagementAPI = {
  getAll: "/api/TrainRoutes",
  getAllActiveRoutes: "/api/TrainRoutes/getActiveRoutes",
  create: "/api/TrainRoutes",
  delete: "/api/TrainRoutes/deleteRoute",
  disable: "/api/TrainRoutes/disableRoute",
  enable: "/api/TrainRoutes/enableRoute",
  update: "/api/TrainRoutes/updateRoute",
};

export const Trains = {
  getAll: "/api/Train",
  create: "/api/Train",
  update: "/api/Train",
  delete : "api/Train",
  deactivate: "/api/Train/deactivate",
  addSchedule: "api/Train/add-schedule",
};

export const Schedules = {
  getAll: "api/Schedule",
  getOne: "api/Schedule",
  create: "/api/Schedule",
  update: "/api/Schedule",
  delete: "/api/Schedule",
};

export const Reservations = {
  getAll: "api/Reservation",
  create: "/api/Reservation",
  update: "/api/Reservation",
  delete: "/api/Reservation",
  complete: "/api/Reservation/complete",
};

export const Users = {
  getAll: "api/User",
  getOne: "api/User",
  create: "/api/User",
  update: "/api/User",
  delete: "/api/User",
  deactivate: "/api/User/deactivate",
  activate: "/api/User/activate",
};

export const Routes = {
  getAll: "api/Route",
  getOne: "api/Route",
  create: "/api/Route",
  update: "/api/Route",
  delete: "/api/Route",
};