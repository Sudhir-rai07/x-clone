import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
    const [text, setText] = useState("")
    const navigate = useNavigate()
    const handlePasswordRecovery = async () =>{
        const response = await axios.post(`/api/auth/forget-password/`, {text})
        return response.data
    }
    const {mutate:sendPasswordRecoveryMail, data:responseData, isError, error} = useMutation({
        mutationFn: handlePasswordRecovery,
        onError: (error)=>{
            console.log(error)
            toast.error("error")
        },
        onSuccess: ()=>{
            toast.success("Recovery email sent")
            setText("")
            console.log(responseData)
            navigate("/sign-in")
        }
    })
    console.log(responseData)
    if(isError) console.log(error)
  return (
    <div className="flex flex-col justify-center w-full h-screen px-4 sm:px-8">
    <div className="flex flex-row w-full h-14">
        <div>
            <XSvg height={50} width={50} key={"forget-pass-page"}/>
        </div>

        <div className="flex items-center h-full gap-3 ml-auto">
        <button className="w-24 py-1 font-semibold text-black transition-colors duration-200 bg-white rounded-md hover:bg-blue-400"><Link to={"/sign-in"}>Sign in</Link></button>
        <button className="w-24 py-1 font-semibold text-black transition-colors duration-200 bg-white rounded-md hover:bg-blue-400"><Link to={"/sign-up"}>Sign up</Link></button>
        </div>
    </div>
      <div className="flex flex-col items-center justify-center w-full h-full px-4">
        <form onSubmit={(e)=>{
            e.preventDefault()
            sendPasswordRecoveryMail()
        }} className="flex flex-col sm:w-[500px] px-4 py-2 bg-gray-800 border border-gray-500 rounded-lg">
          <h2 className="pb-2 text-xl border-b border-gray-600">Find your account</h2>

          <div className="pb-6 mt-4 border-b border-gray-600">
            <p className="text-sm sm:text-sm">Please enter username or email associated with your account. We will send you a recovery link to reset your password</p>
            <input type="text" name="username" autoComplete="off" placeholder="username or Email address" className="w-full h-10 px-2 py-1 mt-2 bg-transparent border border-gray-600 rounded-md sm:w-4/5" value={text} onChange={(e)=> setText(e.target.value)}/>
            {isError && <p className="text-red-600 text-[14px] mt-2">{error?.response?.data?.error}</p>}
            {responseData && <p className="text-red-600 text-[14px] mt-2">{responseData?.message}</p>}
          </div>

          <div className="flex gap-2 mt-4 ml-auto">
            <button className="w-24 py-1 font-semibold text-black bg-gray-400 rounded-md"><Link to={"/sign-in"}>Cancle</Link></button>
            <button disabled={!text} className={`px-2 py-1 font-semibold text-white bg-blue-500 rounded-md  disabled:bg-blue-300 disabled:text-gray-700 disabled:cursor-not-allowed `}>Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
