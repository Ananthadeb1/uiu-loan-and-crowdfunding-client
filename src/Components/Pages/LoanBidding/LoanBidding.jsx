import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const LoanBidding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const axiosSecure = useAxiosSecure();

  // Show popup alert
  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Check if user is donor, otherwise redirect
  useEffect(() => {
    if (user && user.role !== "donor" && user.role !== "admin") {
      showAlert("Only donors can access the loan bidding page", "error");
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch loan requests from API
  useEffect(() => {
    if (user?.role !== "donor" && user?.role !== "admin") return;

    const fetchLoanRequests = async () => {
      try {
        const response = await axiosSecure.get("/api/loans");
        setLoanRequests(response.data.data || []);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
        setLoanRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, [axiosSecure, user]);

  // Handle bid submission
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || !interestRate) {
      showAlert("Please fill in all fields", "error");
      return;
    }

    if (Number(bidAmount) <= 0 || Number(interestRate) <= 0) {
      showAlert("Please enter valid positive numbers", "error");
      return;
    }

    if (Number(interestRate) > 50) {
      showAlert("Interest rate seems too high. Please enter a reasonable rate.", "error");
      return;
    }

    try {
      const offerData = {
        loanId: selectedLoan._id,
        loanAmount: selectedLoan.loanAmount,
        purpose: selectedLoan.purpose,
        borrowerId: selectedLoan.userId,
        borrowerEmail: selectedLoan.userEmail,
        borrowerName: selectedLoan.userName,
        donorId: user.uid,
        donorEmail: user.email,
        donorName: user.name,
        offeredAmount: Number(bidAmount),
        interestRate: Number(interestRate),
        repaymentTime: selectedLoan.repaymentTime,
        message: message.trim(),
        status: "pending"
      };

      console.log("Submitting offer:", offerData);

      // Save offer to database
      const response = await axiosSecure.post("/api/offers", offerData);

      if (response.data.success) {
        showAlert("Offer submitted successfully!", "success");
        setSelectedLoan(null);
        setBidAmount("");
        setInterestRate("");
        setMessage("");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      showAlert(error.response?.data?.message || "Failed to submit offer", "error");
    }
  };

  // Don't show page if user is not donor
  if (user?.role !== "donor" && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Access Denied. Only donors can view this page.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading loan requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Popup Alert */}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${alert.type === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
          } rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${alert.type === "success" ? "text-green-400" : "text-red-400"
              }`}>
              {alert.type === "success" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => setAlert({ show: false, message: "", type: "" })}
              className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Bidding</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse available loan requests and submit your offers with your proposed interest rates.
          </p>
        </div>

        {/* Loan Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {loanRequests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No loan requests available for bidding</div>
              <p className="text-gray-400">When users submit loan requests, they will appear here.</p>
            </div>
          ) : (
            loanRequests.map((loan) => (
              <div
                key={loan._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                {/* Loan Purpose */}
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {loan.purpose}
                  </span>
                </div>

                {/* User Info */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Requested by</div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2 text-xs">
                      {loan.userName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {loan.userName || "Anonymous"}
                    </span>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {loan.loanAmount?.toLocaleString()} TK
                </div>

                {/* Repayment Terms */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Repayment Terms</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {loan.repaymentTime} months
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                  </span>
                </div>

                {/* Offer Button */}
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Offer
                </button>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back to Home
          </Link>
        </div>
      </div>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Offer</h2>



            <form onSubmit={handleSubmitBid}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Offer Amount (TK)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount you want to lend"
                    required
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can offer part or all of the requested amount
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Proposed Interest Rate (% per year)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your proposed interest rate"
                    required
                    min="0.1"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the annual interest rate you're proposing (e.g., 8.5 for 8.5%)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Borrower (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a personal message or terms..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Submit Offer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLoan(null);
                    setBidAmount("");
                    setInterestRate("");
                    setMessage("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanBidding;