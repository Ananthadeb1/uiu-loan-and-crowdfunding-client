import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { 
    FaUsers, 
    FaUserShield, 
    FaHandHoldingHeart, 
    FaFileInvoiceDollar, 
    FaTrashAlt, 
    FaUserPlus, 
    FaSearch, 
    FaCheckCircle, 
    FaTimesCircle,
    FaExclamationTriangle
} from "react-icons/fa";

const Dashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [deleteModalUser, setDeleteModalUser] = useState(null);
    const [actionMessage, setActionMessage] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch all users
    const { data: users = [], refetch: refetchUsers, isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        }
    });

    // Fetch crowdfunding applications
    const { data: fundraiseApps = [], refetch: refetchFundraise, isLoading: loadingFundraise } = useQuery({
        queryKey: ["fundraiseApps"],
        queryFn: async () => {
            const res = await axiosSecure.get("/fundraise");
            return res.data;
        }
    });

    // Fetch loan requests
    const { data: loanRequests = [], refetch: refetchLoans, isLoading: loadingLoans } = useQuery({
        queryKey: ["loanRequests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/loanRequest");
            return res.data;
        }
    });

    // Make Admin handler
    const handleMakeAdmin = async (user) => {
        try {
            const res = await axiosSecure.patch(`/users/admin/${user._id}`);
            if (res.data.modifiedCount > 0) {
                setActionMessage({ type: "success", text: `${user.name || user.email} is now an Admin!` });
                refetchUsers();
            } else {
                setActionMessage({ type: "info", text: `User is already an Admin.` });
            }
        } catch (err) {
            console.error("Error making user admin:", err);
            setActionMessage({ type: "error", text: "Failed to grant admin rights." });
        }
        setTimeout(() => setActionMessage(null), 4000);
    };

    // Delete User handler (Deletes from DB and Firebase)
    const handleDeleteUserConfirm = async () => {
        if (!deleteModalUser) return;
        setIsDeleting(true);
        try {
            const res = await axiosSecure.delete(`/users/${deleteModalUser._id}`);
            if (res.data.success || res.data.deletedCount > 0 || res.data.result?.deletedCount > 0) {
                const fbStatus = res.data.firebaseDeleted 
                    ? "and Firebase Authentication" 
                    : "(MongoDB record removed; Firebase record sync completed)";
                setActionMessage({ 
                    type: "success", 
                    text: `User ${deleteModalUser.name || deleteModalUser.email} successfully deleted from Database ${fbStatus}.` 
                });
                refetchUsers();
            } else {
                setActionMessage({ type: "error", text: res.data.message || "Failed to delete user." });
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            setActionMessage({ type: "error", text: err.response?.data?.message || "Error occurred while deleting user." });
        } finally {
            setIsDeleting(false);
            setDeleteModalUser(null);
            setTimeout(() => setActionMessage(null), 5000);
        }
    };

    // Update Loan / Fundraise Status
    const handleUpdateStatus = async (type, id, status) => {
        try {
            const endpoint = type === 'loan' ? `/loanRequest/${id}` : `/fundraise/${id}`;
            await axiosSecure.patch(endpoint, { status });
            setActionMessage({ type: "success", text: `Status updated to ${status}!` });
            if (type === 'loan') refetchLoans();
            else refetchFundraise();
        } catch (err) {
            console.error("Status update error:", err);
            setActionMessage({ type: "error", text: "Failed to update status." });
        }
        setTimeout(() => setActionMessage(null), 3000);
    };

    // Filter users
    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Counts
    const adminCount = users.filter(u => u.role === "admin").length;
    const donorCount = users.filter(u => u.role === "donor").length;
    const regularUserCount = users.filter(u => u.role !== "admin" && u.role !== "donor").length;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Dashboard Title Banner */}
                <div className="bg-gradient-to-r from-[#0A7265] to-[#129A88] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span className="bg-[#F9D56E] text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Admin Control Center
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-emerald-100 text-sm mt-1">
                            Manage system users, crowdfunding projects, and loan requests.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <div className="w-10 h-10 rounded-full bg-[#F9D56E] text-[#0A7265] font-bold flex items-center justify-center text-lg shadow">
                            {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{currentUser?.name || "Admin User"}</p>
                            <p className="text-xs text-emerald-200">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>

                {/* System Action Messages Banner */}
                {actionMessage && (
                    <div className={`p-4 rounded-xl shadow-md border flex items-center justify-between transition-all ${
                        actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        actionMessage.type === 'error' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-blue-50 text-blue-800 border-blue-300'
                    }`}>
                        <div className="flex items-center space-x-3">
                            {actionMessage.type === 'success' && <FaCheckCircle className="text-emerald-600 text-xl" />}
                            {actionMessage.type === 'error' && <FaTimesCircle className="text-red-600 text-xl" />}
                            <span className="font-medium text-sm">{actionMessage.text}</span>
                        </div>
                        <button onClick={() => setActionMessage(null)} className="text-gray-500 hover:text-gray-800 font-bold text-lg">&times;</button>
                    </div>
                )}

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className="p-4 bg-teal-50 rounded-xl text-[#0A7265]">
                            <FaUsers className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Users</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{users.length}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{regularUserCount} Regular • {donorCount} Donors</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
                            <FaUserShield className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Administrators</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{adminCount}</h3>
                            <p className="text-xs text-amber-600 mt-0.5">Full System Privilege</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600">
                            <FaHandHoldingHeart className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crowdfund Projects</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{fundraiseApps.length}</h3>
                            <p className="text-xs text-indigo-600 mt-0.5">Community Campaigns</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
                            <FaFileInvoiceDollar className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan Requests</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{loanRequests.length}</h3>
                            <p className="text-xs text-emerald-600 mt-0.5">Borrower Applications</p>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content Box */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                    
                    {/* Navigation Tabs Header */}
                    <div className="flex border-b border-slate-200 bg-slate-100/70 p-2 gap-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all ${
                                activeTab === "users"
                                    ? "bg-white text-[#0A7265] shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                            }`}
                        >
                            <FaUsers />
                            <span>User Management ({users.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("fundraise")}
                            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all ${
                                activeTab === "fundraise"
                                    ? "bg-white text-[#0A7265] shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                            }`}
                        >
                            <FaHandHoldingHeart />
                            <span>Crowdfunding Apps ({fundraiseApps.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("loans")}
                            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all ${
                                activeTab === "loans"
                                    ? "bg-white text-[#0A7265] shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                            }`}
                        >
                            <FaFileInvoiceDollar />
                            <span>Loan Requests ({loanRequests.length})</span>
                        </button>
                    </div>

                    {/* Tab 1: User Management */}
                    {activeTab === "users" && (
                        <div className="p-6 space-y-6">
                            
                            {/* Controls: Search & Filter */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="relative w-full sm:w-80">
                                    <FaSearch className="absolute left-3.5 top-3.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                    />
                                </div>

                                <div className="flex items-center space-x-3 w-full sm:w-auto">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Role Filter:</span>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admins Only</option>
                                        <option value="donor">Donors Only</option>
                                        <option value="user">Regular Users</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users Table */}
                            {loadingUsers ? (
                                <div className="py-12 text-center text-slate-500">
                                    <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
                                    <p className="mt-2 text-sm">Loading users list...</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 border border-dashed rounded-xl">
                                    <p className="font-semibold">No users found matching filter criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="py-3.5 px-4">User</th>
                                                <th className="py-3.5 px-4">Email</th>
                                                <th className="py-3.5 px-4">Role</th>
                                                <th className="py-3.5 px-4">Firebase UID</th>
                                                <th className="py-3.5 px-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {filteredUsers.map((u) => (
                                                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center space-x-3">
                                                            {u.image ? (
                                                                <img src={u.image} alt={u.name} className="w-9 h-9 rounded-full object-cover border" />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                                                                    {u.name?.charAt(0).toUpperCase() || 'U'}
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-slate-800">{u.name || "N/A"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{u.email}</td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                            u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                            u.role === 'donor' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                                                            'bg-slate-100 text-slate-700 border border-slate-300'
                                                        }`}>
                                                            {u.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 truncate max-w-[150px]">
                                                        {u.uid || u._id}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleMakeAdmin(u)}
                                                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                                                    title="Promote to Admin"
                                                                >
                                                                    <FaUserPlus />
                                                                    <span>Make Admin</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => setDeleteModalUser(u)}
                                                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                                                title="Delete User from DB & Firebase"
                                                            >
                                                                <FaTrashAlt />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Crowdfunding Applications */}
                    {activeTab === "fundraise" && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Crowdfunding Applications</h2>
                            {loadingFundraise ? (
                                <div className="py-12 text-center text-slate-500">
                                    <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
                                </div>
                            ) : fundraiseApps.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 border border-dashed rounded-xl">
                                    <p className="font-semibold">No crowdfunding applications received yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {fundraiseApps.map((app) => (
                                        <div key={app._id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">{app.name || app.title || "Crowdfund Project"}</h3>
                                                    <p className="text-xs text-slate-500">{app.email}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                    app.status?.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    app.status?.toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {app.status || 'Pending Review'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-2">{app.reason || app.description || app.story || "No description provided."}</p>
                                            <div className="flex justify-between items-center text-xs pt-2 border-t text-slate-500">
                                                <span>Target: <strong>${app.amount || app.targetAmount || 'N/A'}</strong></span>
                                                <span>Category: <strong>{app.category || 'General'}</strong></span>
                                            </div>
                                            <div className="flex space-x-2 pt-2">
                                                <button
                                                    onClick={() => handleUpdateStatus('fundraise', app._id, 'approved')}
                                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus('fundraise', app._id, 'rejected')}
                                                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Loan Requests */}
                    {activeTab === "loans" && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Loan Requests</h2>
                            {loadingLoans ? (
                                <div className="py-12 text-center text-slate-500">
                                    <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
                                </div>
                            ) : loanRequests.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 border border-dashed rounded-xl">
                                    <p className="font-semibold">No loan requests submitted yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase border-b">
                                            <tr>
                                                <th className="py-3.5 px-4">Requested Amount</th>
                                                <th className="py-3.5 px-4">Purpose</th>
                                                <th className="py-3.5 px-4">Repayment Term</th>
                                                <th className="py-3.5 px-4">Date</th>
                                                <th className="py-3.5 px-4">Status</th>
                                                <th className="py-3.5 px-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {loanRequests.map((loan) => (
                                                <tr key={loan._id} className="hover:bg-slate-50">
                                                    <td className="py-3.5 px-4 font-bold text-[#0A7265]">${loan.loanAmount}</td>
                                                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{loan.purpose}</td>
                                                    <td className="py-3.5 px-4 text-slate-600">{loan.repaymentTime} Months</td>
                                                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                                                        {loan.requestedAt ? new Date(loan.requestedAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                                            loan.status?.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                            loan.status?.toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                                            'bg-amber-100 text-amber-800'
                                                        }`}>
                                                            {loan.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleUpdateStatus('loan', loan._id, 'approved')}
                                                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus('loan', loan._id, 'rejected')}
                                                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Modal: Delete User Confirmation */}
            {deleteModalUser && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center space-x-3 text-rose-600">
                            <FaExclamationTriangle className="text-3xl" />
                            <h3 className="text-xl font-extrabold">Confirm User Deletion</h3>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 bg-rose-50 p-4 rounded-xl border border-rose-200">
                            <p className="font-semibold text-slate-800">
                                Are you sure you want to permanently delete user:
                            </p>
                            <p className="font-mono text-slate-900 font-bold">{deleteModalUser.name || "User"} ({deleteModalUser.email})</p>
                            <p className="text-xs text-rose-700 pt-2 border-t border-rose-200">
                                ⚠️ <strong>Important:</strong> This action will delete the user account from <strong>MongoDB Database</strong> and <strong>Firebase Authentication</strong>. This cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-2">
                            <button
                                onClick={() => setDeleteModalUser(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUserConfirm}
                                disabled={isDeleting}
                                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition flex items-center space-x-2 shadow-md"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrashAlt />
                                        <span>Delete from DB & Firebase</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
