import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const LoanStatus = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [offers, setOffers] = useState([]);
    const [showOffers, setShowOffers] = useState(false);

    // Fetch user's loan requests
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserLoans = async () => {
            try {
                const response = await axiosSecure.get(`/api/loans/user/${user.uid}`);
                if (response.data.success) {
                    setLoans(response.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching loans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserLoans();
    }, [user, axiosSecure, navigate]);

    // Fetch offers for a specific loan
    const fetchLoanOffers = async (loanId) => {
        try {
            const response = await axiosSecure.get(`/api/offers/loan/${loanId}`);
            if (response.data.success) {
                setOffers(response.data.data || []);
                setShowOffers(true);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    // Handle loan status update (for borrowers)
    const updateLoanStatus = async (loanId, newStatus) => {
        try {
            const response = await axiosSecure.patch(`/api/loans/${loanId}`, {
                status: newStatus
            });

            if (response.data.success) {
                // Update local state
                setLoans(prevLoans =>
                    prevLoans.map(loan =>
                        loan._id === loanId ? { ...loan, status: newStatus } : loan
                    )
                );
                alert(`Loan ${newStatus} successfully!`);
            }
        } catch (error) {
            console.error('Error updating loan status:', error);
            alert('Failed to update loan status');
        }
    };

    // Handle offer acceptance (for borrowers)
    const acceptOffer = async (offerId, loanId) => {
        try {
            // First update loan status to "approved"
            await updateLoanStatus(loanId, 'approved');

            // Here you would typically:
            // 1. Notify the donor
            // 2. Create a loan agreement
            // 3. Initiate fund transfer

            alert('Offer accepted! The donor will be notified.');
            setShowOffers(false);
        } catch (error) {
            console.error('Error accepting offer:', error);
            alert('Failed to accept offer');
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'funded': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading your loans...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Loan Status</h1>
                    <p className="text-gray-600">
                        Track your loan requests and manage offers from donors
                    </p>
                </div>

                {/* Loans Grid */}
                {loans.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-gray-500 text-lg mb-4">No loan requests found</div>
                        <button
                            onClick={() => navigate('/loan-request')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Submit Your First Loan Request
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loans.map((loan) => (
                            <div key={loan._id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                                {/* Loan Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {loan.purpose}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Requested: {formatDate(loan.requestedAt)}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(loan.status)}`}>
                                                {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {loan.loanAmount?.toLocaleString()} TK
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {loan.repaymentTime} months
                                        </div>
                                    </div>
                                </div>

                                {/* Loan Description */}
                                {loan.description && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm">{loan.description}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-6">
                                    {/* View Offers Button - Only show for pending loans */}
                                    {loan.status === 'pending' && (
                                        <button
                                            onClick={() => {
                                                setSelectedLoan(loan);
                                                fetchLoanOffers(loan._id);
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            View Offers ({loan.offersCount || 0})
                                        </button>
                                    )}

                                    {/* Cancel Button - Only for pending loans */}
                                    {loan.status === 'pending' && (
                                        <button
                                            onClick={() => updateLoanStatus(loan._id, 'cancelled')}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Cancel Request
                                        </button>
                                    )}

                                    {/* Mark as Completed - Only for funded loans */}
                                    {loan.status === 'funded' && (
                                        <button
                                            onClick={() => updateLoanStatus(loan._id, 'completed')}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}

                                    {/* View Details */}
                                    <button
                                        onClick={() => {
                                            setSelectedLoan(loan);
                                            fetchLoanOffers(loan._id);
                                        }}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        View Details
                                    </button>
                                </div>

                                {/* Progress Bar for Status */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Submitted</span>
                                        <span>Under Review</span>
                                        <span>Approved</span>
                                        <span>Funded</span>
                                        <span>Completed</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${loan.status === 'pending' ? 'bg-yellow-500 w-1/4' :
                                                    loan.status === 'approved' ? 'bg-blue-500 w-2/4' :
                                                        loan.status === 'funded' ? 'bg-green-500 w-3/4' :
                                                            loan.status === 'completed' ? 'bg-green-600 w-full' :
                                                                'bg-red-500 w-1/4'
                                                }`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

            {/* Offers Modal */}
            {showOffers && selectedLoan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Offers for {selectedLoan.purpose}
                                </h2>
                                <button
                                    onClick={() => setShowOffers(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {offers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No offers yet. Donors will see your request and make offers soon.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {offers.map((offer) => (
                                        <div key={offer._id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {offer.donorName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">{offer.donorEmail}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {offer.status || 'Pending'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Offered Amount:</span>
                                                    <div className="font-semibold text-lg">
                                                        {offer.offeredAmount?.toLocaleString()} TK
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Interest Rate:</span>
                                                    <div className="font-semibold text-lg">
                                                        {offer.interestRate}% per year
                                                    </div>
                                                </div>
                                            </div>

                                            {offer.message && (
                                                <div className="mt-3">
                                                    <span className="text-gray-600 text-sm">Message:</span>
                                                    <p className="text-gray-700 mt-1">{offer.message}</p>
                                                </div>
                                            )}

                                            {offer.status === 'pending' && selectedLoan.status === 'pending' && (
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => acceptOffer(offer._id, selectedLoan._id)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                    >
                                                        Accept Offer
                                                    </button>
                                                    <button
                                                        onClick={() => {/* Implement reject offer */ }}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanStatus;