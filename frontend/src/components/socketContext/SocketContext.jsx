import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {data: authUser} = useQuery({queryKey: ["userAuth"]})

  useEffect(() => {
    const socket = io("http://localhost:5000", {
        query: {
            userId : authUser?._id
        }
    });
    setSocket(socket);

    socket.emit('userConnected', authUser?._id)

    socket.on('getOnlineUsers', (users)=>{
        console.log(users)
    })

    socket.on("getOnlineUsers", (users) => {
      console.log(users);
      setOnlineUsers(users)
    });
    return () => socket.disconnect();
  }, []);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
