import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAuth from '../../Hooks/useAuth';
import SocialLogin from '../../Shared/SocialLogin/SocialLogin';

const Login = () => {
    const { login, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({ email: '', password: '', general: '' });
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        let hasError = false;
        const newErrors = { email: '', password: '', general: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            hasError = true;
        }
        if (!password) {
            newErrors.password = 'Password is required';
            hasError = true;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        login(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                setUser(user);
                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error("Login failed:", error);
                setErrors({ ...newErrors, general: 'Invalid email or password' });
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6EDEB] to-[#D1E0DD]">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-black/20">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-black">Login now!</h1>
                    <p className="text-black/80">Sign in to your account</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-black"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                            >
                                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="text-right">
                        <a className="text-[#9A6456] hover:underline text-sm">Forgot password?</a>
                    </div>
                    <input
                        className="w-full bg-[#9A6456] text-white py-3 px-4 rounded-md hover:bg-[#8A5A4D] transition-colors cursor-pointer font-medium shadow-md"
                        type="submit"
                        value="Login"
                    />
                    {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
                </form>
                <SocialLogin></SocialLogin>
                <div className="mt-6">
                    <p className="text-center text-sm text-black">
                        New Here? <Link to={"/signup"} className="text-[#9A6456] hover:underline font-medium">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;