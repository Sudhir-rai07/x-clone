import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "./components/common/Sidebar";
import FollowSuggestion from "./components/common/FollowSuggestion";
import EditProfilePageModal from "./pages/profile/EditProfilePageModal";
import Feedback from "./pages/feedback/Feedback";
import VerifyUser from "./pages/auth/verifyuser/VerifyUser";
import ForgetPassword from "./pages/auth/forgetPassword/ForgetPassword";
import ResetPassword from "./pages/auth/forgetPassword/ResetPassword";
import PostPage from "./pages/post/PostPage";
import ChatHome from "./components/chat/ChatHome";

const App = () => {
  const handleAuthUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
      });
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userAuth"],
    queryFn: handleAuthUser,
  });

const location = useLocation()
const isChatApp = location.pathname.startsWith("/message")

  if (isLoading) return "Loading...";
  if (isError) return <h1>Error</h1>;
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && !isChatApp && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/sign-in"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/sign-up"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationPage /> : <Navigate to={"/sign-in"} />
          }
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/profile/:username/edit"
          element={authUser ? <EditProfilePageModal authUser={authUser}/> : <Navigate to={"/sign-in"} />}
        />
        
        <Route
          path="/message"
          element={authUser ? <ChatHome authUser={authUser}/> : <Navigate to={"/sign-in"} />}
        />  
        
        <Route
          path="/feedback"
          element={authUser ? <Feedback authUser={authUser}/> : <Navigate to={"/sign-in"} />}
        /> 
        <Route
          path="/:username/post/:postid"
          element={<PostPage authUser={authUser} />}
        /> 

        <Route
          path="/verify/user/:id/:token"
          element={<VerifyUser />}
        />
        <Route
          path="/forget-password"
          element={<ForgetPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>
      {authUser && !isChatApp && <FollowSuggestion />}
       <Toaster />
    </div>
  );
};

export default App;
