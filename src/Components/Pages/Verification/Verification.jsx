import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAdmin from '../../../Hooks/useAdmin';

const Verification = () => {
    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();


    const [verificationData, setVerificationData] = useState({
        nidNumber: '',
        nidFront: null,
        nidBack: null,
        selfiePhoto: null,
        addressProof: null,
        incomeProof: null
    });
    const [verificationStatus, setVerificationStatus] = useState('not_started');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [verificationHistory, setVerificationHistory] = useState([]);

    // Verification status options
    const statuses = {
        'not_started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800', description: 'Start your verification process' },
        'pending': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', description: 'Your documents are being reviewed' },
        'verified': { label: 'Verified', color: 'bg-green-100 text-green-800', description: 'Your account is fully verified' },
        'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', description: 'Please check the issues and resubmit' },
        'additional_info': { label: 'More Info Needed', color: 'bg-blue-100 text-blue-800', description: 'We need additional documents' }
    };

    // Redirect admins to admin verification page
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/verification');
            return;
        }
    }, [isAdmin, navigate]);

    // Fetch user verification status
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchVerificationStatus = async () => {
            try {
                // In a real app, you'd fetch from your API
                // const response = await axiosSecure.get(`/api/verification/${user.uid}`);

                // For demo, we'll use localStorage
                const savedStatus = localStorage.getItem(`verification_${user.uid}`);
                if (savedStatus) {
                    setVerificationStatus(savedStatus);
                }

                // Fetch verification history
                const history = JSON.parse(localStorage.getItem(`verification_history_${user.uid}`) || '[]');
                setVerificationHistory(history);

            } catch (error) {
                console.error('Error fetching verification status:', error);
            }
        };

        fetchVerificationStatus();
    }, [user, navigate, axiosSecure]);

    // Handle file upload
    const handleFileUpload = (fieldName, file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload only JPG, PNG, or PDF files');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        setVerificationData(prev => ({
            ...prev,
            [fieldName]: file
        }));

        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
        simulateUploadProgress(fieldName);
    };

    const simulateUploadProgress = (fieldName) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(prev => ({ ...prev, [fieldName]: progress }));

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
                }, 1000);
            }
        }, 100);
    };

    // Handle form submission
    const handleSubmitVerification = async (e) => {
        e.preventDefault();

        if (!verificationData.nidNumber) {
            alert('Please enter your NID number');
            return;
        }

        if (!verificationData.nidFront || !verificationData.nidBack || !verificationData.selfiePhoto) {
            alert('Please upload all required documents');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update verification status
            setVerificationStatus('pending');

            // Save to localStorage (in real app, send to backend)
            localStorage.setItem(`verification_${user.uid}`, 'pending');
            localStorage.setItem(`nid_${user.uid}`, verificationData.nidNumber);

            // Add to history
            const newHistoryEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                status: 'pending',
                documents: Object.keys(verificationData).filter(key => verificationData[key]),
                nidNumber: verificationData.nidNumber
            };

            const updatedHistory = [newHistoryEntry, ...verificationHistory];
            setVerificationHistory(updatedHistory);
            localStorage.setItem(`verification_history_${user.uid}`, JSON.stringify(updatedHistory));

            alert('Verification submitted successfully! Our admin team will review your documents within 24-48 hours.');

            // Reset form
            setVerificationData({
                nidNumber: '',
                nidFront: null,
                nidBack: null,
                selfiePhoto: null,
                addressProof: null,
                incomeProof: null
            });

        } catch (error) {
            console.error('Error submitting verification:', error);
            alert('Failed to submit verification. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get file preview URL
    const getFilePreview = (file) => {
        return file ? URL.createObjectURL(file) : null;
    };

    // Render file upload section
    const renderFileUpload = (fieldName, label, description, required = false) => {
        const file = verificationData[fieldName];
        const progress = uploadProgress[fieldName];

        return (
            <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <p className="text-sm text-gray-600 mb-3">{description}</p>

                {!file ? (
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-gray-500">JPG, PNG, PDF (MAX. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(fieldName, e.target.files[0])}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {progress !== null && progress < 100 && (
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setVerificationData(prev => ({ ...prev, [fieldName]: null }))}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Remove
                            </button>
                            {file.type.startsWith('image/') && (
                                <button
                                    type="button"
                                    onClick={() => window.open(getFilePreview(file), '_blank')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Preview
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl">Submitting your verification...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Verification</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Submit your documents for verification. Our admin team will review them within 24-48 hours.
                    </p>
                </div>

                {/* Verification Status Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Status</h2>
                            <p className="text-gray-600">{statuses[verificationStatus]?.description}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statuses[verificationStatus]?.color}`}>
                            {statuses[verificationStatus]?.label}
                        </span>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                            <span className="text-sm text-gray-500">
                                {verificationStatus === 'not_started' && '0%'}
                                {verificationStatus === 'pending' && '50%'}
                                {verificationStatus === 'verified' && '100%'}
                                {verificationStatus === 'rejected' && '25%'}
                                {verificationStatus === 'additional_info' && '75%'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${verificationStatus === 'not_started' ? 'bg-gray-400 w-0' :
                                    verificationStatus === 'pending' ? 'bg-yellow-500 w-1/2' :
                                        verificationStatus === 'verified' ? 'bg-green-500 w-full' :
                                            verificationStatus === 'rejected' ? 'bg-red-500 w-1/4' :
                                                'bg-blue-500 w-3/4'
                                    }`}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Verification Benefits */}
                {verificationStatus === 'not_started' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Why Verify Your Account?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-blue-800">Higher loan limits</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-blue-800">Faster approval times</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-blue-800">Better interest rates</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-blue-800">Increased trust with donors</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verification Form */}
                {verificationStatus === 'not_started' || verificationStatus === 'rejected' || verificationStatus === 'additional_info' ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Verification Documents</h2>

                        <form onSubmit={handleSubmitVerification} className="space-y-6">
                            {/* NID Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    National ID Number *
                                </label>
                                <input
                                    type="text"
                                    value={verificationData.nidNumber}
                                    onChange={(e) => setVerificationData(prev => ({ ...prev, nidNumber: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your NID number"
                                    required
                                />
                            </div>

                            {/* NID Front */}
                            {renderFileUpload(
                                'nidFront',
                                'NID Front Side *',
                                'Upload a clear photo of the front side of your National ID card',
                                true
                            )}

                            {/* NID Back */}
                            {renderFileUpload(
                                'nidBack',
                                'NID Back Side *',
                                'Upload a clear photo of the back side of your National ID card',
                                true
                            )}

                            {/* Selfie with NID */}
                            {renderFileUpload(
                                'selfiePhoto',
                                'Selfie with NID *',
                                'Take a selfie photo holding your National ID card next to your face',
                                true
                            )}

                            {/* Address Proof */}
                            {renderFileUpload(
                                'addressProof',
                                'Address Proof',
                                'Utility bill, bank statement, or any document proving your address (optional)'
                            )}

                            {/* Income Proof */}
                            {renderFileUpload(
                                'incomeProof',
                                'Income Proof',
                                'Salary slip, bank statements, or business documents (optional)'
                            )}

                            {/* Terms Agreement */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                    I certify that all information provided is accurate and I agree to the verification process
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit for Verification'}
                            </button>
                        </form>
                    </div>
                ) : verificationStatus === 'pending' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Verification Under Review</h3>
                        <p className="text-yellow-700">
                            Your documents are being reviewed by our admin team. This usually takes 24-48 hours.
                            You'll be notified once the verification is complete.
                        </p>
                    </div>
                ) : verificationStatus === 'verified' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Account Verified!</h3>
                        <p className="text-green-700 mb-4">
                            Congratulations! Your account has been successfully verified by our admin team.
                            You now have access to all platform features.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600">1,000,000 TK</div>
                                <div className="text-sm text-gray-600">Max Loan Limit</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600">24h</div>
                                <div className="text-sm text-gray-600">Fast Approval</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600">Premium</div>
                                <div className="text-sm text-gray-600">Trust Level</div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Verification History */}
                {verificationHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification History</h2>
                        <div className="space-y-4">
                            {verificationHistory.map((entry) => (
                                <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Submitted on {new Date(entry.timestamp).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            NID: {entry.nidNumber} • Documents: {entry.documents.length}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statuses[entry.status]?.color}`}>
                                        {statuses[entry.status]?.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Verification;