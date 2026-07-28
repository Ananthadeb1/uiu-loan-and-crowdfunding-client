import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";


const PrivateRoute = ({ children }) => {
    const auth = useContext(AuthContext);
    const { user, loading } = auth || { user: null, loading: true };
    const location = useLocation();
    if (loading) {
        return <progress className="progress w-56"></progress>
    }
    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;

};

export default PrivateRoute;