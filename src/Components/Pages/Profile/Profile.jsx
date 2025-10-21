import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAdmin from "../../../Hooks/useAdmin";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isAdmin] = useAdmin()




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

            if (res.data?.uid) {
              axiosSecure.get(`/api/profile/userExtraInfo/${res.data.uid}`)
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      console.log("Uploading actual image for user:", userData.email);

      // Create FormData to send the actual file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userData.uid);
      formData.append('email', userData.email);

      // Send the actual image file to server
      const uploadResponse = await axiosSecure.post('/api/users/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload response:", uploadResponse.data);

      if (uploadResponse.data.success) {
        // Update user data with the actual image URL
        const updatedUserData = {
          ...userData,
          image: uploadResponse.data.imageUrl
        };
        setUserData(updatedUserData);

        alert('Profile image updated successfully!');
      } else {
        throw new Error(uploadResponse.data.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image. Please try again.');
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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

      {/* Profile Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>

        {/* Image Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
            {userData?.image ? (
              <img
                src={userData.image}
                alt={userData.name}
                width={150}
                height={150}
                style={{
                  borderRadius: '50%', // ✅ ADD THIS FOR ROUNDED IMAGE
                  objectFit: 'cover',
                  border: '3px solid #e0e0e0'
                }}
              />
            ) : (
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%', // ✅ KEEP THIS FOR CONSISTENCY
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#666',
                border: '3px solid #e0e0e0'
              }}>
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Upload Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%', // ✅ MATCH THE BORDER RADIUS
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
              color: 'white',
              fontSize: '14px',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0'}>
              Click to Upload
            </div>
          </div>

          {/* Upload Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />

            <button
              onClick={() => document.getElementById('profile-image-input').click()}
              disabled={uploading}
              style={{
                padding: '8px 16px',
                backgroundColor: uploading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>

            <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              JPG, PNG, GIF • Max 2MB
            </span>
          </div>
        </div>

        {/* User Info Section */}
        <div style={{ flex: 1, minWidth: '300px', padding: '0 20px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{userData?.name}</h1>
          <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '1.1rem' }}>
            {userData?.email}
          </p>
          <span style={{
            padding: '6px 12px',
            backgroundColor: '#e0e0e0',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {userData?.role === "donor" ? "Donor" : "Admin"}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{
            padding: '10px 20px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Privacy
          </button>
          {/* Show Verification button only for non-admin users */}
          {!isAdmin && (
            <button
              onClick={() => navigate('/verification')}
              style={{
                padding: '10px 20px',
                border: '1px solid #ff9800',
                backgroundColor: '#ff9800',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Verification
            </button>
          )}

          {/* Show Admin Verification button for admins */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/verification')}
              style={{
                padding: '10px 20px',
                border: '1px solid #dc3545',
                backgroundColor: '#dc3545',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Verify Users
            </button>
          )}

          {/* Updated Loan Status Button */}
          <button
            onClick={() => navigate('/loan-status')}
            style={{
              padding: '10px 20px',
              border: '1px solid #007bff',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Loan Status
          </button>

          <button
            onClick={() => navigate('/history')}
            style={{
              padding: '10px 20px',
              border: '1px solid #28a745',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            History
          </button>
        </div>
      </div>

      {/* User's extra info */}
      <div style={{
        border: '1px solid #ddd',
        padding: '25px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0, borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
          Additional Information
        </h2>

        {loadingExtra ? (
          <p>Loading extra information...</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <strong>User ID:</strong>
              <span style={{ marginLeft: '10px', fontFamily: 'monospace' }}>
                {userData?.uid || "Not available"}
              </span>
            </div>
            <div>
              <strong>Birthday:</strong>
              <span style={{ marginLeft: '10px' }}>
                {extraInfo?.birthday || "Not available"}
              </span>
            </div>
            <div>
              <strong>Gender:</strong>
              <span style={{ marginLeft: '10px' }}>
                {extraInfo?.gender || "Not available"}
              </span>
            </div>
            <div>
              <strong>Address:</strong>
              <span style={{ marginLeft: '10px' }}>
                {extraInfo?.address || "Not available"}
              </span>
            </div>

            <button
              onClick={() => navigate(`/update-info/${userData?.uid}`)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '15px',
                width: 'fit-content'
              }}
            >
              Update Information
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;