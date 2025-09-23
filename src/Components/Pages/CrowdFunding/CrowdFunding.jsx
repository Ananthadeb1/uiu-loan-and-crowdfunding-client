import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const Crowdfunding = () => {
  const [activeTab, setActiveTab] = useState("fundraise");
  const [fundraisers, setFundraisers] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");

  // ✅ initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ✅ handle fundraise submit
  const handleFundraise = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/fundraise", data);

      if (res.data.insertedId) {
        alert("Fundraise submitted successfully!");
        console.log("Saved:", res.data);
        reset();
      } else {
        alert(res.data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting fundraise:", err);
      alert("Something went wrong, please try again.");
    }
  };

  // ✅ fetch fundraisers
  useEffect(() => {
    if (activeTab === "donate") {
      axios
        .get("http://localhost:5000/fundraise")
        .then((res) => setFundraisers(res.data))
        .catch((err) =>
          console.error("Error fetching fundraise applicants:", err)
        );
    }
  }, [activeTab]);

  // ✅ handle donate submit (dummy payment)
  const handleDonate = () => {
    if (!donationAmount) {
      alert("Please enter an amount!");
      return;
    }
    alert(
      `You have donated ${donationAmount} to ${selectedApplicant.fullName}. Thank you!`
    );
    setSelectedApplicant(null); // close modal
    setDonationAmount(""); // reset
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6] flex flex-col items-center py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Crowd Funding</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("fundraise")}
          className={`px-6 py-2 rounded-md font-medium transition ${
            activeTab === "fundraise"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 border"
          }`}
        >
          Fundraise
        </button>
        <button
          onClick={() => setActiveTab("donate")}
          className={`px-6 py-2 rounded-md font-medium transition ${
            activeTab === "donate"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 border"
          }`}
        >
          Donate
        </button>
      </div>

      {/* Fundraise Form */}
      {activeTab === "fundraise" && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 border">
          <form onSubmit={handleSubmit(handleFundraise)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Tittle
              </label>
              <input
                type="text"
                {...register("fullName", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter fundraising campaign title"
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  Valid email is required
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                type="text"
                {...register("phone", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">Phone is required</span>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Address
              </label>
              <input
                type="text"
                {...register("address", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your address"
              />
              {errors.address && (
                <span className="text-red-500 text-sm">Address is required</span>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Currency
              </label>
              <select
                {...register("currency", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">Select Currency</option>
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
              </select>
              {errors.currency && (
                <span className="text-red-500 text-sm">Select a currency</span>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Payment Method
              </label>
              <select
                {...register("paymentMethod", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">Select Payment</option>
                <option value="Bkash">Bkash</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
              </select>
              {errors.paymentMethod && (
                <span className="text-red-500 text-sm">Select a method</span>
              )}
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Purpose
              </label>
              <select
                {...register("purpose", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">Select Purpose</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
              {errors.purpose && (
                <span className="text-red-500 text-sm">Select a purpose</span>
              )}
            </div>

            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Donation Type
              </label>
              <select
                {...register("donationType", { required: true })}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="One Time">One Time</option>
                <option value="Monthly">Monthly</option>
              </select>
              {errors.donationType && (
                <span className="text-red-500 text-sm">Select type</span>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={3}
                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Write your message"
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("termsAgreed", { required: true })}
              />
              <label className="text-sm text-gray-700">
                I agree to the terms and privacy policy.
              </label>
            </div>
            {errors.termsAgreed && (
              <span className="text-red-500 text-sm">
                You must agree before submit
              </span>
            )}

            {/* Submit */}
            <input
              type="submit"
              value="Submit Fundraise"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md 
                hover:bg-green-700 transition-colors cursor-pointer font-medium shadow-md"
            />
          </form>
        </div>
      )}

      {/* Donation Section */}
      {activeTab === "donate" && (
        <div className="w-full max-w-5xl">
          {fundraisers.length === 0 ? (
            <p className="text-gray-600 text-center">No fundraise applicants yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundraisers.map((applicant) => (
                <div
                  key={applicant._id}
                  className="bg-white shadow-lg rounded-2xl p-5 border hover:shadow-xl transition"
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {applicant.fullName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Purpose:{" "}
                    <span className="font-medium">{applicant.purpose}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Donation Type:{" "}
                    <span className="font-medium">{applicant.donationType}</span>
                  </p>
                  <p className="text-gray-700 text-sm mb-4">
                    {applicant.message || "No message provided."}
                  </p>
                  <button
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    Donate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Donation Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Donate to {selectedApplicant.fullName}
            </h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleDonate}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="flex-1 bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crowdfunding;
