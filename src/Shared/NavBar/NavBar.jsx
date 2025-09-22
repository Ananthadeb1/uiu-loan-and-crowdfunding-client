import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";

const NavBar = () => {
    const [isAdmin] = useAdmin()
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    console.log(isAdmin);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleLogOut = () => {
        logout()
            .then(() => setMobileMenuOpen(false))
            .catch(error => console.log(error));
    };

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/crowdfunding", label: "Crouwfunding" },
        ...(isAdmin ? [{ path: "/dashboard", label: "Dashboard" }] : [])
    ];

    return (
        <nav className={`sticky top-0 z-50 bg-[#0A7265] shadow-md backdrop-blur-sm transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="px-4 w-full">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-[#F9D56E] tracking-wider">
                        <span className="text-white">Peer</span>Fund
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-2 py-2 font-medium transition-colors duration-300 border-b-2 ${isActive
                                            ? 'text-[#F9D56E] border-[#F9D56E]'
                                            : 'text-white hover:text-[#F9D56E] border-transparent hover:border-[#F9D56E]'}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        {/* loggedUser/Auth Section */}
                        {user ? (
                            <div className="ml-6 flex items-center">
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="cursor-pointer group">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#F9D56E] transition-colors duration-300">
                                            {user.image ? (
                                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-600 text-lg font-medium">
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="mt-2 p-2 shadow-lg menu dropdown-content bg-[#0A7265] rounded-md w-52 border border-[#F9D56E] backdrop-blur-sm">
                                        <li>
                                            <NavLink
                                                to="/userProfile"
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded transition-colors duration-200 ${isActive
                                                        ? 'text-[#F9D56E] bg-[#0A7265]/90'
                                                        : 'text-white hover:bg-[#0A7265]/90 hover:text-[#F9D56E]'}`
                                                }
                                            >
                                                Profile
                                            </NavLink>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogOut}
                                                className="block w-full text-left px-4 py-2 text-white hover:bg-[#0A7265]/90 hover:text-[#F9D56E] rounded transition-colors duration-200"
                                            >
                                                Log out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="ml-6 flex items-center">
                                <NavLink
                                    to={window.location.pathname === "/login" ? "/signup" : "/login"}
                                    className="px-5 py-1.5 rounded-md font-medium transition-colors duration-300 shadow-sm  bg-[#0da795] text-white hover:bg-[#E8C45D]"
                                >
                                    {
                                        window.location.pathname === "/login" ? "Sign up" : "Log in"
                                    }
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-white hover:text-[#F9D56E] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-[#0A7265] backdrop-blur-sm shadow-lg`}>
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'text-[#F9D56E] bg-[#0A7265]/90'
                                    : 'text-white hover:text-[#F9D56E] hover:bg-[#0A7265]/90'}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    {user ? (
                        <>
                            <NavLink
                                to="/userProfile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'text-[#F9D56E] bg-[#0A7265]/90'
                                        : 'text-white hover:text-[#F9D56E] hover:bg-[#0A7265]/90'}`
                                }
                            >
                                Profile
                            </NavLink>
                            <button
                                onClick={handleLogOut}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#F9D56E] hover:bg-[#0A7265]/90"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-[#E8C45D] text-white'
                                    : 'bg-[#0da795] text-white hover:bg-[#E8C45D]'}`
                            }
                        >
                            Log in
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;