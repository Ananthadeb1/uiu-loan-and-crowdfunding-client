import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../../Hooks/useAdmin';

const AdminVerification = () => {
    const [isAdmin] = useAdmin();
    const navigate = useNavigate();

    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [rejectedUsers, setRejectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Check if user is admin, redirect if not
    useEffect(() => {
        if (!isAdmin) {
            alert('Access denied. Only admins can view this page.');
            navigate('/');
            return;
        }
    }, [isAdmin, navigate]);

    // Fetch all verification requests
    useEffect(() => {
        if (!isAdmin) return;

        const fetchVerificationRequests = async () => {
            try {
                setLoading(true);

                // In a real app, you'd fetch from your API
                // For demo, we'll use localStorage to simulate data

                // Get all users from localStorage (in real app, from database)
                const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');

                // Filter pending verifications
                const pending = allUsers.filter(u =>
                    localStorage.getItem(`verification_${u.uid}`) === 'pending'
                );

                // Filter verified users
                const verified = allUsers.filter(u =>
                    localStorage.getItem(`verification_${u.uid}`) === 'verified'
                );

                // Filter rejected users
                const rejected = allUsers.filter(u =>
                    localStorage.getItem(`verification_${u.uid}`) === 'rejected'
                );

                setPendingVerifications(pending);
                setVerifiedUsers(verified);
                setRejectedUsers(rejected);

            } catch (error) {
                console.error('Error fetching verification requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVerificationRequests();
    }, [isAdmin]);

    // Approve verification
    const approveVerification = async (userId) => {
        setActionLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update verification status
            localStorage.setItem(`verification_${userId}`, 'verified');

            // Update local state
            const user = pendingVerifications.find(u => u.uid === userId);
            setPendingVerifications(prev => prev.filter(u => u.uid !== userId));
            setVerifiedUsers(prev => [...prev, user]);

            alert('User verification approved successfully!');

        } catch (error) {
            console.error('Error approving verification:', error);
            alert('Failed to approve verification');
        } finally {
            setActionLoading(false);
            setSelectedUser(null);
        }
    };

    // Reject verification
    const rejectVerification = async (userId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setActionLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update verification status with rejection reason
            localStorage.setItem(`verification_${userId}`, 'rejected');
            localStorage.setItem(`rejection_reason_${userId}`, rejectionReason);

            // Update local state
            const user = pendingVerifications.find(u => u.uid === userId);
            setPendingVerifications(prev => prev.filter(u => u.uid !== userId));
            setRejectedUsers(prev => [...prev, { ...user, rejectionReason }]);

            alert('User verification rejected!');
            setRejectionReason('');

        } catch (error) {
            console.error('Error rejecting verification:', error);
            alert('Failed to reject verification');
        } finally {
            setActionLoading(false);
            setSelectedUser(null);
        }
    };

    // Request more information
    const requestMoreInfo = async (userId) => {
        setActionLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update verification status
            localStorage.setItem(`verification_${userId}`, 'additional_info');

            // Update local state
            setPendingVerifications(prev => prev.filter(u => u.uid !== userId));

            alert('Requested more information from user!');

        } catch (error) {
            console.error('Error requesting more info:', error);
            alert('Failed to request more information');
        } finally {
            setActionLoading(false);
            setSelectedUser(null);
        }
    };

    // Get user verification documents (simulated)
    const getUserDocuments = (userId) => {
        // In real app, fetch from database
        return {
            nidNumber: localStorage.getItem(`nid_${userId}`) || 'Not provided',
            documents: ['NID Front', 'NID Back', 'Selfie Photo'] // Simulated documents
        };
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-red-600 mb-4">Access Denied</div>
                    <p className="text-gray-600">Only administrators can access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl">Loading verification requests...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">User Verification Management</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Review and manage user verification requests as an administrator
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingVerifications.length}</div>
                        <div className="text-lg font-semibold text-gray-900">Pending Review</div>
                        <div className="text-sm text-gray-600">Awaiting approval</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">{verifiedUsers.length}</div>
                        <div className="text-lg font-semibold text-gray-900">Verified Users</div>
                        <div className="text-sm text-gray-600">Successfully verified</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">{rejectedUsers.length}</div>
                        <div className="text-lg font-semibold text-gray-900">Rejected</div>
                        <div className="text-sm text-gray-600">Verification rejected</div>
                    </div>
                </div>

                {/* Pending Verifications */}
                <div className="bg-white rounded-lg shadow-lg mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Pending Verification Requests</h2>
                        <p className="text-gray-600 mt-1">Review and take action on pending requests</p>
                    </div>

                    {pendingVerifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-500 text-lg mb-2">No pending verification requests</div>
                            <p className="text-gray-400">All verification requests have been processed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {pendingVerifications.map((user) => (
                                <div key={user.uid} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-600 font-semibold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                    <p className="text-gray-600">{user.email}</p>
                                                    <p className="text-sm text-gray-500">User ID: {user.uid}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Submitted Documents:</span>
                                                    <div className="mt-1 space-y-1">
                                                        {getUserDocuments(user.uid).documents.map((doc, index) => (
                                                            <div key={index} className="flex items-center text-green-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                {doc}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">NID Number:</span>
                                                    <div className="font-mono text-gray-900">{getUserDocuments(user.uid).nidNumber}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => approveVerification(user.uid)}
                                                disabled={actionLoading}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                disabled={actionLoading}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => requestMoreInfo(user.uid)}
                                                disabled={actionLoading}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 text-sm font-medium"
                                            >
                                                More Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Verified Users */}
                <div className="bg-white rounded-lg shadow-lg mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Verified Users</h2>
                        <p className="text-gray-600 mt-1">Users who have been successfully verified</p>
                    </div>

                    {verifiedUsers.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-500 text-lg">No verified users yet</div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {verifiedUsers.map((user) => (
                                <div key={user.uid} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-600 font-semibold">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                                <p className="text-gray-600 text-sm">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Verification</h2>
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting {selectedUser.name}'s verification:
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason (e.g., Blurry documents, Missing information, etc.)"
                                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                                required
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => rejectVerification(selectedUser.uid)}
                                    disabled={actionLoading || !rejectionReason.trim()}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400"
                                >
                                    {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                                </button>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerification;