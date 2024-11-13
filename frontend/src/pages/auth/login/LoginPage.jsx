import React, { useState } from "react";
import Xsvg from "../../../components/svgs/X";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    try {
      return axios.post("/api/auth/login", formData);
    } catch (error) {
      console.log(error.message)
      throw new Error(error);
    }
  };

  const {
    mutate: userSignIn,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.log(error);
      // toast.error(error.response.data.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      toast.success("Login success")
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password)
      return toast.error("All input fields are required!");
    userSignIn();
  };

  return (
    <div className="flex justify-center w-full h-screen max-w-screen-xl pt-10 mx-auto md:pl-4 lg:pl-0">
      <section className="items-center justify-center hidden w-full sm:flex sm:w-1/2">
        <Xsvg height={400} width={400} className=" sm:w-3/6 fill-white" />
      </section>
      <section className="flex flex-col items-center justify-center w-full h-full lg:justify-center sm:w-1/2">
        <h2 className="mt-4 text-2xl font-bold lg:mt-8 lg:text-5xl sm:text-3xl">Connecting now</h2>
        <h2 className="mt-3 text-2xl font-bold lg:text-4xl lg:mt-8">Join today.</h2>
        <form className="w-64 mt-4 lg:mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-col mt-2">
            <input
              type="text"
              placeholder="username or email"
              value={formData.username}
              onChange={handleInputChange}
              name="username"
              id="username"
              autoComplete="off"
              className="input input-bordered hover:border-[#0e659b] hover:border-2 text-white w-full max-w-xs rounded-lg focus:outline-none focus:border-2 focus:border-[#1DA1F2] transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col mt-2">
            <input
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              id="password"
              autoComplete="off"
              className="input input-bordered hover:border-[#0e659b] hover:border-2 text-white w-full max-w-xs rounded-lg focus:outline-none focus:border-2 focus:border-[#1DA1F2] transition-colors duration-200"
            />
          </div>

          {isError && <div className="text-red-500">{error.response.data.error}</div>}
          <div className="mx-auto w-60 ">
            <button
              type="submit"
              className="mt-4 py-2 rounded-lg text-center font-semibold bg-[white] text-black w-full"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="mt-2 text-sm text-blue-600 hover:underline">
            <Link to={"/forget-password"}>Forgotten password?</Link>
          </div>

        <div className="flex items-center justify-center w-full pb-4 mx-auto mt-4">
          <span className="mr-1 text-sm text-center">Don't have an account? </span>
          <Link to={"/sign-up"} className="text-blue-500">
            Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
