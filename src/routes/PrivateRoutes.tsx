// <============================ creating protected routes =====================>

// importing the required modules
import { Navigate, Outlet } from "react-router-dom";
import { AppState } from "../store/store";

const PrivateRoutes = () => {
  const user = AppState((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
