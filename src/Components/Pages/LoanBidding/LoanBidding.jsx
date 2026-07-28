import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FaCoins, FaHandHoldingHeart, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const LoanBidding = () => {
  const { user } = useAuth();
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

  // Fetch loan requests from API
  useEffect(() => {
    const fetchLoanRequests = async () => {
      setLoading(true);
      try {
        const response = await axiosSecure.get("/api/loans");
        setLoanRequests(response.data.data || []);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
        // Fallback to /loanRequest endpoint if needed
        try {
          const fallbackRes = await axiosSecure.get("/loanRequest");
          setLoanRequests(fallbackRes.data || []);
        } catch (e) {
          setLoanRequests([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, [axiosSecure]);

  // Handle bid submission
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!user) {
      showAlert("Please log in to submit a loan offer", "error");
      return;
    }

    if (!bidAmount || !interestRate) {
      showAlert("Please fill in all required fields", "error");
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
        borrowerId: selectedLoan.userId || selectedLoan._id,
        borrowerEmail: selectedLoan.userEmail || "borrower@uiu.ac.bd",
        borrowerName: selectedLoan.userName || "Student Borrower",
        donorId: user.uid || user._id,
        donorEmail: user.email,
        donorName: user.name || "Peer Backer",
        offeredAmount: Number(bidAmount),
        interestRate: Number(interestRate),
        repaymentTime: selectedLoan.repaymentTime,
        message: message.trim(),
        status: "pending"
      };

      // Save offer to database
      const response = await axiosSecure.post("/api/offers", offerData);
      
      if (response.data.success || response.data.insertedId) {
        showAlert("Your loan offer was submitted successfully!", "success");
        setSelectedLoan(null);
        setBidAmount("");
        setInterestRate("");
        setMessage("");
      } else {
        throw new Error(response.data.message || "Failed to submit offer");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      showAlert(error.response?.data?.message || "Failed to submit offer", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <span className="loading loading-spinner loading-lg text-[#0A7265]"></span>
        <p className="text-slate-600 text-sm font-semibold">Loading available loan requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Alert Banner */}
      {alert.show && (
        <div className={`fixed top-5 right-5 z-50 max-w-md w-full p-4 rounded-xl shadow-xl border flex items-center justify-between transition-all ${
          alert.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-300" 
            : "bg-rose-50 text-rose-800 border-rose-300"
        }`}>
          <div className="flex items-center space-x-3">
            {alert.type === "success" ? <FaCheckCircle className="text-emerald-600 text-xl" /> : <FaExclamationCircle className="text-rose-600 text-xl" />}
            <span className="font-semibold text-sm">{alert.message}</span>
          </div>
          <button onClick={() => setAlert({ show: false, message: "", type: "" })} className="text-gray-500 hover:text-gray-800 font-bold">&times;</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A7265] to-[#129A88] text-white p-8 rounded-2xl shadow-xl text-center space-y-3">
          <span className="bg-[#F9D56E] text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Peer-to-Peer Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Loan Bidding Marketplace</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Explore verified student loan applications, compare proposals, and offer customized peer lending terms.
          </p>
        </div>

        {/* Loan Requests Grid */}
        {loanRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <FaCoins className="text-4xl text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No active loan requests available for bidding</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              When students submit new loan applications, they will appear here for peer backer bids.
            </p>
            <Link 
              to="/loan-request" 
              className="inline-block px-6 py-2.5 bg-[#0A7265] text-white rounded-xl font-bold text-sm shadow hover:bg-[#075349] transition"
            >
              Submit a Loan Request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanRequests.map((loan) => (
              <div
                key={loan._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-50 text-[#0A7265] border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                      {loan.purpose || "General Loan"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                      {loan.status || "Pending"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Requested Amount</p>
                    <h2 className="text-2xl font-extrabold text-slate-900">${loan.loanAmount?.toLocaleString()} <span className="text-sm font-semibold text-slate-500">BDT</span></h2>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p><strong>Borrower:</strong> {loan.userName || loan.userEmail || "Verified Student"}</p>
                    <p><strong>Repayment Term:</strong> {loan.repaymentTime} Months</p>
                    {loan.description && <p className="text-slate-500 italic mt-1 line-clamp-2">"{loan.description}"</p>}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLoan(loan);
                    setBidAmount(loan.loanAmount ? String(loan.loanAmount) : "");
                  }}
                  className="w-full py-3 bg-[#0A7265] hover:bg-[#075349] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
                >
                  <FaHandHoldingHeart />
                  <span>Submit Loan Offer / Bid</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 hover:text-[#0A7265] font-bold text-sm transition-colors space-x-2"
          >
            <span>&larr;</span>
            <span>Return to Home</span>
          </Link>
        </div>
      </div>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#0A7265] uppercase">Peer Offer Submission</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Submit Loan Offer</h3>
              <p className="text-xs text-slate-500 mt-0.5">For {selectedLoan.purpose} (${selectedLoan.loanAmount})</p>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Offered Amount (BDT)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                  placeholder="Enter offer amount"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Proposed Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                  placeholder="e.g. 5.5"
                  required
                  min="0.1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Note / Terms for Borrower (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7265]"
                  placeholder="Add custom repayment terms or notes..."
                  rows="3"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLoan(null);
                    setBidAmount("");
                    setInterestRate("");
                    setMessage("");
                  }}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0A7265] hover:bg-[#075349] text-white font-bold rounded-xl text-sm transition shadow-md"
                >
                  Submit Offer
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