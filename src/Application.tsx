import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WithoutAuth } from "./Routes/Guard/NoGuard";
import { ErrorBoundary } from "./Components/Common/ErrorBoundary/Errorboundary";
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
import Balance from "./Components/Pages/Admin/Balance/Balance";
import Message from "./Components/Pages/Admin/Message/Message";
import Setting from "./Components/Pages/Admin/Setting/Setting";
import MyProfile from "./Components/Pages/Admin/MyProfile/MyProfile";
import Voting from "./Components/Pages/Admin/Voting/Voting";
import MyProfilePage from "./Components/Pages/Admin/MyProfile/MyProfilePage/MyProfilePage";
import { RequireAuth } from "./Routes/Guard/AuthGuard";
import TFA from "./Components/Common/2FA/TFA";
import PrivacyPolicy from "./Components/Pages/Admin/TermsAndConditions/Privacy";
import TermsAndConditions from "./Components/Pages/Admin/TermsAndConditions/TermsAndConditions";
import PendingAudits from "./Components/Pages/Admin/PendingAudits/PendingAudits";
import BidsTable from "./Components/Pages/Admin/MyProfile/MyProfilePage/MyBid/BidsTable";

const Application: React.FC = () => {
  /**GET STATES FROM STORE */

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <WithoutAuth>
          <MainLayout />
        </WithoutAuth>
      ),
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
      children: [],
    },
    {
      path: "privacyPolicy",
      element: <PrivacyPolicy />,
    },
    {
      path: "terms&&Conditons",
      element: <TermsAndConditions />,
    },
    {
      index: true,
      path: "/",
      element: <AdminLogin />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/register",
      element: (
        <WithoutAuth>
          <Register />
        </WithoutAuth>
      ),
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
          element: (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          ),
        },
        {
          path: "balance",
          element: (
            <RequireAuth>
              <Balance />
            </RequireAuth>
          ),
        },
        {
          path: "voting",
          element: (
            <RequireAuth>
              <Voting />
            </RequireAuth>
          ),
        },

        {
          path: "2fa",
          element: (
            <RequireAuth>
              <TFA />
            </RequireAuth>
          ),
        },
        {
          path: "dashboard-listing",
          element: (
            <RequireAuth>
              <DashboardListing />
            </RequireAuth>
          ),
        },
        {
          path: "audit-Request",
          element: (
            <RequireAuth>
              <Post />
            </RequireAuth>
          ),
        },
        {
          path: "message",
          element: <Message />,
        },
        {
          path: "settings",
          element: (
            <RequireAuth>
              <Setting />
            </RequireAuth>
          ),
        },
        {
          path: "my-bid",
          element: (
            <RequireAuth>
              <BidsTable />
            </RequireAuth>
          ),
        },

        {
          path: "my-profile",
          element: (
            <RequireAuth>
              <MyProfile />
            </RequireAuth>
          ),
        },
        {
          path: "my-profilepage",
          element: (
            <RequireAuth>
              <MyProfilePage />
            </RequireAuth>
          ),
        },
        {
          path: "pending-audits",
          element: (
            <RequireAuth>
              <PendingAudits />
            </RequireAuth>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Application;
