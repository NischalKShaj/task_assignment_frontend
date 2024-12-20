// <=========================== file for showing the calender ====================>

// importing the required modules
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DateStore } from "../../store/dateStore";
import { AppState } from "../../store/store";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ModernCalendar() {
  const currentDate = DateStore((state) => state.changeDate);
  const isLoggedOut = AppState((state) => state.isLoggedOut);
  const user = AppState((state) => state.user);
  const [date, setDate] = useState<Value>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>("");
  const { get } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    setDate(today);
    currentDate(today);
  }, [currentDate]);

  const handleDateChange = (value: Value) => {
    setDate(value);

    if (value instanceof Date) {
      const formatted = formatDate(value);
      setFormattedDate(formatted);
      console.log("formatted date", formattedDate);
      currentDate(value);
    } else if (Array.isArray(value) && value[0]) {
      const formatted = formatDate(value[0]);
      setFormattedDate(formatted);
      console.log("formatted date", formattedDate);
      currentDate(value[0]);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortWeekday = (
    _locale: string | undefined,
    date: Date
  ): string => {
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  };

  const formatMonthYear = (_locale: string | undefined, date: Date): string => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // for handling the logout
  const handleLogout = async () => {
    try {
      const response = await get(`/logout`);
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "User logged out successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        console.log("user logged out");
        localStorage.removeItem("access_token");
        isLoggedOut();
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Status of the task updated successfully.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      console.error("error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="p-8 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg rounded-lg w-full max-w-md mr-9">
        {/* Profile Section */}
        <div className="mb-6 text-center">
          <img
            alt="profile-image"
            src={user?.profile}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <ul className="text-white text-lg">
            <li className="mb-1">{user?.username}</li>
            <li className="mb-1">{user?.email}</li>
            <li className="text-purple-400">{user?.role}</li>
          </ul>
        </div>

        {/* Task Scheduler Section */}
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Task Scheduler
        </h2>

        <Calendar
          onChange={handleDateChange}
          value={date}
          className="modern-calendar border-black mb-6"
          tileClassName={({ date, view }) => {
            if (view === "month" && date.getDay() === 0) {
              return "sunday";
            }
          }}
          prevLabel={<span className="calendar-nav text-white">&#8249;</span>}
          nextLabel={<span className="calendar-nav text-white">&#8250;</span>}
          prev2Label={null}
          next2Label={null}
          minDetail="month"
          formatShortWeekday={formatShortWeekday}
          formatMonthYear={formatMonthYear}
        />

        {/* Logout Button */}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold tracking-wide text-sm transition-all transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
