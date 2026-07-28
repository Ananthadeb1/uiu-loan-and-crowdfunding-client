
import { FaCoins, FaHandHoldingUsd, FaUsers } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const services = [
    {
        title: 'Apply For Loan',
        description: 'Instant student & personal peer-to-peer loan requests with quick verification and transparent terms.',
        icon: <FaCoins size={36} className="text-[#0A7265] group-hover:text-[#F9D56E] transition-colors" />,
        link: '/loan-request',
        btnText: 'Request Loan'
    },
    {
        title: 'Peer-to-Peer Invest',
        description: 'Lend funds directly to verified campus peers with competitive returns and flexible repayment terms.',
        icon: <GiMoneyStack size={36} className="text-emerald-600 group-hover:text-[#F9D56E] transition-colors" />,
        link: '/loan-bidding',
        btnText: 'Browse Bids'
    },
    {
        title: 'Campus Crowdfunding',
        description: 'Raise capital or back innovative campus projects, emergency student relief, and academic ventures.',
        icon: <FaHandHoldingUsd size={36} className="text-amber-500 group-hover:text-[#F9D56E] transition-colors" />,
        link: '/crowdfunding',
        btnText: 'Explore Projects'
    },
];

const Services = () => {
    return (
        <section className="py-20 px-6 bg-slate-50">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold text-[#0A7265] uppercase tracking-wider bg-[#0A7265]/10 px-3 py-1 rounded-full border border-[#0A7265]/20">
                        Featured Services
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
                        Empowering Students & Backers
                    </h2>
                    <p className="text-slate-600 text-base">
                        Simplifying financial access with direct peer-to-peer loans, crowdfunding tools, and transparent comparisons.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-[#0A7265] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4 hover:-translate-y-1"
                        >
                            <div className="p-4 rounded-2xl bg-slate-100 group-hover:bg-[#0A7265] transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
                            <Link 
                                to={service.link}
                                className="w-full py-3 px-4 rounded-xl bg-slate-100 group-hover:bg-[#0A7265] text-slate-800 group-hover:text-white font-bold text-sm transition-colors duration-300 flex items-center justify-center space-x-2 shadow-sm"
                            >
                                <span>{service.btnText}</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

