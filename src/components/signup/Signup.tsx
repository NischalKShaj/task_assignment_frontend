// <========================== file to create the signup page ================>

// importing the required modules
import React, { ChangeEventHandler, useState } from "react";
import { isStrongPassword, isValidUsername } from "../../utils/validate";
import useApi from "../../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { FormData, SignupResponse } from "../../types/types";

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
        console.log(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading.....</div>;
  }

  if (error) {
    setMessage(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-950 via-purple-900 to-slate-900">
      <form
        onSubmit={handleSubmit}
        className="relative w-[450px] bg-[rgba(0,0,0,0.2)] backdrop-blur-[25px] border-2 border-[#c6c3c3] rounded-[15px] p-[7.5em_2.5em_4em_2.5em] text-[#ffffff]"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#c6c3c3] w-[140px] h-[70px] rounded-b-[20px]">
          <span className="text-[30px] text-[#000000]">Signup</span>
        </div>
        {message && <p className="text-red-500 mt-4">{message}</p>}
        <div className="relative flex flex-col items-center my-5">
          <input
            type="text"
            id="username"
            onChange={changeEvent}
            className="input_field peer"
            placeholder=" "
            required
          />
          <label htmlFor="email" className="label">
            username
          </label>
          {errors.username && (
            <p className="text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        <div className="relative flex flex-col items-center my-5">
          <input
            type="email"
            id="email"
            onChange={changeEvent}
            className="input_field peer"
            placeholder=" "
            required
          />
          <label htmlFor="email" className="label">
            email
          </label>
        </div>

        <div className="relative flex flex-col items-center my-5">
          <input
            type="tel"
            id="phone"
            onChange={changeEvent}
            className="input_field peer"
            placeholder=" "
            required
          />
          <label htmlFor="phone" className="label">
            phone
          </label>
        </div>

        <div className="relative flex flex-col items-center my-5">
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
              <label
                htmlFor="manager"
                className="flex items-center cursor-pointer text-sm"
              >
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
              <label
                htmlFor="employee"
                className="flex items-center cursor-pointer text-sm"
              >
                Employee
              </label>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center my-5">
          <input
            type="password"
            id="password"
            onChange={changeEvent}
            className="input_field peer"
            placeholder=" "
            required
          />
          <label htmlFor="password" className="label">
            password
          </label>
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="relative flex flex-col items-center my-5">
          <button
            type="submit"
            className="w-full h-[45px] bg-[#f71616] text-[16px] font-medium border-none rounded-full cursor-pointer transition-colors duration-300 uppercase hover:bg-[#f53c3c]"
          >
            Signup
          </button>
        </div>
        <div className="flex text-center cursor-pointer pt-2">
          <p>Already have an account? Continue to</p>
          <Link to="/" className="ml-2 text-blue-500">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
