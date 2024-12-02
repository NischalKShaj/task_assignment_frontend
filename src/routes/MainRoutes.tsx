// <========================== file to implement the main routes for the application ================>

// importing the required modules
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";
import Home from "../components/home/Home.";
// import PrivateRoutes from "./PrivateRoutes";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route element={<PrivateRoutes />}> */}
        <Route path="/home" element={<Home />} />
        {/* </Route> */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default MainRoutes;
