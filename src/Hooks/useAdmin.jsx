
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin = false, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading && !!user?.email && !!axiosSecure,
        queryFn: async () => {
            if (!user?.email) return false;
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data?.admin;
        },
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;