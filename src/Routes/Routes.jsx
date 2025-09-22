import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Main from "../Layout/Main";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import CrowdFunding from "../Components/Pages/CrowdFunding/CrowdFunding";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/crowdfunding",
        element: <CrowdFunding />,
      },
    ],
  },
]);
