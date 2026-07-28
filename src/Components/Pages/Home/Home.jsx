import { useState } from "react";
import { Link } from "react-router-dom";
import Banner from "./Banner/Banner";
import Services from "./Services/Services";
import { 
    FaShieldAlt, 
    FaBolt, 
    FaPercentage, 
    FaUserCheck, 
    FaQuoteLeft, 
    FaStar, 
    FaChevronDown, 
    FaChevronUp,
    FaRegLightbulb,
    FaHandsHelping
} from "react-icons/fa";

const Home = () => {
    // Accordion open state for FAQ section
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const stats = [
        { label: "Total Loans Funded", value: "$2.4M+", change: "Over 1,200 loans" },
        { label: "Successful Repayment Rate", value: "99.4%", change: "Verified student trust" },
        { label: "Active Donors & Lenders", value: "3,800+", change: "Growing P2P community" },
        { label: "Average Approval Speed", value: "< 24 Hours", change: "Instant online process" },
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Submit Loan / Project Request",
            desc: "Fill out a quick application detailing your funding target, repayment period, or campaign goal."
        },
        {
            step: "02",
            title: "Campus Verification & Match",
            desc: "Our automated checks & admin review verify student identity and match you with lenders or backers."
        },
        {
            step: "03",
            title: "Receive Direct Funds",
            desc: "Get funds transferred directly to your account with clear, transparent terms and zero surprise fees."
        }
    ];

    const featuredCampaigns = [
        {
            id: 1,
            title: "UIU Robotics Team International Competition",
            category: "Academic & Tech",
            raised: 4200,
            goal: 5000,
            backers: 64,
            daysLeft: 5,
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            title: "Emergency Student Laptop Aid Fund",
            category: "Student Relief",
            raised: 1800,
            goal: 2000,
            backers: 38,
            daysLeft: 2,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            title: "Green Campus Solar Charging Station",
            category: "Campus Sustainability",
            raised: 3100,
            goal: 4000,
            backers: 52,
            daysLeft: 12,
            image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
        }
    ];

    const testimonials = [
        {
            name: "Tanvir Ahmed",
            role: "CS Student, UIU",
            comment: "PeerFund made paying my semester fees stress-free! I got approved within 12 hours with fair terms.",
            rating: 5
        },
        {
            name: "Nusrat Jahan",
            role: "Alumni Donor & Lender",
            comment: "As an alumnus, giving back and supporting current UIU students through micro-loans has been immensely rewarding.",
            rating: 5
        },
        {
            name: "Rafiqul Islam",
            role: "Engineering Student",
            comment: "Our robotics project was fully funded in 4 days thanks to generous peer donors on this platform!",
            rating: 5
        }
    ];

    const faqs = [
        {
            q: "Who is eligible to apply for a loan or start a crowdfunding campaign?",
            a: "All verified UIU students, faculty, and alumni are eligible to apply. Identity and enrollment status are verified during signup."
        },
        {
            q: "How are interest rates and repayment terms calculated?",
            a: "Interest rates are capped at student-friendly rates with complete transparency. Repayment terms range from 3 to 24 months based on loan size."
        },
        {
            q: "What happens after I submit a crowdfunding or loan request?",
            a: "Your application is reviewed by our admin panel and listed on the platform for peer lenders and donors to fund."
        },
        {
            q: "Is my personal financial information secure?",
            a: "Yes! PeerFund uses top-tier encryption, secure JWT token authentication, and Firebase infrastructure to safeguard your data."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            
            {/* 1. Hero Banner */}
            <Banner />

            {/* 2. Live Impact Stats Bar */}
            <section className="bg-[#0A7265] text-white py-10 px-6 shadow-inner">
                <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-4 border-r last:border-r-0 border-white/20">
                            <h3 className="text-3xl md:text-4xl font-extrabold text-[#F9D56E]">{stat.value}</h3>
                            <p className="font-bold text-sm mt-1">{stat.label}</p>
                            <p className="text-xs text-emerald-200 mt-0.5">{stat.change}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Featured Services */}
            <Services />

            {/* 4. How It Works (3 Steps) */}
            <section className="py-20 px-6 bg-white border-y border-slate-200">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#0A7265] uppercase tracking-wider bg-[#0A7265]/10 px-3.5 py-1.5 rounded-full">
                            Simple & Transparent Process
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
                            How PeerFund Works
                        </h2>
                        <p className="text-slate-600">Get funded or invest in campus peers in 3 easy steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {howItWorks.map((hw, idx) => (
                            <div key={idx} className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all">
                                <span className="text-4xl font-black text-[#0A7265]/20 block">{hw.step}</span>
                                <h3 className="text-xl font-bold text-slate-800">{hw.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{hw.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link 
                            to="/loan-request"
                            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#0A7265] hover:bg-[#075349] text-white font-bold rounded-xl shadow-lg shadow-[#0A7265]/20 transition-all"
                        >
                            <span>Start Your Application</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. Featured Crowdfunding Projects Preview */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold text-[#0A7265] uppercase tracking-wider bg-[#0A7265]/10 px-3.5 py-1.5 rounded-full">
                                Community Causes
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
                                Active Crowdfunding Projects
                            </h2>
                        </div>
                        <Link 
                            to="/crowdfunding"
                            className="px-5 py-2.5 bg-white border border-slate-300 text-[#0A7265] font-bold rounded-xl hover:bg-[#0A7265] hover:text-white transition-all text-sm shadow-sm"
                        >
                            View All Projects &rarr;
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredCampaigns.map((camp) => {
                            const percent = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
                            return (
                                <div key={camp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={camp.image} alt={camp.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        <span className="absolute top-3 left-3 bg-[#0A7265] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                            {camp.category}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg line-clamp-2">{camp.title}</h3>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                                <span>${camp.raised.toLocaleString()} raised</span>
                                                <span className="text-[#0A7265]">{percent}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-[#0A7265] to-[#F9D56E] rounded-full" style={{ width: `${percent}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500 pt-1">
                                                <span>Goal: ${camp.goal.toLocaleString()}</span>
                                                <span>{camp.daysLeft} days left</span>
                                            </div>
                                        </div>

                                        <Link
                                            to="/crowdfunding"
                                            className="w-full py-2.5 bg-[#0A7265] hover:bg-[#075349] text-white font-bold text-center rounded-xl text-sm transition shadow-sm block"
                                        >
                                            Back This Project
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Why Choose PeerFund (Feature Grid) */}
            <section className="py-20 px-6 bg-white border-y border-slate-200">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            Why Choose UIU PeerFund?
                        </h2>
                        <p className="text-slate-600">Designed specifically to make peer financial assistance accessible, safe, and efficient.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#0A7265] flex items-center justify-center text-xl font-bold">
                                <FaPercentage />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Student Friendly Rates</h3>
                            <p className="text-slate-600 text-sm">Capped micro-loan rates designed for student budgets without predatory charges.</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
                                <FaUserCheck />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">100% Verified Users</h3>
                            <p className="text-slate-600 text-sm">Every borrower and lender is authenticated through campus ID & secure Firebase Auth.</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                                <FaBolt />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Fast Disbursal</h3>
                            <p className="text-slate-[#64748b] text-sm">Quick application review & direct funding matching in less than 24 hours.</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
                                <FaShieldAlt />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Bank-Grade Security</h3>
                            <p className="text-slate-600 text-sm">Encrypted transactions, protected user privacy, and automated record checks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Community Testimonials */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#0A7265] uppercase tracking-wider bg-[#0A7265]/10 px-3.5 py-1.5 rounded-full">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
                            What Our Community Says
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex text-amber-400 space-x-1">
                                        {[...Array(t.rating)].map((_, r) => (
                                            <FaStar key={r} />
                                        ))}
                                    </div>
                                    <FaQuoteLeft className="text-[#0A7265]/20 text-3xl" />
                                    <p className="text-slate-600 text-sm italic leading-relaxed">"{t.comment}"</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-800">{t.name}</h4>
                                    <p className="text-xs text-[#0A7265] font-semibold">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FAQ Section */}
            <section className="py-20 px-6 bg-white border-y border-slate-200">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold text-[#0A7265] uppercase tracking-wider bg-[#0A7265]/10 px-3.5 py-1.5 rounded-full">
                            Got Questions?
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-5 text-left font-bold text-slate-800 flex justify-between items-center space-x-4 hover:bg-slate-100 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    {openFaqIndex === index ? (
                                        <FaChevronUp className="text-[#0A7265]" />
                                    ) : (
                                        <FaChevronDown className="text-slate-400" />
                                    )}
                                </button>
                                {openFaqIndex === index && (
                                    <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Final Call To Action Banner */}
            <section className="py-16 px-6 bg-gradient-to-r from-[#0A7265] to-[#129A88] text-white">
                <div className="container mx-auto max-w-5xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold">
                        Ready to Access Fair Student Funding or Support Peers?
                    </h2>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-base">
                        Join thousands of students and lenders building a stronger campus financial network today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link 
                            to="/loan-request" 
                            className="px-8 py-3.5 bg-[#F9D56E] text-slate-900 font-bold rounded-xl shadow-lg hover:bg-[#e6c15a] transition-all transform hover:-translate-y-0.5"
                        >
                            Request a Loan Now
                        </Link>
                        <Link 
                            to="/crowdfunding" 
                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 backdrop-blur-md transition-all"
                        >
                            Explore Crowdfunding
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;