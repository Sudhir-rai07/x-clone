import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import { FaBars } from "react-icons/fa";
import Chatbox from "./Chatbox";
import useConversation from "../../zustand/useConversation";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SocketContextProvider } from "../socketContext/SocketContext";

const ChatHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { selectedConversation } = useConversation();

  const handleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  return (
    <SocketContextProvider>
      <div className="relative flex flex-row w-full h-full gap-2">
        <div
          className="absolute text-lg cursor-pointer top-2 left-2 lg:hidden"
          onClick={handleShowSidebar}
        >
          <FaBars />
        </div>
        <ChatSidebar showSidebar={showSidebar} showFn={handleShowSidebar} />
        {/* Chat Box */}
        {selectedConversation ? <Chatbox /> : <NoChatSelected />}
      </div>
    </SocketContextProvider>
  );
};

export default ChatHome;

const NoChatSelected = () => {
  const { data: authUser } = useQuery({ queryKey: ["userAuth"] });
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen max-w-3xl bg-slate-700">
      <img src="/chatsvg.svg" alt="" className="w-1/2 " />
      <div className="text-xl ">
        Welcome 👋{" "}
        <span className="text-2xl font-semibold">{authUser?.fullName}</span>
      </div>
      <div className="text-lg ">Select a chat to start conversation</div>
      <div className="mt-32">
        <Link to={"/"} className="underline ">
          Go to home
        </Link>
      </div>
    </div>
  );
};
