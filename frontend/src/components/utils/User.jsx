import React from "react";
import { Link } from "react-router-dom";

const User = ({ user, viewFn }) => {
  return (
    <Link
      to={`/profile/${user.username}`}
      onClick={viewFn}
      className="flex items-center w-full h-10 py-1 mb-3 transition-all duration-200 "
    >
      <img
        src={user?.profileImg || "/avatar-placeholder.png"}
        className="object-cover w-10 h-10 rounded-full"
      />
      <div className="flex flex-row w-full ml-2">
        <div className="flex flex-col">
          <p className="text-[15px] font-semibold">{user?.fullName}</p>
          <p className="text-[12px]">{user?.username}</p>
        </div>
      </div>
    </Link>
  );
};

export default User;
