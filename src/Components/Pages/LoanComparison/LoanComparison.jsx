import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false
});

const OUTER_BG = "#E6EDEB";
const FORM_BG = "#FFFFFF";
const HEADER_BG = "#FFFFFF";
const PRIMARY_COLOR = "#2c5aa0";
const SECONDARY_COLOR = "#084C7F";
const TABLE_HEADER_BG = "#2c5aa0";
const BUTTON_BG = "#28a745";
const BUTTON_HOVER = "#218838";

const toast = (msg, type = "success") => {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    left: "50%",
    top: "24px",
    transform: "translateX(-50%)",
    zIndex: "9999",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "600",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    color: "#0F172A",
    background: "#FFFFFF",
    border: type === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
    pointerEvents: "none"
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 300ms";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 320);
  }, 2200);
};

const LoanComparison = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get("/api/comparison/offers");
      setOffers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast("Failed to load loan offers", "error");
      setLoading(false);
    }
  };

  const toggleOfferSelection = (offerId) => {
    setSelectedOffers(prev => {
      if (prev.includes(offerId)) {
        return prev.filter(id => id !== offerId);
      } else if (prev.length < 4) {
        return [...prev, offerId];
      }
      return prev;
    });
  };

  const handleTakeOffer = (offerId) => {
    toast(`Offer ${offerId} selected!`, "success");
    // Add your offer acceptance logic here
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  // Inline Styles
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: OUTER_BG
    },
    header: {
      backgroundColor: HEADER_BG,
      padding: "1rem 2rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    headerTitle: {
      color: PRIMARY_COLOR,
      margin: 0,
      fontSize: "1.5rem",
      fontWeight: "bold"
    },
    nav: {
      display: "flex",
      gap: "2rem"
    },
    navLink: {
      textDecoration: "none",
      color: "#333",
      fontWeight: "500",
      cursor: "pointer"
    },
    activeNavLink: {
      color: PRIMARY_COLOR,
      fontWeight: "bold"
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem"
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "2rem",
      fontSize: "2rem"
    },
    offerSelection: {
      marginBottom: "3rem"
    },
    selectionTitle: {
      marginBottom: "1rem",
      color: "#333"
    },
    offersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.5rem",
      marginTop: "1rem"
    },
    offerCard: {
      background: "white",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      padding: "1.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    selectedOfferCard: {
      borderColor: PRIMARY_COLOR,
      backgroundColor: "#f0f7ff"
    },
    offerHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem"
    },
    offerType: {
      margin: 0,
      color: "#333",
      textTransform: "capitalize",
      fontSize: "1.1rem",
      fontWeight: "bold"
    },
    amount: {
      fontWeight: "bold",
      color: PRIMARY_COLOR,
      fontSize: "1.1rem"
    },
    offerDetails: {
      color: "#666"
    },
    detailText: {
      margin: "0.5rem 0"
    },
    selectionIndicator: {
      marginTop: "1rem",
      padding: "0.5rem",
      textAlign: "center",
      background: "#f8f9fa",
      borderRadius: "4px",
      fontSize: "0.9rem",
      color: "#666"
    },
    selectedIndicator: {
      background: PRIMARY_COLOR,
      color: "white"
    },
    comparisonTable: {
      background: "white",
      borderRadius: "8px",
      padding: "2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "1rem 0"
    },
    tableHeader: {
      background: TABLE_HEADER_BG,
      color: "white",
      fontWeight: "bold",
      padding: "1rem",
      textAlign: "center",
      border: "1px solid #e0e0e0"
    },
    tableCell: {
      padding: "1rem",
      textAlign: "center",
      border: "1px solid #e0e0e0"
    },
    firstColumn: {
      background: "#f8f9fa",
      fontWeight: "bold",
      textAlign: "left"
    },
    takeButton: {
      background: BUTTON_BG,
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    comparisonActions: {
      textAlign: "center",
      marginTop: "2rem"
    },
    nextButton: {
      background: SECONDARY_COLOR,
      color: "white",
      border: "none",
      padding: "0.75rem 2rem",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1.1rem",
      fontWeight: "bold"
    },
    footer: {
      background: "#333",
      color: "white",
      marginTop: "4rem"
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "2rem"
    },
    footerSection: {
      marginBottom: "1rem"
    },
    footerTitle: {
      color: PRIMARY_COLOR,
      marginBottom: "1rem"
    },
    footerLink: {
      color: "#ccc",
      textDecoration: "none",
      display: "block",
      margin: "0.5rem 0",
      cursor: "pointer"
    },
    footerBottom: {
      textAlign: "center",
      padding: "1rem",
      borderTop: "1px solid #555",
      color: "#ccc"
    },
    loading: {
      textAlign: "center",
      padding: "2rem",
      fontSize: "1.2rem",
      color: "#666"
    }
  };

  if (loading) return <div style={styles.loading}>Loading offers...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Peer Fund</h1>
        <nav style={styles.nav}>
          <span style={styles.navLink} onClick={() => navigate("/request-loan")}>Request Loan</span>
          <span style={styles.navLink} onClick={() => navigate("/invest")}>Invest</span>
          <span style={{...styles.navLink, ...styles.activeNavLink}}>Loan Comparison</span>
          <span style={styles.navLink} onClick={() => navigate("/crowd-funding")}>Crowd Funding</span>
          <span style={styles.navLink} onClick={() => navigate("/logout")}>Log out</span>
        </nav>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>Loan Comparison</h2>
        
        {/* Offer Selection Section */}
        <div style={styles.offerSelection}>
          <h3 style={styles.selectionTitle}>Select up to 4 offers to compare:</h3>
          <div style={styles.offersGrid}>
            {offers.map((offer) => (
              <div 
                key={offer._id}
                style={{
                  ...styles.offerCard,
                  ...(selectedOffers.includes(offer._id) ? styles.selectedOfferCard : {})
                }}
                onClick={() => toggleOfferSelection(offer._id)}
              >
                <div style={styles.offerHeader}>
                  <h4 style={styles.offerType}>{offer.loanType}</h4>
                  <span style={styles.amount}>{offer.amount}TK</span>
                </div>
                <div style={styles.offerDetails}>
                  <p style={styles.detailText}><strong>Interest Rate:</strong> {offer.interestRate}%</p>
                  <p style={styles.detailText}><strong>Term:</strong> {offer.repaymentTerm} months</p>
                  <p style={styles.detailText}><strong>Lender Rating:</strong> {renderStars(offer.lenderRating)}</p>
                </div>
                <div style={{
                  ...styles.selectionIndicator,
                  ...(selectedOffers.includes(offer._id) ? styles.selectedIndicator : {})
                }}>
                  {selectedOffers.includes(offer._id) ? '✓ Selected' : 'Click to select'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedOffers.length > 0 && (
          <div style={styles.comparisonTable}>
            <h3>Comparison Results</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}></th>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map((offer, index) => (
                      <th key={offer._id} style={styles.tableHeader}>
                        {String.fromCharCode(65 + index)}
                      </th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{...styles.tableCell, ...styles.firstColumn}}>Loan Type</td>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map(offer => (
                      <td key={offer._id} style={styles.tableCell}>
                        {offer.loanType}
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <td style={{...styles.tableCell, ...styles.firstColumn}}>Interest Rate</td>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map(offer => (
                      <td key={offer._id} style={styles.tableCell}>
                        {offer.interestRate}%
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <td style={{...styles.tableCell, ...styles.firstColumn}}>Repayment Terms</td>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map(offer => (
                      <td key={offer._id} style={styles.tableCell}>
                        {offer.repaymentTerm} months
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <td style={{...styles.tableCell, ...styles.firstColumn}}>Lender Review</td>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map(offer => (
                      <td key={offer._id} style={styles.tableCell}>
                        {renderStars(offer.lenderRating)}
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <td style={{...styles.tableCell, ...styles.firstColumn}}>Action</td>
                  {offers
                    .filter(offer => selectedOffers.includes(offer._id))
                    .map(offer => (
                      <td key={offer._id} style={styles.tableCell}>
                        <button 
                          style={styles.takeButton}
                          onClick={() => handleTakeOffer(offer._id)}
                        >
                          Take
                        </button>
                      </td>
                    ))
                  }
                </tr>
              </tbody>
            </table>
            
            <div style={styles.comparisonActions}>
              <button style={styles.nextButton}>Next &gt;</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Peer Fund</h4>
            <p>Welcome to Peer Fund, your trusted resource for financial loan reviews and comparisons.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Contact</h4>
            <p>+1 234 567 89</p>
            <p>info@gmail.com</p>
            <p>Dhaka, Bangladesh</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Quick Link</h4>
            <span style={styles.footerLink} onClick={() => navigate("/about")}>About</span>
            <span style={styles.footerLink} onClick={() => navigate("/reviews")}>Loan Reviews</span>
            <span style={styles.footerLink} onClick={() => navigate("/faq")}>Faq</span>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>copyright © 2025 PeerFund. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default LoanComparison;