import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";

const Following = ({ view, user, text, me }) => {
  const { follow, isPending } = useFollow();
  return (
    <div className="fixed z-50 flex items-center justify-center w-full h-screen -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm top-1/2 left-1/2">
      <div className="fixed w-[350px] rounded-lg p-4 h-1/2 bg-black shadow-[4px_4px_14px_0px_#f7fafc] overflow-y-scroll no-scrollbar">
        <p onClick={view} className="flex justify-end cursor-pointer">
          <RxCross2 />
        </p>

        {text === "followers" &&
          user &&
          user.followers.length !== 0 &&
          user.followers.map((follower) => (
            <div className="flex items-center">
              <Link
                to={`/profile/${follower?.username}`}
                onClick={view}
                key={follower?._id}
                className="flex items-center w-full h-10 py-1 mb-2 transition-all duration-200 "
              >
                <img
                  src={follower?.profileImg || "/avatar-placeholder.png"}
                  className="object-cover w-10 h-10 rounded-full"
                />
                <div className="flex flex-col ml-2">
                  <p className="text-[15px] font-semibold">
                    {follower?.fullName}
                  </p>
                  <p className="text-[12px]">{follower?.username}</p>
                </div>
              </Link>
            </div>
          ))}

        {text === "following" &&
          user &&
          user.following.length !== 0 &&
          user.following.map((user) => (
            <div className="flex items-center">
              <Link
                to={`/profile/${user?.username}`}
                onClick={view}
                key={user?._id}
                className="flex items-center w-full h-10 py-1 mb-3 transition-all duration-200 "
              >
                <img
                  src={user?.profileImg || "/avatar-placeholder.png"}
                  className="object-cover w-10 h-10 rounded-full"
                />
                <div className="flex flex-row w-full ml-2">
                  <div className="flex flex-col">
                    <p className="text-[15px] font-semibold">
                      {user?.fullName}
                    </p>
                    <p className="text-[12px]">{user?.username}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Following;
