import bannerImage from "../../../../../public/images/Banner/Banner-Man.png"

const Banner = () => {
    return (
        <div>
            <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-yellow-50">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    {/* Left text content */}
                    <div className="md:w-7/12 text-center md:text-left mb-10 md:mb-0">
                        <h3 className="text-lg text-gray-600 mb-2">Compare and Choose the Best Loan</h3>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Find the <span className="text-green-600">Perfect</span> Loan for Your Needs
                        </h1>
                        <p className="text-gray-700 mb-6 max-w-md">
                            Welcome to <span className="font-semibold text-yellow-700">Peer Fund</span>, your trusted resource for financial loan reviews and comparisons. Skip the bank and get your loan from the ones that trust you.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <button className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 font-medium transition-colors">
                                apply for loan
                            </button>
                            <button className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors">
                                become a lender
                            </button>
                        </div>
                    </div>

                    {/* Right illustration */}
                    <div className="md:w-5/12 flex justify-center md:justify-end -ml-6 md:-ml-0">
                        <img src={bannerImage} alt="Loan illustration" className="w-full max-w-md" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Banner;