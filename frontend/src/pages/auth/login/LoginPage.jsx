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
    <div className="flex w-full h-screen max-w-screen-xl pt-10 pl-4 mx-auto lg:pl-0">
      <section className="items-center justify-center hidden w-full sm:flex sm:w-1/2">
        <Xsvg className=" sm:w-3/6 fill-white" />
      </section>
      <section className="flex flex-col justify-start w-full sm:w-1/2">
        <div className="flex justify-start sm:hidden">
          <Xsvg className="w-16 fill-white" />
        </div>
        <h2 className="mt-8 text-5xl font-bold">Happenig now</h2>
        <h2 className="mt-8 text-2xl font-bold">Join today.</h2>
        <form className="w-64 mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-col mt-2">
            <input
              type="text"
              placeholder="username"
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

        <div className="pb-4 mx-auto mt-6 ml-4">
          <span className="text-sm text-center">Don't have an account? </span>
          <Link to={"/sign-up"} className="text-blue-500">
            Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
