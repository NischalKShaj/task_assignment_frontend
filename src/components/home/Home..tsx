// <========================= file to create the home page for the user ==============>

// importing the required modules
import { useEffect } from "react";
import ModernCalendar from "../calender/ModernCalendar";
import Task from "../task/Task";
import { AppState } from "../../store/store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = AppState((state) => state.isAuthorized);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white space-y-8 lg:space-y-0 lg:space-x-8 p-8">
      <ModernCalendar />
      <Task />
    </div>
  );
};

export default Home;
