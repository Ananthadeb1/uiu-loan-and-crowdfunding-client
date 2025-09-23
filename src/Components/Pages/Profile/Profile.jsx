import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [error, setError] = useState('');

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

            console.log("User data received:", res.data); // Debug log

            // ✅ FIXED: Use uid instead of id, and use the correct endpoint
            if (res.data?.uid) {

              axiosSecure.get(`/userExtraInfo/${res.data.uid}`) // Changed endpoint
                .then(infoRes => {
                  console.log("Extra info received:", infoRes.data); // Debug log
                  setExtraInfo(infoRes.data);
                  setLoadingExtra(false);
                })
                .catch((error) => {
                  console.error("Error fetching extra info:", error);
                  setExtraInfo(null);
                  setLoadingExtra(false);
                });
            } else {
              console.log("No UID found in user data");
              setLoadingExtra(false); // Make sure to set loading to false even if no UID
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setError('Failed to load profile data. Please try again later.');
            setLoading(false);
            setLoadingExtra(false); // Also set loadingExtra to false on error
          });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, axiosSecure, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>{error}</div>}

      {/* Profile Header */}
      <div>
        <div>
          {userData?.image ? (
            <img
              src={userData.image}
              alt={userData.name}
              width={100}
              height={100}
            />
          ) : (
            <span>{userData?.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <button>Privacy</button><br /><br />
          <button>Verification</button><br /><br />
          <button>Loan Status</button><br /><br />
          <button>History</button><br /><br />
        </div>
      </div>

      {/* Account Information */}
      <div>
        <h1>Profile</h1>
        <div>
          <div>
            <p>{userData?.name || 'Not available'}</p>
          </div>
          <div>
            <p>{userData?.role === "donor" ? "Donor" : "Regular User"}</p>
          </div>
        </div>
      </div>

      {/* User's extra info */}
      <div className="extraInfo" style={{ marginTop: "20px" }}>
        <h2>Extra Info</h2>
        {loadingExtra ? (
          <p>Loading extra info...</p>
        ) : (
          <div>
            <p><strong>Name:</strong> {userData?.name || "Not available"}</p>
            <p><strong>Birthday:</strong> {extraInfo?.birthday || "Not available"}</p>
            <p><strong>Gender:</strong> {extraInfo?.gender || "Not available"}</p>
            <p><strong>Address:</strong> {extraInfo?.address || "Not available"}</p>

            {/* Update Button - Fixed to use uid */}
            <button onClick={() => navigate(`/update-info/${userData?.uid}`)}>
              Update Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;