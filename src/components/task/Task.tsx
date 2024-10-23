// <========================== file to show, view and add task ==========================>

// importing the required modules
import { ChangeEventHandler, useEffect, useState } from "react";
import { DateStore } from "../../store/dateStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppState } from "../../store/store";
import useApi from "../../hooks/useApi";
import { SelectedTask, IndividualTask } from "../../types/types";

const Task = () => {
  const date = DateStore((state) => state.date);
  const user = AppState((state) => state.user);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);

  const [tasks, setTasks] = useState<SelectedTask[]>([]);
  const [task, setTask] = useState<IndividualTask>({
    title: "",
    description: "",
    employee: "",
    createdAt: "",
    dueDate: "",
    createdBy: "",
  });

  const { get, post } = useApi();

  const parsedStartDate = date
    ? date instanceof Date
      ? date
      : new Date(date)
    : new Date();
  const [prevParsedStartDate, setPrevParsedStartDate] =
    useState(parsedStartDate);

  const formatDateForAPI = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format it as YYYY-MM-DD
  };

  // for fetching all the tasks for that particular date and the employee
  useEffect(() => {
    if (
      user?.role === "manager" &&
      prevParsedStartDate.getTime() !== parsedStartDate.getTime()
    ) {
      const fetch = async () => {
        try {
          const formattedDate = formatDateForAPI(parsedStartDate);
          console.log("formattedDate useEffect", formattedDate);
          const response = await get<SelectedTask[]>(`/tasks/${formattedDate}`);
          if (response.status === 202 && Array.isArray(response.data)) {
            console.log(response.data);
            const formattedTasks: SelectedTask[] = response.data.map(
              (task) => ({
                ...task,
              })
            );
            setTasks(formattedTasks);
          } else {
            setTasks([]);
          }
        } catch (error) {
          setTasks([]);
          console.error(error);
        }
      };
      fetch();
      setPrevParsedStartDate(parsedStartDate);
    }
  }, [parsedStartDate, user]);

  // for showing the form for adding new task
  const handleCreate = () => {
    setShow((prev) => !prev);
  };

  // for changing the contents in the form
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const target = e.currentTarget;
    const { value, id } = target;
    setTask((prevData) => ({ ...prevData, [id]: value }));
  };

  // for handling the submission of the task
  const handleSubmit = async () => {
    const formattedDate = parsedStartDate.toLocaleString().split("T")[0];
    const formattedEndDate = endDate?.toLocaleString().split("T")[0];

    console.log("Formatted Start Date:", formattedDate);
    console.log("Formatted End Date:", formattedEndDate);

    const newTask: IndividualTask = {
      ...task,
      createdAt: formattedDate,
      dueDate: formattedEndDate,
      createdBy: user?._id,
    };

    try {
      const response = await post<SelectedTask>(
        "/add-task",
        newTask as unknown as Record<string, unknown>
      );
      if (response.status === 201) {
        console.log("response after adding", response.data);
        const { _doc, employeeName, managerName } = response.data;
        const updatedTask: SelectedTask = {
          _doc,
          employeeName,
          managerName,
        };
        setTasks((prevTasks) => [...prevTasks, updatedTask]);
        setShow(false);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

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
                onChange={handleChange}
                name="title"
                id="title"
                className="p-2 border rounded mb-4"
              />

              <label htmlFor="description" className="mb-2">
                Description
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                id="description"
                className="p-2 border rounded mb-4"
              />

              <label htmlFor="employee" className="mb-2">
                Employee
              </label>
              <input
                type="email"
                onChange={handleChange}
                name="employee"
                id="employee"
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
              <div className="flex flex-row space-x-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white p-2 rounded w-40"
                >
                  Submit
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-red-500 text-white p-2 rounded w-40"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tasks.length > 0 ? (
        <div>
          {tasks.map((item, index) => (
            <div key={index} className="border p-4 mb-2 rounded">
              <h3 className="font-bold">{item._doc.title}</h3>
              <p>{item._doc.description}</p>
              <p>
                Status:{" "}
                <span
                  className={`font-bold ${
                    item._doc.status === "completed"
                      ? "text-green-500"
                      : item._doc.status === "pending"
                      ? "text-red-500"
                      : item._doc.status === "in-progress"
                      ? "text-yellow-500"
                      : ""
                  }`}
                >
                  {item._doc.status}
                </span>
              </p>
              <p>
                Due Date: {new Date(item._doc.dueDate).toLocaleDateString()}
              </p>
              <p>Assigned To: {item.employeeName}</p>
              <p>Created By: {item.managerName}</p>
              {user?.role === "manager" && (
                <div className="flex space-x-4 mt-4">
                  <button className="bg-yellow-500 text-white p-2 rounded">
                    edit
                  </button>
                  <button className="bg-red-500 text-white p-2 rounded">
                    delete
                  </button>
                </div>
              )}
            </div>
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
