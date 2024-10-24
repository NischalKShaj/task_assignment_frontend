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
    <div className="bg-custom w-full flex flex-row min-h-screen">
      <ModernCalendar />
      <Task />
    </div>
  );
};

export default Home;
