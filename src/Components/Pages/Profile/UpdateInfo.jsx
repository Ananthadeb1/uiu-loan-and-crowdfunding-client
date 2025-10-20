import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const UpdateInfo = () => {
    const { id } = useParams(); // user id comes from route /update-info/:id
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        birthday: "",
        gender: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const [error, setError] = useState('');

    // First check authentication
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                console.log("No user found, redirecting to login");
                navigate('/login');
                return;
            }
            setAuthChecked(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    // Fetch existing info only after auth is confirmed
    useEffect(() => {
        if (!authChecked || !id) return;

        console.log("Fetching extra info for user ID:", id);

        // ✅ UPDATED: Use new endpoint path
        axiosSecure
            .get(`/api/profile/userExtraInfo/${id}`)
            .then((res) => {
                console.log("Extra info received:", res.data);
                if (res.data) {
                    setFormData({
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
            // ✅ UPDATED: Use new endpoint path
            const result = await axiosSecure.post(`/api/profile/userExtraInfo/${id}`, formData);

            console.log("Update result:", result.data);

            if (result.data.success) {
                alert("✅ Information updated successfully!");
                navigate("/profile");
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Error updating info:", error);
            setError('❌ Failed to update information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth
    if (!authChecked) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>Checking authentication...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Update Extra Information</h2>

            {error && (
                <div style={{
                    color: 'red',
                    padding: '10px',
                    border: '1px solid red',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    backgroundColor: '#ffe6e6'
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading form...</p>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Birthday:
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Gender:
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Address:
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your full address"
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: loading ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                flex: 1
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Information'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdateInfo;