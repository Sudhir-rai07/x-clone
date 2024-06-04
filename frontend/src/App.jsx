import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";

import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import { useQuery } from "@tanstack/react-query";
import FollowSuggestion from "./components/common/FollowSuggestion";

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

  if (isLoading) return "Loading...";
  if (isError) return <h1>Error</h1>;
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/sign-up"} />}
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
      </Routes>
      {authUser && <FollowSuggestion />}
       <Toaster />
    </div>
  );
};

export default App;
