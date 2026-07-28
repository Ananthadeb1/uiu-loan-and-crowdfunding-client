import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUserCircle, FaCamera, FaIdCard, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user?.email) {
        axiosSecure.get(`/users/${user.email}`)
          .then(res => {
            setUserData(res.data);
            setLoading(false);
            setError('');

            const userIdToFetch = res.data?.uid || res.data?._id;
            if (userIdToFetch) {
              axiosSecure.get(`/userExtraInfo/${userIdToFetch}`)
                .then(infoRes => {
                  setExtraInfo(infoRes.data);
                  setLoadingExtra(false);
                })
                .catch((error) => {
                  console.error("Error fetching extra info:", error);
                  setExtraInfo(null);
                  setLoadingExtra(false);
                });
            } else {
              setLoadingExtra(false);
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setError('Failed to load profile data. Please try again later.');
            setLoading(false);
            setLoadingExtra(false);
          });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, axiosSecure, navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userData?.uid || userData?._id);
      formData.append('email', userData.email);

      const uploadResponse = await axiosSecure.post('/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUserData = { ...userData, image: uploadResponse.data.imageUrl };
      setUserData(updatedUserData);

      await axiosSecure.patch(`/users/${userData.email}`, {
        image: uploadResponse.data.imageUrl
      });

      alert('Profile image updated successfully!');

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleImageClick = () => {
    document.getElementById('profile-image-input').click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900">User Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account details and student identification.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              {userData?.image ? (
                <img
                  src={userData.image}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-md group-hover:opacity-90 transition"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-teal-50 border-4 border-slate-100 flex items-center justify-center text-4xl font-extrabold text-[#0A7265] shadow-md">
                  {userData?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-2xl" />
              </div>
            </div>

            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />

            <button
              onClick={handleImageClick}
              disabled={uploading}
              className="px-4 py-1.5 bg-[#0A7265] hover:bg-[#075349] text-white text-xs font-bold rounded-lg transition shadow-sm"
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{userData?.name || "Student User"}</h2>
              <p className="text-slate-500 text-sm font-medium">{userData?.email}</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-teal-100 text-[#0A7265] border border-teal-200">
                Role: {userData?.role === "donor" ? "Donor / Lender" : userData?.role === "admin" ? "Admin" : "Regular Student User"}
              </span>
              {extraInfo?.studentId && (
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  Student ID: {extraInfo.studentId}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Additional Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center space-x-2">
              <FaIdCard className="text-[#0A7265]" />
              <span>Additional Information</span>
            </h3>
            <button
              onClick={() => navigate(`/update-info/${userData?.uid || userData?._id}`)}
              className="px-4 py-2 bg-[#0A7265] hover:bg-[#075349] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <FaEdit />
              <span>Update Info</span>
            </button>
          </div>

          {loadingExtra ? (
            <p className="text-slate-500 text-sm">Loading details...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaIdCard className="text-xl text-[#0A7265]" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Student ID</p>
                  <p className="font-extrabold text-slate-800 text-base">{extraInfo?.studentId || "Not Added Yet"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaCalendarAlt className="text-xl text-teal-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Birthday</p>
                  <p className="font-semibold text-slate-800">{extraInfo?.birthday || "Not available"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaVenusMars className="text-xl text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Gender</p>
                  <p className="font-semibold text-slate-800">{extraInfo?.gender || "Not available"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaMapMarkerAlt className="text-xl text-rose-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Address</p>
                  <p className="font-semibold text-slate-800">{extraInfo?.address || "Not available"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;