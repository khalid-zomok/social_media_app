import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Notfound/Notfound";
import Home from "./components/Home/Home";
import CounterContextProvider from "./Context/CounterContext";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PostProtectedRoute from "./components/PostProtectedRoute/PostProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./components/PostDetails/PostDetails";
import { ToastContainer, toast } from "react-toastify";
import { useNetworkState } from "react-use";
import Notification from './components/Notification/Notification';

const query = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            {" "}
            <Home />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            {" "}
            <Home />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            {" "}
            <PostDetails />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "Profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PostProtectedRoute>
            <Login />
          </PostProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PostProtectedRoute>
            <Register />{" "}
          </PostProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online && (
        <div className="fixed inset-0 bg-slate-900/75 text-white z-50 flex justify-center items-center">
          <h1 className="font-bold text-4xl">🔴 You are Offline...!</h1>
        </div>
      )}
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <HeroUIProvider>
            <CounterContextProvider>
              <RouterProvider router={router}> </RouterProvider>
              <ToastContainer />
            </CounterContextProvider>
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
