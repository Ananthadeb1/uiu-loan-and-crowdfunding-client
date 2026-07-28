import { Link } from "react-router-dom";
const bannerImage = "/images/Banner/Banner-Man.png";


const Banner = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A7265]/10 via-[#0A7265]/5 to-amber-500/10 py-16 px-6 border-b border-emerald-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left text content */}
                <div className="md:w-7/12 text-center md:text-left space-y-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0A7265]/10 text-[#0A7265] border border-[#0A7265]/20">
                        ✨ #1 Student & Peer-to-Peer Finance Platform
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                        Find the <span className="text-[#0A7265] underline decoration-[#F9D56E] decoration-4">Perfect Loan</span> & Support Your Community
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
                        Welcome to <span className="font-bold text-[#0A7265]">PeerFund</span>. Skip traditional bank hassles. Get direct student loans, compare rates, or back peer crowdfunding projects securely.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        <Link 
                            to="/loan-request" 
                            className="px-7 py-3.5 bg-[#0A7265] text-white rounded-xl hover:bg-[#075349] font-bold shadow-lg shadow-[#0A7265]/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Apply For Loan
                        </Link>
                        <Link 
                            to="/crowdfunding" 
                            className="px-7 py-3.5 bg-[#F9D56E] text-slate-900 rounded-xl hover:bg-[#e6c15a] font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Become a Lender / Donor
                        </Link>
                        <Link 
                            to="/loan-comparison" 
                            className="px-7 py-3.5 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 font-bold transition-all"
                        >
                            Compare Rates
                        </Link>
                    </div>
                </div>

                {/* Right illustration */}
                <div className="md:w-5/12 flex justify-center md:justify-end">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#0A7265]/20 to-[#F9D56E]/30 blur-2xl opacity-70"></div>
                        <img 
                            src={bannerImage} 
                            alt="PeerFund Loan & Finance Illustration" 
                            className="relative w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;