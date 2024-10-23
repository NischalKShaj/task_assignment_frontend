// <========================== file to show, view and add task ==========================>

// importing the required modules
import { useState } from "react";
import { DateStore } from "../../store/dateStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppState } from "../../store/store";

const Task = () => {
  const date = DateStore((state) => state.date);
  const user = AppState((state) => state.user);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [task, setTasks] = useState([]);

  // for showing the form for adding new task
  const handleCreate = () => {
    setShow((prev) => !prev);
  };

  const parsedStartDate = date
    ? date instanceof Date
      ? date
      : new Date(date)
    : new Date();

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-4 m-10">
      <h2 className="mb-4 text-xl font-bold">Task Manager</h2>
      <p>Date:{parsedStartDate.toLocaleDateString()}</p>

      {/* Form fields */}
      {user?.role === "manager" && (
        <div>
          {!show ? (
            // Show "Create" button when form is not shown
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white p-2 rounded mb-4 w-40"
            >
              Create Task
            </button>
          ) : (
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="p-2 border rounded mb-4"
              />

              <label htmlFor="description" className="mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="p-2 border rounded mb-4"
              />

              <label htmlFor="employee" className="mb-2">
                Employee
              </label>
              <input
                type="email"
                name="employee"
                className="p-2 border rounded"
              />

              <div className="flex flex-row space-x-7">
                <div className="mb-4">
                  <label className="block text-lg mb-2">Start Date:</label>
                  <DatePicker
                    selected={parsedStartDate}
                    dateFormat="MMMM d, yyyy"
                    readOnly
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg mb-2">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    dateFormat="MMMM d, yyyy"
                    minDate={parsedStartDate}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="bg-red-500 text-white p-2 rounded w-40"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {task.length > 0 ? (
        <div>
          {task.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </div>
      ) : (
        <div>
          <h2>No tasks</h2>
        </div>
      )}
    </div>
  );
};

export default Task;
