// <========================== file to create the signup page ================>

// importing the required modules
import React, { ChangeEventHandler, useState } from "react";
import { isStrongPassword, isValidUsername } from "../../utils/validate";
import useApi from "../../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { FormData, SignupResponse } from "../../types/types";
import Swal from "sweetalert2";

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setError] = useState<FormData>({});
  const { post, loading, error } = useApi();

  const navigate = useNavigate();

  // function for change events
  const changeEvent: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    const { id, value, name, type } = target;
    let error = "";

    if (id === "username" && !isValidUsername(value)) {
      error = "username should contain only alphabetic characters";
    } else if (id === "password" && !isStrongPassword(value)) {
      error =
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character";
    }

    if (type === "radio" && name === "role") {
      setFormData((prevData) => ({ ...prevData, role: value }));
    } else {
      setError((prevError) => ({ ...prevError, [id]: error }));

      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  // function for submitting the data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      setMessage("Please fix the errors before submitting");
      return;
    }

    const dataToSubmit = {
      username: formData.username || "",
      email: formData.email || "",
      phone: formData.phone || "",
      password: formData.password || "",
      role: formData.role || "",
    };

    try {
      const response = await post<SignupResponse>("/signup", dataToSubmit);

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "User created successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        console.log(response.data);
        navigate("/");
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

  if (loading) {
    return <div>Loading.....</div>;
  }

  if (error) {
    setMessage(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg rounded-lg p-8 space-y-6 text-white"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Signup</h2>
          <p className="text-gray-400 text-sm">
            Create your account. Join us now!
          </p>
        </div>

        {message && <p className="text-red-500 text-center">{message}</p>}

        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm text-gray-400 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            onChange={changeEvent}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter your username"
            required
          />
          {errors.username && (
            <p className="text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={changeEvent}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm text-gray-400 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            onChange={changeEvent}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Role</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="manager"
                name="role"
                value="manager"
                className="w-4 h-4 mr-2 cursor-pointer"
                required
                onChange={changeEvent}
              />
              <label htmlFor="manager" className="text-sm cursor-pointer">
                Manager
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="employee"
                name="role"
                value="employee"
                className="w-4 h-4 mr-2 cursor-pointer"
                required
                onChange={changeEvent}
              />
              <label htmlFor="employee" className="text-sm cursor-pointer">
                Employee
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={changeEvent}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter your password"
            required
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold tracking-wide text-sm transition"
        >
          Signup
        </button>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
