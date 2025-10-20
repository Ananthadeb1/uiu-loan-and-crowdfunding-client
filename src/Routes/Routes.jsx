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
        path: "/update-info/:id",
        element: <PrivateRoute><UpdateInfo /></PrivateRoute>
      },
      {
        path:"/profile",
        element:<PrivateRoute><Profile></Profile></PrivateRoute>
      },
      {
        path: "/loan-bidding",
        element: <PrivateRoute><LoanBidding /></PrivateRoute>
}
    ],
  },
]);
