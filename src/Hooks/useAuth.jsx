import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth || {
        user: null,
        loading: true,
        profileUpdating: false,
        isAuthenticated: false,
        createUser: async () => {},
        login: async () => {},
        loginWithGoogle: async () => {},
        logout: async () => {},
        updateUserProfile: async () => {},
        setUser: () => {},
        fetchUserData: async () => {},
        axiosSecure: null,
    };
};

export default useAuth;