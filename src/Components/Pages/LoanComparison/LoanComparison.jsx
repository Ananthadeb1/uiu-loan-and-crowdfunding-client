import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const LoanComparison = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [acceptedOffers, setAcceptedOffers] = useState([]);
  const [showAcceptedOffers, setShowAcceptedOffers] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Show popup alert
  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
  };

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      if (!user?.uid) {
        showAlert("Please log in to view your loan offers", "error");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosSecure.get(`/api/comparison/my-offers?userId=${user.uid}`);
        
        if (response.data.success) {
          const allOffers = response.data.data || [];
          setOffers(allOffers);
          
          // Get accepted offers
          const accepted = allOffers.filter(offer => offer.status === "accepted");
          setAcceptedOffers(accepted);
          
          if (accepted.length > 0) {
            showAlert(`You have ${accepted.length} accepted offer(s)`, "success");
          }
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        showAlert("Failed to load offers", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [axiosSecure, user]);

  // SIMPLE PER-LOAN LOCKING: Check which loans have accepted offers
  const getAcceptedLoanIds = () => {
    return acceptedOffers.map(offer => offer.loanId.toString());
  };

  // Check if a specific offer's loan is locked
  const isLoanLocked = (offer) => {
    const acceptedLoanIds = getAcceptedLoanIds();
    return acceptedLoanIds.includes(offer.loanId.toString());
  };

  // Check if a specific offer can be selected
  const canSelectOffer = (offer) => {
    return offer.status === "pending" && !isLoanLocked(offer);
  };

  // Select offer
  const selectOffer = (offer) => {
    if (!canSelectOffer(offer)) {
      if (isLoanLocked(offer)) {
        showAlert("This loan already has an accepted offer", "error");
      } else if (offer.status !== "pending") {
        showAlert("This offer is not available for selection", "error");
      }
      return;
    }

    setSelectedOffer(offer._id);
    showAlert(`Offer from ${offer.donorName} selected`, "info");
  };

  // Accept offer
  const handleAcceptOffer = async () => {
    if (!selectedOffer) {
      showAlert("Please select an offer first", "error");
      return;
    }

    const offer = offers.find(o => o._id === selectedOffer);
    if (!offer) {
      showAlert("Selected offer not found", "error");
      return;
    }

    // Double-check if loan is locked
    if (isLoanLocked(offer)) {
      showAlert("This loan already has an accepted offer", "error");
      return;
    }

    try {
      showAlert("Accepting offer...", "info");
      
      const response = await axiosSecure.post(`/api/offers/${selectedOffer}/accept`, {
        loanId: offer.loanId
      });

      if (response.data.success) {
        showAlert("Offer accepted successfully!", "success");
        
        // Refresh offers to get updated statuses
        const refreshResponse = await axiosSecure.get(`/api/comparison/my-offers?userId=${user.uid}`);
        if (refreshResponse.data.success) {
          const updatedOffers = refreshResponse.data.data || [];
          setOffers(updatedOffers);
          setAcceptedOffers(updatedOffers.filter(o => o.status === "accepted"));
        }
        
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      showAlert(error.response?.data?.message || "Failed to accept offer", "error");
    }
  };

  // Get offers grouped by loan
  const getOffersByLoan = () => {
    const loanMap = {};
    
    offers.forEach(offer => {
      if (!loanMap[offer.loanId]) {
        loanMap[offer.loanId] = {
          loanId: offer.loanId,
          purpose: offer.purpose,
          offers: [],
          hasAccepted: false
        };
      }
      loanMap[offer.loanId].offers.push(offer);
      if (offer.status === "accepted") {
        loanMap[offer.loanId].hasAccepted = true;
      }
    });
    
    return Object.values(loanMap);
  };

  // Get pending offers that can be selected
  const getSelectableOffers = () => {
    return offers.filter(offer => canSelectOffer(offer));
  };

  const loansWithOffers = getOffersByLoan();
  const selectableOffers = getSelectableOffers();
  const selectedOfferDetails = offers.find(o => o._id === selectedOffer);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your loan offers...</div>
        </div>
      </div>
    );
  }

  if (!user?.uid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Alert */}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          alert.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
          alert.type === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-800" :
          alert.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" :
          "bg-red-50 border-red-200 text-red-800"
        } rounded-lg shadow-lg p-4 border`}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{alert.message}</p>
            <button onClick={() => setAlert({ show: false, message: "", type: "" })} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={() => setShowAcceptedOffers(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              My Accepted Offers ({acceptedOffers.length})
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Comparison</h1>
          <p className="text-gray-600 text-lg">
            Compare offers from different loans. You can accept one offer per loan.
          </p>
        </div>

        {/* Accepted Offers Summary */}
        {acceptedOffers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-green-800 font-semibold">
                  ✅ You have accepted {acceptedOffers.length} offer(s) across {new Set(acceptedOffers.map(o => o.loanId)).size} loan(s)
                </span>
                <p className="text-green-600 text-sm mt-1">
                  Each loan can have only one accepted offer. Other offers for the same loan are locked.
                </p>
              </div>
              <button
                onClick={() => setShowAcceptedOffers(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Selected Offer Section */}
        {selectedOffer && selectedOfferDetails && canSelectOffer(selectedOfferDetails) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Selected Offer</h3>
                <p className="text-blue-700">
                  From {selectedOfferDetails.donorName} for {selectedOfferDetails.purpose}
                </p>
                <p className="text-blue-600 font-bold">
                  {selectedOfferDetails.offeredAmount?.toLocaleString()} TK at {selectedOfferDetails.interestRate}%
                </p>
              </div>
              <button
                onClick={handleAcceptOffer}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Accept This Offer
              </button>
            </div>
          </div>
        )}

        {/* Loans Section */}
        <div className="space-y-8">
          {loansWithOffers.map(loanGroup => (
            <div key={loanGroup.loanId} className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Loan Header */}
              <div className={`p-4 border-b ${
                loanGroup.hasAccepted ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {loanGroup.purpose}
                    </h3>
                    <p className="text-gray-600">
                      {loanGroup.offers.length} offer(s) • {
                        loanGroup.hasAccepted 
                          ? "✅ Offer Accepted" 
                          : `${loanGroup.offers.filter(o => o.status === "pending").length} pending`
                      }
                    </p>
                  </div>
                  {loanGroup.hasAccepted && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ACCEPTED
                    </span>
                  )}
                </div>
              </div>

              {/* Offers Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loanGroup.offers.map((offer) => (
                    <div
                      key={offer._id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        selectedOffer === offer._id
                          ? "border-green-500 bg-green-50"
                          : loanGroup.hasAccepted
                          ? "border-gray-300 bg-gray-50"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      {/* Donor Info */}
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 text-green-600 font-semibold text-sm">
                            {offer.donorName?.charAt(0) || 'D'}
                          </div>
                          <span className="font-medium">{offer.donorName || "Donor"}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {offer.offeredAmount?.toLocaleString()} TK
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest:</span>
                          <span className="font-semibold text-green-600">{offer.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Term:</span>
                          <span className="font-semibold">{offer.repaymentTime} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-semibold ${
                            offer.status === "accepted" ? "text-green-600" :
                            offer.status === "rejected" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {offer.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Selection Button */}
                      <button
                        onClick={() => selectOffer(offer)}
                        disabled={!canSelectOffer(offer)}
                        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                          !canSelectOffer(offer)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : selectedOffer === offer._id
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {!canSelectOffer(offer) 
                          ? (loanGroup.hasAccepted ? "Loan Accepted" : "Not Available")
                          : selectedOffer === offer._id 
                          ? 'Selected' 
                          : 'Select Offer'
                        }
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Offers Message */}
        {loansWithOffers.length === 0 && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">💸</div>
            <div className="text-gray-500 text-xl mb-4">No loan offers yet</div>
            <p className="text-gray-400 mb-6">
              When donors make offers on your loan requests, they will appear here.
            </p>
            <Link to="/loan-request" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Create Loan Request
            </Link>
          </div>
        )}

        {/* Accepted Offers Modal */}
        {showAcceptedOffers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Accepted Offers ({acceptedOffers.length})
                  </h2>
                  <button
                    onClick={() => setShowAcceptedOffers(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {acceptedOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <div className="text-gray-500 text-xl mb-2">No Accepted Offers</div>
                    <p className="text-gray-400">You haven't accepted any offers yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acceptedOffers.map((offer) => (
                      <div key={offer._id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-green-900">
                              {offer.purpose}
                            </h3>
                            <p className="text-green-700">Accepted from {offer.donorName}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ✅ ACCEPTED
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Loan Amount</div>
                            <div className="text-lg font-bold text-green-600">
                              {offer.offeredAmount?.toLocaleString()} TK
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Interest Rate</div>
                            <div className="text-lg font-bold text-blue-600">
                              {offer.interestRate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Term</div>
                            <div className="text-lg font-medium">
                              {offer.repaymentTime} months
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                          <div>Accepted on: {new Date(offer.acceptedAt || offer.updatedAt).toLocaleDateString()}</div>
                          <div>Donor: {offer.donorName} ({offer.donorEmail})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link to="/loan-request" className="text-blue-600 hover:text-blue-800">
            Create New Loan Request
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoanComparison;