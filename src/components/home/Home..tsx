// <========================= file to create the home page for the user ==============>

// importing the required modules
import ModernCalendar from "../calender/ModernCalendar";
import Task from "../task/Task";

const Home = () => {
  return (
    <div className="bg-custom w-full flex flex-row min-h-screen">
      <ModernCalendar />
      <Task />
    </div>
  );
};

export default Home;
