// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLoginMutation } from "./userLoginApi"; // Import the hook
// import "./login.css";

// function Login() {
//     const [loginData, setLoginData] = useState({ username: "", password: "" });
//     const navigate = useNavigate();

//     // 1. Initialize the mutation hook
//     const [login, { isLoading, error }] = useLoginMutation();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // 2. Trigger the mutation and unwrap the result
//             const data = await login(loginData).unwrap();

//             if (data.token) {
//                 localStorage.setItem("token", data.token);
//                 navigate('/');
//             }
//         } catch (err) {
//             // RTK Query catches errors automatically; 'error' object above will update
//             console.error("Login failed:", err);
//         }
//     };

//     const loginOnChangeHandler = (e) => {
//         const { name, value } = e.target;
//         setLoginData({ ...loginData, [name]: value });
//     };

//     return (
//         <div className="login-container">
//             <form className="login-form" onSubmit={handleSubmit}>
//                 <h2>Login</h2>

//                 <button onClick={() => {
//                     window.location.href = "http://localhost:5000/auth/google";
//                 }}>
//                     Login with Google
//                 </button>

//                 {/* 3. Display error message from the hook */}
//                 {error && <p className="error-msg">{error.data?.message || "Something went wrong"}</p>}

//                 <div className="form-group">
//                     <label htmlFor="username">Username:</label>
//                     <input
//                         id="username"
//                         type="text"
//                         name="username"
//                         value={loginData.username}
//                         onChange={loginOnChangeHandler}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">Password:</label>
//                     <input
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={loginData.password}
//                         onChange={loginOnChangeHandler}
//                         required
//                     />
//                 </div>

//                 {/* 4. Disable button while loading */}
//                 <button type="submit" disabled={isLoading}>
//                     {isLoading ? "Logging in..." : "Login"}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default Login;





import React, { useState } from "react";
import { useUserService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
    const { login, loading, error } = useUserService();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(form)
            const response = await login(form);

            // 💾 store token
            if (response.token) {
                localStorage.setItem("token", response.token);
                navigate('/');
            }
        } catch (err) {
            console.log("Login failed", err);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error.message}</p>}
        </div>
    );
};

export default Login;