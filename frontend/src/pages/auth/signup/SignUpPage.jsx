import React, { useState } from "react";
import Xsvg from "../../../components/svgs/X";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signUpUser = async () => {
    try {
      return axios.post("/api/auth/signup", formData);
    } catch (error) {
      throw new Error(error)
    }
  };

  const {
    mutate: userSignUp,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: signUpUser,
    onError: (error)=>{
      console.log(error.response.data.error)
    },
    onSuccess: ()=>{
      toast.success("Sign up successfully")
      queryClient.invalidateQueries({queryKey:["userAuth"]})
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password)
      return toast.error("All input fields are required!");
    userSignUp();
  };

  return (
    <div className="flex w-full h-screen max-w-screen-xl pt-10 pl-4 mx-auto lg:pl-0">
      <section className="items-center justify-center hidden w-full sm:flex sm:w-1/2">
        <Xsvg height={400} width={400} className=" sm:w-3/6 fill-white" />
      </section>
      <section className="flex flex-col items-center w-full lg:justify-start sm:w-1/2">
        <h2 className="mt-8 text-3xl font-bold lg:text-5xl md:text-3xl">Connecting now</h2>
        <h2 className="mt-4 text-2xl font-bold lg:mt-8 lg:text-4xl">Join today.</h2>
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
              type="text"
              placeholder="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              name="fullName"
              id="fullName"
              autoComplete="off"
              className="input input-bordered hover:border-[#0e659b] hover:border-2 text-white w-full max-w-xs rounded-lg focus:outline-none focus:border-2 focus:border-[#1DA1F2] transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col mt-2">
            <input
              type="email"
              placeholder="your@email"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              id="email"
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

          {isError && <div className="text-red-400">{error.response.data.error}</div>}
          <div className="mx-auto w-60 ">
            <button
              type="submit"
              className="mt-4 py-2 rounded-lg text-center font-semibold bg-[white] text-black w-full"
            >
              {isPending ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center w-full pb-4 mx-auto mt-6">
          <span className="mr-2 text-sm text-center">Already have an account? </span>
          <Link to={"/sign-in"} className="text-blue-500">
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
