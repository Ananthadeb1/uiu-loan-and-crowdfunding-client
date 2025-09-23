
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add a small delay before checking authentication
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
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setError('Failed to load profile data. Please try again later.');
            setLoading(false);
          });
      }
    }, 300); // 300ms delay to allow auth context to initialize

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

      {/* User's extra info will be shared here*/}
      <div className="extraInfo"></div>
    </div>
  );
};

export default Profile;
