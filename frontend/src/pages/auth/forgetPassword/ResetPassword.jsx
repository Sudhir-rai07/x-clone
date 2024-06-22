import React, { useState } from "react";
import XSvg from "../../../components/svgs/X";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ResetPassword = () => {
    const {token} = useParams()
    let text = "Reset"
    const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
    
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return setError("Both fields are required");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be atleast 6 characters long");
    // if(!passwordRegex.test(password)){
    //    return setError('Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
    // }
    
    setError("")
    resetPassword()
  };

  const {mutate:resetPassword, isError, error:mutationError, isPending,isSuccess} = useMutation({
    mutationFn: async ()=>{
        await axios.post(`/api/auth/reset-password/${token}`, {password})
    },
    onError: (error)=>{
        console.log(error)
    },
    onSuccess: ()=>{
        toast.success("Password has been reset")
        text="Done 💀"
        setPassword("")
        setConfirmPassword("")
        
        setTimeout(() => {
        }, 1000);
        
    }
  })

  if(isPending) text="Wait..."
  if(isSuccess) return <ResetPasswordSuccess />

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center mb-4 text-center">
          <XSvg width={60} height={60} key={"password-reset"} />
        </div>
        <form
          className="w-[450px] border border-gray-500 bg-gray-800 rounded-md px-4 py-4"
          onSubmit={handleSubmit}
        >
          <h2 className="mb-4 text-sm text-green-500">Use a strong password</h2>
          <div>
            <input
              type={isChecked ? "text" : "password"}
              name="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="w-full h-10 px-2 py-1 bg-transparent border border-gray-500 rounded-md"
              placeholder="New password"
            />

            {/* Confirm password */}
            <input
              type={isChecked ? "text" : "password"}
              name="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
              className="w-full h-10 px-2 py-1 mt-4 bg-transparent border border-gray-500 rounded-md"
              placeholder="New password"
            />
          </div>
          {error && <p className="my-2 text-sm text-red-500">{error}</p>}
          {isError && <p className="my-2 text-sm text-red-500">{mutationError.response.data.error}</p>}

          <div className="flex items-center h-8 mt-4">
            <input
              type="checkbox"
              id="view-password"
              value={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label
              htmlFor="view-password"
              className="ml-2 text-sm cursor-pointer"
            >
              See password
            </label>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="px-4 py-1 ml-auto font-semibold text-white transition duration-300 ease-in-out bg-gray-500 rounded hover:bg-blue-500"
            >
              {text}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordSuccess = () =>{
  return(
    <>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src="/success.png" className="h-40"/>
          <h2>Your password has been updated.</h2>
          <Link to={'/sign-in'} className="text-blue-500 hover:underline">Sign-in</Link>
        </div>
      </div>
    </>
  )
}
export default ResetPassword;
