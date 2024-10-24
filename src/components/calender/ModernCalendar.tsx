// <=========================== file for showing the calender ====================>

// importing the required modules
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DateStore } from "../../store/dateStore";
import { AppState } from "../../store/store";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

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
    locale: string | undefined,
    date: Date
  ): string => {
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  };

  const formatMonthYear = (locale: string | undefined, date: Date): string => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // for handling the logout
  const handleLogout = async () => {
    try {
      const response = await get(`/logout`);
      if (response.status === 200) {
        console.log("user logged out");
        localStorage.removeItem("access_token");
        isLoggedOut();
        navigate("/");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="p-6 pb-[550px] bg-white shadow-xl max-w-md border-r border-gray-700/45">
      <div>
        <div>
          <img alt="profile-image" src={user?.profile} />
          <li>{user?.username}</li>
          <li>{user?.email}</li>
          <li>{user?.role}</li>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Calender</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="modern-calendar border-black"
        tileClassName={({ date, view }) => {
          if (view === "month" && date.getDay() === 0) {
            return "sunday";
          }
        }}
        prevLabel={<span className="calendar-nav">&#8249;</span>}
        nextLabel={<span className="calendar-nav">&#8250;</span>}
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        formatShortWeekday={formatShortWeekday}
        formatMonthYear={formatMonthYear}
      />
      <div className="flex items-center justify-center ">
        <button
          onClick={handleLogout}
          className="w-40 bg-red-500 rounded text-white p-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
