import React, { useContext, useEffect } from "react";
import { SocketContext } from "../components/socketContext/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useContext(SocketContext);
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
