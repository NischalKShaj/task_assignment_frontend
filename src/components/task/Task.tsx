// <========================== file to show, view and add task ==========================>

// importing the required modules
import { ChangeEventHandler, useEffect, useState } from "react";
import { DateStore } from "../../store/dateStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppState } from "../../store/store";
import useApi from "../../hooks/useApi";
import { SelectedTask, IndividualTask, TaskDoc } from "../../types/types";
import Swal from "sweetalert2";

const Task = () => {
  const date = DateStore((state) => state.date);
  const user = AppState((state) => state.user);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<SelectedTask[]>([]);
  const [task, setTask] = useState<IndividualTask>({
    title: "",
    description: "",
    employee: "",
    createdAt: "",
    dueDate: "",
    createdBy: "",
  });
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] =
    useState(searchFilter);

  const { get, post, put, del } = useApi();

  const parsedStartDate =
    date instanceof Date ? date : new Date(date || new Date());
  const [prevParsedStartDate, setPrevParsedStartDate] =
    useState(parsedStartDate);

  const formatDateForAPI = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format it as YYYY-MM-DD
  };

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
    } else if (
      user?.role === "employee" &&
      prevParsedStartDate.getTime() !== parsedStartDate.getTime()
    ) {
      const fetch = async () => {
        try {
          const id = user._id;
          const formattedDate = formatDateForAPI(parsedStartDate);
          const response = await get<SelectedTask[]>(
            `/tasks/${formattedDate}/${id}`
          );
          if (response.status === 202 && Array.isArray(response.data)) {
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
          console.error("error", error);
        }
      };
      fetch();
      setPrevParsedStartDate(parsedStartDate);
    }
  }, [parsedStartDate, user, get]);

  // for showing the form for adding new task
  const handleCreate = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setTask({
      title: "",
      description: "",
      employee: "",
      createdAt: "",
      dueDate: "",
      createdBy: "",
    });
    setEndDate(null);
    setShow((prev) => !prev);
  };

  // for editing the existing task
  const handleEdit = (taskToEdit: SelectedTask) => {
    setIsEditing(true);
    setEditingTaskId(taskToEdit._doc._id);
    setTask({
      title: taskToEdit._doc.title,
      description: taskToEdit._doc.description,
      employee: taskToEdit._doc.assignedTo,
      createdAt: taskToEdit._doc.createdAt.toString(),
      dueDate: taskToEdit._doc.dueDate.toString(),
      createdBy: taskToEdit._doc.createdBy,
    });
    setEndDate(new Date(taskToEdit._doc.dueDate));
    setShow(true);
  };

  // for changing the contents in the form
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const target = e.currentTarget;
    const { value, id } = target;
    setTask((prevData) => ({ ...prevData, [id]: value }));
  };

  // for handling the submission of the task and the editing of the task
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
      if (isEditing && editingTaskId) {
        const response = await put<TaskDoc>(
          `/update-task/${editingTaskId}`,
          newTask as unknown as Record<string, unknown>
        );
        if (response.status === 200) {
          const updatedTask = response.data;
          console.log("updated task", updatedTask);
          Swal.fire({
            title: "Success!",
            text: "Task updated successfully.",
            icon: "success",
            confirmButtonText: "Okay",
          });
          setTasks((prevTasks) =>
            prevTasks.map((t) => {
              if (t._doc._id === editingTaskId) {
                return {
                  ...t,
                  _doc: updatedTask,
                };
              }
              return t;
            })
          );
        }
      } else {
        const response = await post<SelectedTask>(
          "/add-task",
          newTask as unknown as Record<string, unknown>
        );
        if (response.status === 201) {
          const { _doc, employeeName, managerName } = response.data;
          Swal.fire({
            title: "Success!",
            text: "New task added successfully.",
            icon: "success",
            confirmButtonText: "Okay",
          });
          const updatedTask: SelectedTask = {
            _doc,
            employeeName,
            managerName,
          };
          setTasks((prevTasks) => [...prevTasks, updatedTask]);
        }
      }
      setShow(false);
      setIsEditing(false);
      setEditingTaskId(null);
    } catch (error) {
      Swal.fire({
        title: "ERror!",
        text: "Oops something bad happened.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      console.error("error", error);
    }
  };

  // for handling the delete functionality
  const handleDelete = async (task: SelectedTask) => {
    try {
      const id = task._doc._id;

      const response = await del(`/remove-task/${id}`);
      if (response.status === 200) {
        console.log("response", response.data);
        Swal.fire({
          title: "Success!",
          text: "Task deleted successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setTasks((prevTasks) => prevTasks.filter((t) => t._doc._id !== id));
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Oops something bad happened.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      console.error("error", error);
    }
  };

  // for handling the status of the task by the employee
  const handleStatus = async (item: SelectedTask, newStatus: string) => {
    try {
      setStatusUpdating(item._doc._id);
      const id = item._doc._id;

      const response = await put(`/update-status/${id}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Status of the task updated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task._doc._id === id) {
              return {
                ...task,
                _doc: {
                  ...task._doc,
                  status: newStatus,
                },
              };
            }
            return task;
          })
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setStatusUpdating(null); // Hide loading state
    }
  };

  // for showing hte status of the task
  const renderEmployeeStatusUpdate = (item: SelectedTask) => {
    if (user?.role !== "employee") return null;

    return (
      <div className="flex flex-col space-y-2">
        <label
          htmlFor={`taskStatus-${item._doc._id}`}
          className="block text-lg mb-2"
        >
          Task Status:
        </label>
        <select
          id={`taskStatus-${item._doc._id}`}
          className="p-2 border rounded w-full text-black"
          value={item._doc.status}
          onChange={(e) => handleStatus(item, e.target.value)}
          disabled={statusUpdating === item._doc._id}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {statusUpdating === item._doc._id && (
          <div className="text-sm text-gray-500">Updating status...</div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchFilter(searchFilter);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchFilter]);

  // for filtering the task
  const filteredTasks = async () => {
    try {
      const id = user?._id;
      const searchParams = debouncedSearchFilter.trim() || "default";
      const statusParams = statusFilter === "all" ? "all" : statusFilter;

      const response = await get(
        `/filterData/${id}/${statusParams}/${searchParams}`
      );
      console.log("response", response);
      if (response.status === 200 && Array.isArray(response.data)) {
        const formattedTasks: SelectedTask[] = response.data.map((task) => ({
          ...task,
        }));
        setTasks(formattedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    filteredTasks();
  }, [debouncedSearchFilter, statusFilter]);

  return (
    <div className="min-h-screen flex w-full items-start justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="flex flex-col w-full mt-16 max-w-4xl min-h-[80vh] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg p-8 shadow-lg overflow-y-auto">
        <h2 className="mb-4 text-3xl font-bold text-white text-center">
          Task Manager
        </h2>
        <p className="text-gray-300 mb-4 text-center">
          Date: {parsedStartDate.toLocaleDateString()}
        </p>

        {user?.role === "manager" && (
          <div>
            {!show ? (
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white p-2 rounded mb-4 w-full max-w-xs mx-auto hover:bg-blue-700 transition-all"
              >
                Create Task
              </button>
            ) : (
              <div className="flex flex-col">
                <label htmlFor="title" className="mb-2 text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="title"
                  id="title"
                  value={task.title}
                  className="p-2 bg-slate-700 text-white border border-slate-500 rounded mb-4 focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter task title"
                />

                <label htmlFor="description" className="mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  value={task.description}
                  id="description"
                  className="p-2 bg-slate-700 text-white border border-slate-500 rounded mb-4 focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter task description"
                />

                {!isEditing && (
                  <>
                    <label htmlFor="employee" className="mb-2 text-gray-300">
                      Employee
                    </label>
                    <input
                      type="email"
                      onChange={handleChange}
                      name="employee"
                      id="employee"
                      className="p-2 bg-slate-700 text-white border border-slate-500 rounded mb-4 focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter employee email"
                    />

                    <div className="flex flex-row space-x-7 mb-4">
                      <div className="flex flex-col w-full">
                        <label className="block text-lg text-gray-300 mb-2">
                          Start Date:
                        </label>
                        <DatePicker
                          selected={parsedStartDate}
                          dateFormat="MMMM d, yyyy"
                          readOnly
                          className="w-full p-2 bg-slate-700 text-white border border-slate-500 rounded"
                        />
                      </div>

                      <div className="flex flex-col w-full">
                        <label className="block text-lg text-gray-300 mb-2">
                          End Date:
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date | null) => setEndDate(date)}
                          dateFormat="MMMM d, yyyy"
                          minDate={parsedStartDate}
                          className="w-full p-2 bg-slate-700 text-white border border-slate-500 rounded"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-row space-x-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white p-2 rounded w-full max-w-xs hover:bg-green-700 transition-all"
                  >
                    {isEditing ? "Update" : "Submit"}
                  </button>
                  <button
                    onClick={handleCreate}
                    className="bg-red-600 text-white p-2 rounded w-full max-w-xs hover:bg-red-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add filter controls */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex-1">
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-700 text-white border border-slate-500 rounded focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Search
            </label>
            <input
              id="search"
              placeholder="Enter the manager name"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full p-2 bg-slate-700 text-white border border-slate-500 rounded focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {tasks.map((item, index) => (
              <div
                key={index}
                className="border border-slate-500 p-4 mb-2 rounded bg-slate-700 text-white"
              >
                <h3 className="font-bold text-lg">{item._doc.title}</h3>
                <p>{item._doc.description}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      item._doc.status === "completed"
                        ? "text-green-400"
                        : item._doc.status === "pending"
                        ? "text-red-400"
                        : item._doc.status === "in-progress"
                        ? "text-yellow-400"
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
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {user?.role === "employee" && renderEmployeeStatusUpdate(item)}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center">
            <h2 className="text-white">No tasks match the current filters</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
