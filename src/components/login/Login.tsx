// <====================== file to create the login ======================>

// importing the required modules
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { LoginFormData, LoginResponse } from "../../types/types";
import { AppState } from "../../store/store";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const { post } = useApi();
  const isLoggedIn = AppState((state) => state.isLoggedIn);
  const authorized = AppState((state) => state.isAuthorized);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) {
      navigate("/home");
    }
  }, [authorized, navigate]);

  // function to change the values
  const changeEvent: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    const { id, value } = target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // function for handling the login page
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginFormData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await post<LoginResponse>("/login", loginFormData);
      if (response.status === 202) {
        console.log("response.data", response.data);
        const { token, data } = response.data;
        console.log("token", token);
        localStorage.setItem("access_token", token);
        isLoggedIn({
          _id: data._id,
          username: data.username,
          email: data.email,
          role: data.role,
          profile: data.profile,
        });
        Swal.fire({
          title: "Success!",
          text: "User logged in successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        console.log("user", data);
        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        title: "error!",
        text: "Incorrect user details.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      setMessage("invalid user details");
      console.error("error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-950 via-purple-900 to-slate-900">
      <form
        onSubmit={handleSubmit}
        className="relative w-[450px] bg-[rgba(0,0,0,0.2)] backdrop-blur-[25px] border-2 border-[#e4dfdf] rounded-[15px] p-[7.5em_2.5em_4em_2.5em] text-[#ffffff]"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#c6c3c3] w-[140px] h-[70px] rounded-b-[20px]">
          <span className="text-[30px] text-[#000000]">Login</span>
        </div>

        <p className="text-red-500 mt-4">{message}</p>
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
            type="password"
            onChange={changeEvent}
            id="password"
            className="input_field peer"
            placeholder=" "
            required
          />
          <label htmlFor="password" className="label">
            password
          </label>
        </div>

        <div className="relative flex flex-col items-center my-5">
          <button
            type="submit"
            className="w-full h-[45px] bg-[#f71616] text-[16px] font-medium border-none rounded-full cursor-pointer transition-colors duration-300 uppercase hover:bg-[#f53c3c]"
          >
            Login
          </button>
        </div>

        <div className="flex text-center cursor-pointer pt-2">
          <p>Don&apos;t have an account</p>
          <Link to="/signup" className="ml-2 text-blue-500">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
