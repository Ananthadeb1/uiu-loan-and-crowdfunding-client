
import { FaCoins } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { MdOutlineSimCardDownload } from 'react-icons/md';
import { Link } from 'react-router-dom';
// import { MdOutlineCrowd } from 'react-icons/md';

const services = [
    {
        title: 'Take Loan',
        description: 'Provides comprehensive and unbiased reviews of various types of loans...',
        icon: <FaCoins size={30} className="mb-4 text-yellow-400" />,
        link: '/loan-request'
    },
    {
        title: 'Invest',
        description: 'Provides comprehensive and unbiased reviews of various types of loans...',
        icon: <GiMoneyStack size={30} className="mb-4 text-red-500" />,
        link: '#'
    },
    {
        title: 'Crowdfunding',
        description: 'Provides comprehensive and unbiased reviews of various types of loans...',
        icon: <MdOutlineSimCardDownload size={30} className="mb-4 text-blue-400" />,
        link: '/crowdfunding'
    },
];

const Services = () => {
    return (
        <section className="py-16 px-6 ">
            <div className="container mx-auto px-4 text-center md:text-left">
                <div className='text-center'>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Featured Services</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Empowering You with Loan and Comparison Tools
                    </h2>
                    <p className="text-gray-600 mb-10">
                        We are dedicated to providing you with valuable services that simplify your loan search and empower you to make informed borrowing decisions.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl shadow-lg flex flex-col items-center bg-gray-300 text-gray-900 hover:bg-green-800 hover:text-white`}
                        >
                            {service.icon}
                            <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                            <p className="text-center text-sm">{service.description}</p>
                            {/* <Link to={service.link}></Link> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
