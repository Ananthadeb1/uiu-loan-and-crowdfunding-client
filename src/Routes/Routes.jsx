import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);


