import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add("auth-body");

        return () => {
            document.body.classList.remove("auth-body");
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await authService.signin(formData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setSuccess("Signed in successfully");
            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page page-enter">
            <section className="auth-section">
                <div className="auth-intro">
                    <span className="auth-small-title">Lifto Account</span>
                    <h1>Welcome back</h1>
                    <p>Sign in to your account and continue your round for good.</p>
                </div>

                <div className="auth-card auth-card-small">
                    <div className="auth-toggle">
                        <Link className="toggle-link active-toggle" to="/login">Sign In</Link>
                        <Link className="toggle-link" to="/signup">Create Account</Link>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error ? <p className="auth-message error-text">{error}</p> : null}
                        {success ? <p className="auth-message success-text">{success}</p> : null}

                        <button className="auth-button" type="submit">
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
