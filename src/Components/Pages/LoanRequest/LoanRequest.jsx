import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false
});

const OUTER_BG = "#E6EDEB";   // page background
const FORM_BG  = "#FFFFFF";   // card background
const INPUT_BG = "#F5F6F7";   // inputs fixed color
const INPUT_TX = "#000000";   // black text
const SUBMIT_BG = "#084C7F";  // submit button
const RESET_BG = "#FEE2E2";   // reset button
const RESET_BD = "#FCA5A5";
const RESET_TX = "#7F1D1D";

// White toast (auto-hide, border indicates success/error)
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
    color: "#0F172A",                  // dark text on white
    background: "#FFFFFF",             // white background
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

const LoanRequest = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { loanAmount: "", purpose: "", repaymentTime: "" }
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        loanAmount: Number(values.loanAmount),
        purpose: values.purpose.trim(),
        repaymentTime: Number(values.repaymentTime), // months
        requestedAt: new Date().toISOString()
      };
      const res = await api.post("/api/loans", payload);
      toast(res?.data?.message || "Loan request submitted", "success");
      reset();
    } catch (e) {
      toast(e?.response?.data?.message || "Submit failed", "error");
    }
  };

  const label = "label-text font-medium text-black";
  const input =
    "input input-bordered w-full text-black border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:text-black active:text-black";

  const lockedInputStyle = {
    backgroundColor: INPUT_BG,
    color: INPUT_TX,
    caretColor: INPUT_TX
  };

  return (
    <div className="min-h-[70vh] py-12" style={{ backgroundColor: OUTER_BG }}>
      <div className="max-w-4xl mx-auto px-4">
        <style>{`
          /* Force #F5F6F7 input background and black text across states */
          [data-loan] input[type="text"],
          [data-loan] input[type="number"] {
            background-color: ${INPUT_BG} !important;
            color: ${INPUT_TX} !important;
          }
          [data-loan] input[type="text"]::placeholder,
          [data-loan] input[type="number"]::placeholder {
            color: #6B7280 !important;
            opacity: 1 !important;
          }
          [data-loan] input[type="text"]:focus,
          [data-loan] input[type="number"]:focus,
          [data-loan] input[type="text"]:active,
          [data-loan] input[type="number"]:active,
          [data-loan] input[type="text"]:disabled,
          [data-loan] input[type="number"]:disabled {
            background-color: ${INPUT_BG} !important;
            color: ${INPUT_TX} !important;
          }
          /* Remove number input steppers */
          [data-loan] input[type="number"]::-webkit-outer-spin-button,
          [data-loan] input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          [data-loan] input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>

        <div
          className="card shadow-xl border"
          style={{ backgroundColor: FORM_BG, borderColor: "#E5E7EB" }}
          data-loan
        >
          <div className="card-body">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Loan request
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={label}>Loan amount*</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  className={input}
                  style={lockedInputStyle}
                  {...register("loanAmount", {
                    required: "Loan amount is required",
                    min: { value: 1, message: "Must be a positive number" }
                  })}
                />
                {errors.loanAmount && <p className="text-red-600 text-sm mt-1">{errors.loanAmount.message}</p>}
              </div>

              <div>
                <label className={label}>Repayment time (months)*</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 36"
                  className={input}
                  style={lockedInputStyle}
                  {...register("repaymentTime", {
                    required: "Repayment time is required",
                    min: { value: 1, message: "At least 1 month" },
                    max: { value: 480, message: "Too long" }
                  })}
                />
                {errors.repaymentTime && <p className="text-red-600 text-sm mt-1">{errors.repaymentTime.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={label}>Purpose of loan*</label>
                <input
                  type="text"
                  placeholder="e.g., Education, Medical"
                  className={input}
                  style={lockedInputStyle}
                  {...register("purpose", {
                    required: "Purpose is required",
                    minLength: { value: 3, message: "Please add a few more details" }
                  })}
                />
                {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose.message}</p>}
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn normal-case text-white border-0 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: SUBMIT_BG }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                  className="btn normal-case"
                  style={{
                    backgroundColor: RESET_BG,
                    color: RESET_TX,
                    border: `1px solid ${RESET_BD}`
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFE4E6")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = RESET_BG)}
                >
                  Reset
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRequest;
