import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const History = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('loans');
    const [loanHistory, setLoanHistory] = useState([]);
    const [offerHistory, setOfferHistory] = useState([]);
    const [fundraiseHistory, setFundraiseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showPayment, setShowPayment] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);

    // Fetch all user history
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserHistory = async () => {
            try {
                setLoading(true);

                // Fetch loan history
                const loansResponse = await axiosSecure.get(`/api/loans/user/${user.uid}`);
                if (loansResponse.data.success) {
                    setLoanHistory(loansResponse.data.data || []);
                }

                // Fetch offer history (for donors)
                if (user.role === 'donor') {
                    const offersResponse = await axiosSecure.get(`/api/offers/donor/${user.uid}`);
                    if (offersResponse.data.success) {
                        setOfferHistory(offersResponse.data.data || []);
                    }
                }

                // Fetch fundraise history
                const fundraiseResponse = await axiosSecure.get(`/fundraise?email=${user.email}`);
                setFundraiseHistory(fundraiseResponse.data || []);

            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserHistory();
    }, [user, axiosSecure, navigate]);

    // Handle Donate button click
    const handleDonateClick = (fundraiser) => {
        setSelectedFundraiser(fundraiser);
        setShowPayment(true);
        setDonationAmount('');
    };

    // Handle payment submission
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!donationAmount || donationAmount <= 0) {
            alert('Please enter a valid donation amount');
            return;
        }

        // Simulate payment processing
        alert(`Payment of ${donationAmount} TK processed successfully via ${selectedFundraiser.paymentMethod} for ${selectedFundraiser.fullName}!`);

        // Reset states
        setShowPayment(false);
        setSelectedFundraiser(null);
        setDonationAmount('');
    };

    // Render payment method specific form
    const renderPaymentForm = () => {
        if (!selectedFundraiser) return null;

        const paymentMethods = {
            'Bkash': {
                title: 'Bkash Payment',
                instructions: 'Send money to: 017XXXXXXXX',
                fields: [
                    { label: 'Bkash Number', type: 'tel', placeholder: '01XXXXXXXXX' },
                    { label: 'PIN', type: 'password', placeholder: 'Enter Bkash PIN' }
                ]
            },
            'Nagad': {
                title: 'Nagad Payment',
                instructions: 'Send money to: 017XXXXXXXX',
                fields: [
                    { label: 'Nagad Number', type: 'tel', placeholder: '01XXXXXXXXX' },
                    { label: 'PIN', type: 'password', placeholder: 'Enter Nagad PIN' }
                ]
            },
            'Bank': {
                title: 'Bank Transfer',
                instructions: 'Transfer to: BRAC Bank A/C: 123456789',
                fields: [
                    { label: 'Bank Name', type: 'text', placeholder: 'Your Bank Name' },
                    { label: 'Account Number', type: 'text', placeholder: 'Your Account Number' },
                    { label: 'Transaction ID', type: 'text', placeholder: 'Transaction Reference' }
                ]
            },
            'Card': {
                title: 'Card Payment',
                instructions: 'Enter your card details securely',
                fields: [
                    { label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456' },
                    { label: 'Expiry Date', type: 'text', placeholder: 'MM/YY' },
                    { label: 'CVV', type: 'password', placeholder: '123' },
                    { label: 'Card Holder Name', type: 'text', placeholder: 'John Doe' }
                ]
            }
        };

        const method = paymentMethods[selectedFundraiser.paymentMethod] || paymentMethods['Bkash'];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{method.title}</h2>
                            <button
                                onClick={() => setShowPayment(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Fundraiser Info */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-blue-900">Donating to: {selectedFundraiser.fullName}</h3>
                            <p className="text-blue-700 text-sm">Purpose: {selectedFundraiser.purpose}</p>
                            <p className="text-blue-700 text-sm mt-1">{method.instructions}</p>
                        </div>

                        <form onSubmit={handlePaymentSubmit}>
                            {/* Donation Amount */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Donation Amount (TK)
                                </label>
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter amount"
                                    required
                                    min="1"
                                />
                            </div>

                            {/* Payment Method Specific Fields */}
                            {method.fields.map((field, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                </div>
                            ))}

                            {/* Terms */}
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                    I agree to the terms and conditions
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                    Pay {donationAmount ? `${donationAmount} TK` : ''}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPayment(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    // Filter items based on status
    const getFilteredItems = () => {
        let items = [];

        switch (activeTab) {
            case 'loans':
                items = loanHistory;
                break;
            case 'offers':
                items = offerHistory;
                break;
            case 'fundraising':
                items = fundraiseHistory;
                break;
            default:
                items = [];
        }

        if (filter === 'all') return items;
        return items.filter(item => item.status === filter);
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
            case 'accepted': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return amount?.toLocaleString('en-BD') + ' TK';
    };

    // Get payment method badge color
    const getPaymentMethodColor = (method) => {
        switch (method) {
            case 'Bkash': return 'bg-pink-100 text-pink-800';
            case 'Nagad': return 'bg-green-100 text-green-800';
            case 'Bank': return 'bg-blue-100 text-blue-800';
            case 'Card': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Calculate total amounts
    const calculateTotals = () => {
        const loansTotal = loanHistory.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);
        const offersTotal = offerHistory.reduce((sum, offer) => sum + (offer.offeredAmount || 0), 0);
        const fundraisingTotal = fundraiseHistory.length;

        return { loansTotal, offersTotal, fundraisingTotal };
    };

    const totals = calculateTotals();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading your history...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Activity History</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Track all your loan requests, offers, and fundraising activities in one place
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{loanHistory.length}</div>
                        <div className="text-sm text-gray-600">Loan Requests</div>
                        <div className="text-xs text-gray-500 mt-1">{formatCurrency(totals.loansTotal)}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{offerHistory.length}</div>
                        <div className="text-sm text-gray-600">Offers Made</div>
                        <div className="text-xs text-gray-500 mt-1">{formatCurrency(totals.offersTotal)}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{fundraiseHistory.length}</div>
                        <div className="text-sm text-gray-600">Fundraising</div>
                        <div className="text-xs text-gray-500 mt-1">{totals.fundraisingTotal} campaigns</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {[
                                { id: 'loans', label: 'Loan Requests', count: loanHistory.length },
                                { id: 'offers', label: 'My Offers', count: offerHistory.length, show: user.role === 'donor' },
                                { id: 'fundraising', label: 'Fundraising', count: fundraiseHistory.length }
                            ].filter(tab => tab.show !== false).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Filter */}
                    <div className="p-4 border-b border-gray-200">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="funded">Funded</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow">
                    {getFilteredItems().length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">
                                No {activeTab} history found
                            </div>
                            <p className="text-gray-400 mb-6">
                                {activeTab === 'loans' && "You haven't submitted any loan requests yet."}
                                {activeTab === 'offers' && "You haven't made any offers to borrowers yet."}
                                {activeTab === 'fundraising' && "You haven't started any fundraising campaigns yet."}
                            </p>
                            {activeTab === 'loans' && (
                                <button
                                    onClick={() => navigate('/loan-request')}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Submit Loan Request
                                </button>
                            )}
                            {activeTab === 'offers' && (
                                <button
                                    onClick={() => navigate('/loan-bidding')}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Browse Loan Requests
                                </button>
                            )}
                            {activeTab === 'fundraising' && (
                                <button
                                    onClick={() => navigate('/crowdfunding')}
                                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Start Fundraising
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {getFilteredItems().map((item) => (
                                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            {/* Loan History Item */}
                                            {activeTab === 'loans' && (
                                                <>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {item.purpose}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Amount:</span>
                                                            <div className="text-lg font-bold text-gray-900">
                                                                {formatCurrency(item.loanAmount)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Term:</span>
                                                            <div>{item.repaymentTime} months</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Requested:</span>
                                                            <div>{formatDate(item.requestedAt)}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Last Updated:</span>
                                                            <div>{formatDate(item.updatedAt)}</div>
                                                        </div>
                                                    </div>
                                                    {item.description && (
                                                        <p className="text-gray-700 mt-2 text-sm">{item.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Offer History Item */}
                                            {activeTab === 'offers' && (
                                                <>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Offer to {item.borrowerName}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Offered Amount:</span>
                                                            <div className="text-lg font-bold text-gray-900">
                                                                {formatCurrency(item.offeredAmount)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Interest Rate:</span>
                                                            <div>{item.interestRate}% per year</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Borrower:</span>
                                                            <div>{item.borrowerEmail}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Submitted:</span>
                                                            <div>{formatDate(item.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                    {item.message && (
                                                        <p className="text-gray-700 mt-2 text-sm">
                                                            <span className="font-medium">Your message:</span> {item.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}

                                            {/* Fundraising History Item */}
                                            {activeTab === 'fundraising' && (
                                                <>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {item.fullName}
                                                        </h3>
                                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                            {item.purpose}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(item.paymentMethod)}`}>
                                                            {item.paymentMethod}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Type:</span>
                                                            <div>{item.donationType}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Currency:</span>
                                                            <div>{item.currency}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Payment Method:</span>
                                                            <div className="font-semibold">{item.paymentMethod}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Submitted:</span>
                                                            <div>{formatDate(item.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                    {item.message && (
                                                        <p className="text-gray-700 mt-2 text-sm">{item.message}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Show Donate button only for fundraising tab */}
                                        {activeTab === 'fundraising' ? (
                                            <button
                                                onClick={() => handleDonateClick(item)}
                                                className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                            >
                                                Donate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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

            {/* Payment Modal */}
            {showPayment && renderPaymentForm()}

            {/* Detail Modal (for non-fundraising items) */}
            {selectedItem && activeTab !== 'fundraising' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                    {JSON.stringify(selectedItem, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;