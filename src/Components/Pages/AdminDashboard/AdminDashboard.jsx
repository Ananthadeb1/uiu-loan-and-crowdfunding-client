import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAdmin from '../../../Hooks/useAdmin';

const AdminDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [isAdmin] = useAdmin();

    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [offers, setOffers] = useState([]);
    const [fundraising, setFundraising] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            alert('Access denied. Only admins can view this page.');
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, [isAdmin, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // FIX: Use absolute paths and handle errors properly
            const [usersResponse, loansResponse, offersResponse, fundraisingResponse] = await Promise.all([
                axiosSecure.get('/users').catch(err => {
                    console.log('Users API error:', err);
                    return { data: [] };
                }),
                axiosSecure.get('/api/loans').catch(err => {
                    console.log('Loans API error:', err);
                    return { data: { data: [] } };
                }),
                axiosSecure.get('/api/offers').catch(err => {
                    console.log('Offers API error:', err);
                    return { data: { data: [] } };
                }),
                axiosSecure.get('/fundraise').catch(err => {
                    console.log('Fundraising API error:', err);
                    return { data: [] };
                })
            ]);

            // FIX: Set data with proper fallbacks
            setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
            setLoans(Array.isArray(loansResponse.data?.data) ? loansResponse.data.data : []);
            setOffers(Array.isArray(offersResponse.data?.data) ? offersResponse.data.data : []);
            setFundraising(Array.isArray(fundraisingResponse.data) ? fundraisingResponse.data : []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // FIX: Set empty arrays on error
            setUsers([]);
            setLoans([]);
            setOffers([]);
            setFundraising([]);
        } finally {
            setLoading(false);
        }
    };

    const makeUserAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to make this user an admin?')) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await axiosSecure.patch(`/users/admin/${userId}`);

            if (response.data.modifiedCount > 0) {
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u._id === userId ? { ...u, role: 'admin' } : u
                    )
                );
                alert('User role updated to admin successfully!');
            }
        } catch (error) {
            console.error('Error making user admin:', error);
            alert('Failed to update user role');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await axiosSecure.delete(`/users/${userId}`);

            if (response.data.deletedCount > 0) {
                setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
                alert('User deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    // Dashboard statistics - FIX: Add proper fallbacks
    const stats = {
        totalUsers: users?.length || 0,
        totalLoans: loans?.length || 0,
        totalOffers: offers?.length || 0,
        totalFundraising: fundraising?.length || 0,
        pendingLoans: loans?.filter(loan => loan.status === 'pending')?.length || 0,
        pendingVerifications: users?.filter(u => localStorage.getItem(`verification_${u.uid}`) === 'pending')?.length || 0
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl">Loading Admin Dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your platform and users</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Admin
                            </span>
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'users', label: 'View Users' },
                            { id: 'loans', label: 'Loan Management' }, // ADD THIS BACK
                            
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="px-4 py-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                                        <div className="text-sm text-gray-600">Total Users</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v1m0-1v1m6-13a2 2 0 11-4 0 2 2 0 014 0zM6 18a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalLoans}</div>
                                        <div className="text-sm text-gray-600">Total Loans</div>
                                        <div className="text-xs text-yellow-600">{stats.pendingLoans} pending</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</div>
                                        <div className="text-sm text-gray-600">Pending Verifications</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                >
                                    Manage Users
                                </button>
                                <button
                                    onClick={() => setActiveTab('loans')}
                                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                                >
                                    Manage Loans
                                </button>
                                <button
                                    onClick={() => navigate('/admin/verification')}
                                    className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
                                >
                                    Verify Users
                                </button>
                                <button
                                    onClick={fetchDashboardData}
                                    className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="px-4 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                            <div className="text-sm text-gray-600">
                                Total: {stats.totalUsers} users
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            {stats.totalUsers === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="text-gray-500 text-lg mb-4">No users found in the system</div>
                                    <button
                                        onClick={fetchDashboardData}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Refresh Data
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((userItem) => (
                                                <tr key={userItem._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                {userItem.image ? (
                                                                    <img
                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                        src={userItem.image}
                                                                        alt={userItem.name}
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                                        <span className="text-gray-600 font-medium">
                                                                            {userItem.name?.charAt(0).toUpperCase() || 'U'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {userItem.name || 'No Name'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {userItem.uid?.substring(0, 8)}...
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{userItem.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : userItem.role === 'donor'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {userItem.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.role === 'admin' || localStorage.getItem(`verification_${userItem.uid}`) === 'verified'
                                                            ? 'bg-green-100 text-green-800'
                                                            : localStorage.getItem(`verification_${userItem.uid}`) === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {userItem.role === 'admin' || localStorage.getItem(`verification_${userItem.uid}`) === 'verified'
                                                                ? 'Verified'
                                                                : localStorage.getItem(`verification_${userItem.uid}`) === 'pending'
                                                                    ? 'Pending'
                                                                    : 'Not Verified'
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            {userItem.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => makeUserAdmin(userItem._id)}
                                                                    disabled={actionLoading}
                                                                    className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                                                                >
                                                                    Make Admin
                                                                </button>
                                                            )}
                                                            {userItem.email !== user?.email && (
                                                                <button
                                                                    onClick={() => deleteUser(userItem._id, userItem.name || userItem.email)}
                                                                    disabled={actionLoading}
                                                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors disabled:bg-red-400"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Loans Tab */}
                {activeTab === 'loans' && (
                    <div className="px-4 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
                            <div className="text-sm text-gray-600">
                                Total: {stats.totalLoans} loans | Pending: {stats.pendingLoans}
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            {loans.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="text-gray-500 text-lg mb-4">No loan requests found</div>
                                    <button
                                        onClick={fetchDashboardData}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Refresh Data
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Borrower
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Purpose
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Term
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Requested
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {loans.map((loan) => (
                                                <tr key={loan._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                                <span className="text-gray-600 font-medium">
                                                                    {loan.userName?.charAt(0).toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {loan.userName || 'Anonymous'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {loan.userEmail}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{loan.purpose}</div>
                                                        {loan.description && (
                                                            <div className="text-xs text-gray-500 truncate max-w-xs">
                                                                {loan.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {loan.loanAmount?.toLocaleString()} TK
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{loan.repaymentTime} months</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                        loan.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                                                                            loan.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1) || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {loan.requestedAt ? new Date(loan.requestedAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Loan Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalLoans}</div>
                                <div className="text-sm text-gray-600">Total Loans</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.pendingLoans}</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {loans.filter(loan => loan.status === 'approved').length}
                                </div>
                                <div className="text-sm text-gray-600">Approved</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {loans.filter(loan => loan.status === 'rejected').length}
                                </div>
                                <div className="text-sm text-gray-600">Rejected</div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Rest of your tabs remain the same */}
            </div>
        </div>
    );
};

export default AdminDashboard;