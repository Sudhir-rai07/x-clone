import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import User from "../../components/utils/User";

const Following = ({ view, user, text, me }) => {
  return (
    <div className="fixed z-50 flex items-center justify-center w-full h-screen -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm top-1/2 left-1/2">
      <div className="fixed w-[350px] rounded-lg p-4 h-1/2 bg-black shadow-[4px_4px_14px_0px_#f7fafc] overflow-y-scroll ">
        <p onClick={view} className="flex justify-end cursor-pointer">
          <RxCross2 />
        </p>

        {text === "followers" &&
          user &&
          user.followers.length !== 0 &&
          user.followers.map((follower) => (
            <div className="flex items-center">
              <User user={user} viewFn={view}/>
            </div>
          ))}

        {text === "following" &&
          user &&
          user.following.length !== 0 &&
          user.following.map((user) => (
            <div className="flex items-center" key={user?._id}>
             <User user={user} viewFn={view}/>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Following;
