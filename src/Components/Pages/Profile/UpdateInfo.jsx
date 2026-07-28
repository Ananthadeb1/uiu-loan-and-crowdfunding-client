import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaIdCard, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";

const UpdateInfo = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        studentId: "",
        birthday: "",
        gender: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                navigate('/login');
                return;
            }
            setAuthChecked(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    useEffect(() => {
        if (!authChecked || !id) return;

        axiosSecure
            .get(`/userExtraInfo/${id}`)
            .then((res) => {
                if (res.data) {
                    setFormData({
                        studentId: res.data.studentId || "",
                        birthday: res.data.birthday || "",
                        gender: res.data.gender || "",
                        address: res.data.address || ""
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching extra info:", error);
                setError('Failed to load existing information');
                setLoading(false);
            });
    }, [id, axiosSecure, authChecked]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please log in to update information");
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await axiosSecure.post(`/userExtraInfo/${id}`, formData);

            if (result.data.success || result.data.result) {
                alert("Information updated successfully!");
                navigate("/profile");
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Error updating info:", error);
            setError('Failed to update information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900">Update Additional Information</h1>
                    <p className="text-slate-500 text-sm mt-1">Add your Student ID and personal details for verification.</p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
                        {error}
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    {loading ? (
                        <div className="py-8 text-center text-slate-500">
                            <span className="loading loading-spinner loading-md text-[#0A7265]"></span>
                            <p className="mt-2 text-xs">Loading form data...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Student ID */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1.5">
                                    <FaIdCard className="text-[#0A7265]" />
                                    <span>Student ID</span>
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g. 011211045"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                />
                                <p className="text-xs text-slate-400 mt-1">Enter your valid University Student ID number.</p>
                            </div>

                            {/* Birthday */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1.5">
                                    <FaCalendarAlt className="text-teal-600" />
                                    <span>Date of Birth</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1.5">
                                    <FaVenusMars className="text-indigo-600" />
                                    <span>Gender</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1.5">
                                    <FaMapMarkerAlt className="text-rose-600" />
                                    <span>Full Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address details"
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                                />
                            </div>

                            {/* Form Buttons */}
                            <div className="flex space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition flex items-center justify-center space-x-2"
                                >
                                    <FaTimes />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#0A7265] hover:bg-[#075349] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
                                >
                                    <FaSave />
                                    <span>{loading ? 'Saving...' : 'Save Information'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateInfo;