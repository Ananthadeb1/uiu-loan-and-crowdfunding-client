import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Main from "../Layout/Main";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import Profile from "../Components/Pages/Profile/Profile";
import PrivateRoute from "../Shared/PriveteRoute/privateRoute";
import UpdateInfo from "../Components/Pages/Profile/UpdateInfo";
import CrowdFunding from "../Components/Pages/CrowdFunding/CrowdFunding";
import LoanRequest from "../Components/Pages/LoanRequest/LoanRequest";
import LoanBidding from "../Components/Pages/LoanBidding/LoanBidding";
import LoanStatus from "../Components/Pages/LoanStatus/LoanStatus";
import History from "../Components/Pages/History/History";
import Verification from '../Components/Pages/Verification/Verification';
import AdminVerification from '../Components/Pages/AdminVerification/AdminVerification';
import AdminDashboard from '../Components/Pages/AdminDashboard/AdminDashboard';
import LoanComparison from "../Components/Pages/LoanComparison/LoanComparison"; // ADDED

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <Signup></Signup>
      },
      {
        path: "/crowdfunding",
        element: <PrivateRoute><CrowdFunding></CrowdFunding></PrivateRoute>
      },
      {
        path: "/loan-request",
        element: <PrivateRoute><LoanRequest></LoanRequest></PrivateRoute>
      },
      {
        path: "/loan-comparison", // ADDED
        element: <PrivateRoute><LoanComparison></LoanComparison></PrivateRoute>
      },
      {
        path: "/update-info/:id",
        element: <PrivateRoute><UpdateInfo /></PrivateRoute>
      },
      {
        path: "/profile",
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      },
      {
        path: "/loan-bidding",
        element: <PrivateRoute><LoanBidding /></PrivateRoute>
      },
      {
        path: '/loan-status',
        element: (
          <PrivateRoute>
            <LoanStatus />
          </PrivateRoute>
        )
      },
      {
        path: '/history',
        element: (
          <PrivateRoute>
            <History />
          </PrivateRoute>
        )
      },
      {
        path: '/verification',
        element: (
          <PrivateRoute>
            <Verification />
          </PrivateRoute>
        )
      },
      {
        path: '/admin/verification',
        element: (
          <PrivateRoute>
            <AdminVerification />
          </PrivateRoute>
        )
      },
      {
        path: '/admin/dashboard',
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        )
      }
    ],
  },
]);