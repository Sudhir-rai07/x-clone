import React from "react";
import { Link } from "react-router-dom";

import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";


const Feedbacks = () => {

  return (
    <div className="w-[300px] border-2  rounded-md border-[rgba(8,_112,_184,_0.7)] px-2 py-2">
      <div className="flex items-center w-full h-12">
        <div className="w-8 h-8 overflow-hidden rounded-full">
          <img src="/avatar-placeholder.png" alt=/>
        </div>
        <div className="flex-col ml-2">
          <p className="text-sm font-bold">Fullname</p>
          <p className="text-sm text-gray-500 ">@username</p>
        </div>
      </div>

      <div className="w-full">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, enim.</p>
      </div>

      <div className="flex items-center mt-4">
        <p className="mr-2 text-gray-500">Was this useful ? </p>
        <AiOutlineLike className="mr-2 cursor-pointer hover:text-green-500"/> 
        <AiOutlineDislike className="cursor-pointer hover:text-red-500"/>
      </div>
    </div>
  );
};

export default Feedbacks;
