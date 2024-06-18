import React from "react";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import verificationSvg from "/verification.svg";
const VerifyUser = () => {
  const { id, token } = useParams();
  const handleUserVarification = async () => {
    try {
      return axios.get(`/api/auth/user/${id}/verify/${token}`);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: verificationData,
    isError,
    error,
  } = useQuery({
    queryKey: ["verifyUser"],
    queryFn: handleUserVarification,
    staleTime: 0
  });

  console.log(verificationData);
  if(isError) console.log(error)
  if (isError) return <div className="mt-8 text-center text-red-500">{error.response.data.error}</div>;
  return (
    <div className="w-full h-screen">
     {verificationData?.data?.success ? (<div className="flex flex-col items-center justify-center h-full">
        <img src={verificationSvg} className="w-24" />
        <p className="text-green-500">{verificationData?.data?.message}</p>
        <Link to={"/sign-in"} className="text-sm text-blue-500 underline">Sign-in</Link>
      </div>): (
        <div className="flex flex-col items-center justify-center w-full h-full text-2xl text-red-500">Error</div>
      )}
    </div>
  );
};

export default VerifyUser;
