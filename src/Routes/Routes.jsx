import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Main from "../Layout/Main";
import Login from "../Ragistration/Login/Login";
import Signup from "../Ragistration/Signup/Signup";
import Profile from "../Components/Pages/Profile/Profile";
import PrivateRoute from "../Shared/PriveteRoute/privateRoute";
import UpdateInfo from "../Components/Pages/Profile/UpdateInfo";

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
                path: "/profile",
                element: <Profile></Profile>
            },{
                path: "/update-info/:id", // ✅ add id param
                element: <PrivateRoute><UpdateInfo /></PrivateRoute>
            }
        ],
    },
]);


