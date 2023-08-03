import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WithoutAuth } from "./Routes/Guard/NoGuard";
import { ErrorBoundary } from "./Components/Common/ErrorBoundary/Errorboundary";
import Loader from "./Components/Common/Loader";
import MainLayout from "./Components/Common/MainLayout/MainLayout";
import ErrorPage from "./Components/Pages/ErrorPage/ErrorPage";
import ContactUs from "./Components/Pages/ContactUs/ContactUs";
import Dashboard from "./Components/Pages/Admin/Dashboard/Dashboard";
import AuthLayout from "./Components/Common/AuthLayout/AuthLayout";
import AdminLogin from "./Components/Pages/Admin/Login/Login";
import Register from "./Components/Pages/Admin/Login/Register";
import OtpRegistration from "./Components/Pages/Admin/Login/OtpRegistration";
import DashboardListing from "./Components/Pages/Admin/Dashboard/DashboardListing/DashboardListing";
import Post from "./Components/Pages/Admin/Post/Post";
import { WsProvider } from "@polkadot/rpc-provider";
import { ApiPromise } from "@polkadot/api";
import Balance from "./Components/Pages/Admin/Balance/Balance";
import Message from "./Components/Pages/Admin/Message/Message";
import Setting from "./Components/Pages/Admin/Setting/Setting";
import MyProfile from "./Components/Pages/Admin/MyProfile/MyProfile";
import Voting from "./Components/Pages/Admin/Voting/Voting";
import MyProfilePage from "./Components/Pages/Admin/MyProfile/MyProfilePage/MyProfilePage";
import TFA from "./Components/Common/2FA/TFA";

const Application: React.FC = () => {

  /**GET STATES FROM STORE */
  const [api, setApi] = useState<ApiPromise>();

  useEffect(() => {
    const provider = new WsProvider("wss://rpc.shibuya.astar.network");
    setApi(new ApiPromise({ provider }));
  }, []);

  useEffect(() => {
    if (api) {
      api.isReady
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [api]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "contact-us",
          element: (
            <WithoutAuth>
              <ContactUs />
            </WithoutAuth>
          ),
        },
        {
          path: "contact-us",
          element: (
            <WithoutAuth>
              <ContactUs />
            </WithoutAuth>
          ),
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },

    {
      path: "/auth",
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
      ],
    },

    {
      index: true,
      path: "/",
      element: 
        (
          <WithoutAuth>
            <AdminLogin />
          </WithoutAuth>
        ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/otp",
      element: <OtpRegistration />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "admin",
      element: <AuthLayout heading={undefined} />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "balance",
          element:  <Balance />,
        },
        {
          path: "voting",
          element: <Voting />,
        },
        {
          path: "tfa",
          element: <TFA />,
        },
        {
          path: "dashboard-listing",
          element:  <DashboardListing />,
        },
        {
          path: "audit-Request",
          element: <Post />
        },
        {
          path: "message",
          element: <Message />,
        },
        {
          path: "settings",
          element: <Setting />,
        },
        {
          path: "MyProfile",
          element:<MyProfile />
        },
        {
          path: "my-profilepage",
          element: <MyProfilePage />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </>
  );
};

export default Application;
