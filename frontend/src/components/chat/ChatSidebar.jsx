import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import useConversation from "../../zustand/useConversation";
import { FaArrowLeft } from "react-icons/fa";
import { SocketContext } from "../socketContext/SocketContext";

const ChatSidebar = ({ showSidebar, showFn }) => {
  const [search, setSearch] = useState("");
  const { data: allUsers, isFetching } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const response = await axios.get("/api/users/all");
      return response.data;
    },
  });

  return (
    <div
      className={`absolute h-screen overflow-y-scroll ${
        !showSidebar ? "-translate-x-[300px] " : "translate-x-0 "
      } lg:translate-x-0 transition-all duration-200 w-72 lg:relative`}
    >
      <div className="sticky top-0 flex items-center justify-between w-full h-8 gap-2 bg-black">
        <span className="lg:hidden">
          <FaArrowLeft className="cursor-pointer" onClick={showFn} />
        </span>
        <input
          type="search"
          name="search-user"
          id="search-user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          placeholder="Search user"
          className="w-full h-full px-2 mx-auto bg-transparent border-b-2 border-white focus:outline-none backdrop-blur-md"
        />
      </div>
      {/* All users at side */}
      {allUsers &&
        allUsers.map((user, idx) => {
          return <User user={user} key={user?._id} showFn={showFn} />;
        })}
    </div>
  );
};

export default ChatSidebar;

const User = ({ user, showFn }) => {
  const {onlineUsers} = useContext(SocketContext)
  const { setSelectedConversation } = useConversation();

  const isOnline = onlineUsers.includes(user?._id)
  return (
    <div
      className="flex items-center w-full gap-3 px-2 py-1 my-2 bg-gray-700 cursor-pointer"
      onClick={() => {
        setSelectedConversation(user);
        showFn();
      }}
    >
      <div className="relative w-10 h-10 ">
        <img
          src={user?.profileImg || "/avatar-placeholder.png"}
          className="items-center object-cover w-full h-full rounded-full"
        />
      </div>
      <div className="text-lg font-bold">{user?.fullName}</div>
      {isOnline && <span className="top-0 right-0 z-50 flex w-3 h-3 ml-auto bg-green-600 border-none rounded-full">
        </span>}
    </div>
  );
};
