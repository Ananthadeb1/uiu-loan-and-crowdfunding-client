import Banner from "./Banner/Banner";
import Services from "./Services/Services";

const Home = () => {

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <Banner></Banner>
            {/* Featured Services */}
            <Services />
            {/* Reviews Section */}
            {/* <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="flex mb-4">
                            {[...Array(6)].map((_, i) => (
                                <svg key={i} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-600 mb-6">
                            Offtake versus beer worked over the years, sometimes by accident, sometimes in purpose
                            labelled human and the tide. It is a long established fact that a reader will be distracted
                            by the redouble content of a page when looking at its layout.
                        </p>
                        <div className="font-bold text-gray-800">JANE DOE</div>
                    </div>
                </div>
            </section> */}


        </div>
    );
};

export default Home;