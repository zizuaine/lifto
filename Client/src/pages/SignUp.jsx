import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { charityService } from "../services/charityService";

const SignUp = () => {
    const navigate = useNavigate();
    const [charities, setCharities] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        charityId: "",
        charityPercentage: 10
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add("auth-body");

        const loadCharities = async () => {
            try {
                const data = await charityService.getCharities();
                setCharities(data);

                if (data.length > 0) {
                    setFormData((currentValue) => ({
                        ...currentValue,
                        charityId: data[0]._id
                    }));
                }
            } catch (err) {
                setError(err.message);
            }
        };

        loadCharities();

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
            await authService.signup({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                charityId: formData.charityId,
                charityPercentage: Number(formData.charityPercentage)
            });
            setSuccess("Account created successfully");
            setTimeout(() => {
                navigate("/login");
            }, 900);
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
                    <h1>Create your account</h1>
                    <p>Join Lifto, support a charity, and get ready to track your scores.</p>
                </div>

                <div className="auth-card auth-card-small">
                    <div className="auth-toggle">
                        <Link className="toggle-link" to="/login">Sign In</Link>
                        <Link className="toggle-link active-toggle" to="/signup">Create Account</Link>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-row">
                            <div className="auth-field">
                                <label>First name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="First name"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="auth-field">
                                <label>Last name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last name"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-field">
                            <label>Select your charity</label>
                            <select
                                name="charityId"
                                value={formData.charityId}
                                onChange={handleChange}
                            >
                                {charities.map((charity) => (
                                    <option key={charity._id} value={charity._id}>
                                        {charity.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="auth-field">
                            <label>Charity percentage</label>
                            <select
                                name="charityPercentage"
                                value={formData.charityPercentage}
                                onChange={handleChange}
                            >
                                <option value={10}>10%</option>
                                <option value={15}>15%</option>
                                <option value={20}>20%</option>
                                <option value={25}>25%</option>
                            </select>
                        </div>

                        {error ? <p className="auth-message error-text">{error}</p> : null}
                        {success ? <p className="auth-message success-text">{success}</p> : null}

                        <button className="auth-button" type="submit">
                            {loading ? "Creating Account..." : "Continue to Plans"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SignUp;
