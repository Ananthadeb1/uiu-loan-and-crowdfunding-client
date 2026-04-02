import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "../../Shared/SocialLogin/SocialLogin";

const Signup = () => {
    const axiosPublic = useAxiosPublic();
    const { register, setError, formState: { errors }, } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const handleSignup = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            confirm_password: form.confirm_password.value,
            role: form.role.value
        };
        const name = data.name;
        const email = data.email;
        const password1 = data.password;
        const password2 = data.confirm_password;
        const role = data.role;

        if (password1.length < 6) {
            setError("password", { type: "manual", message: "Password must be at least 6 characters long" });
            return;
        }
        else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password1)) {
            setError("password", { type: "manual", message: "Password must contain at least one letter, one number, and one special character" });
            return;
        }
        if (password1 !== password2) {
            setError("confirm_password", { type: "manual", message: "Passwords do not match!" });
            return;
        }

        createUser(email, password1)
            .then(result => {
                updateUserProfile(result.name, "") // Fix: Pass name and empty string for photo
                    .then(() => {
                        console.log("User profile updated successfully");
                        const userInfo = {
                            uid: result.user.uid,
                            name: name,
                            email: email,
                            password: password1,
                            role: role,
                            image: ""
                        }
                        axiosPublic.post("/users", userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    console.log("User info saved to database:", res.data);
                                }
                                else console.log("User info not saved to database:", res.data);
                            });
                        navigate("/");
                    })
                    .catch(error => {
                        console.error("Error updating user profile:", error);
                    });
            }).catch(error => {
                if (error.code === "auth/email-already-in-use") {
                    setError("email", { type: "manual", message: "Email is already in use. Please use a different email." });
                } else if (error.code === "auth/invalid-email") {
                    setError("email", { type: "manual", message: "Invalid email format. Please enter a valid email." });
                } else if (error.code === "auth/weak-password") {
                    setError("password", { type: "manual", message: "Password is too weak. Please use a stronger password." });
                } else {
                    setError("form", { type: "manual", message: "Failed to create user. Please try again." });
                }
            });

    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6EDEB] to-[#D1E0DD]">
            <div className="w-full max-w-md my-8 p-8 bg-white rounded-xl shadow-lg border border-black/20">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-black">Create a new account</h1>
                    <p className="text-black/80">Sign up to get started</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-6 ">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            {...register("name", { required: true })}
                            className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent"
                            placeholder="Enter your full name"
                        />
                        {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Sign up as a: </label>
                        <select
                            name="role"
                            {...register("role", { required: true })}
                            className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent"
                            defaultValue=""
                        >
                            <option value="" disabled>Select role</option>
                            <option value="donor">Donor</option>
                            <option value="user">User</option>
                            {/* <option value="admin">Admin</option> */}
                        </select>
                        {errors.role && <span className="text-red-500 text-sm">This field is required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Email / Number</label>
                        <input
                            type="email"
                            {...register("email")}
                            name="email"
                            className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent"
                            placeholder="Enter your email or number"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                name="password"
                                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent pr-10"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-black"
                                tabIndex={-1}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirm_password")}
                                name="confirm_password"
                                className="w-full bg-white px-4 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D56E] focus:border-transparent pr-10"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-black"
                                tabIndex={-1}
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        {errors.confirm_password && <span className="text-red-500 text-sm">{errors.confirm_password.message}</span>}
                    </div>
                    <input
                        className="w-full bg-[#9A6456] text-white py-3 px-4 rounded-md hover:bg-[#8A5A4D] transition-colors cursor-pointer font-medium shadow-md"
                        type="submit"
                        value="Register"
                    />
                    <SocialLogin></SocialLogin>
                    <p className="text-center text-sm text-black">
                        Already have an account? <Link to={"/login"} className="text-[#9A6456] hover:underline font-medium">Find my account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;