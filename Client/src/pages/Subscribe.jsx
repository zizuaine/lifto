import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { drawService } from "../services/drawService";

const plans = [
    {
        name: "Standard Plan",
        price: "$12",
        billing: "billed monthly",
        detail: "Great for getting started with Lifto.",
        points: [
            "1 charity selection",
            "Monthly prize draw access",
            "Track your latest 5 scores",
            "Simple monthly billing"
        ],
        buttonText: "Choose Standard",
        badge: "Most Simple"
    },
    {
        name: "Premium Plan",
        price: "$120",
        billing: "billed yearly",
        detail: "Discounted yearly rate with better value.",
        points: [
            "Everything in Standard",
            "Priority access to special draws",
            "Yearly billing at $10/month value",
            "2 months free compared to $12 monthly"
        ],
        buttonText: "Choose Premium",
        badge: "Best Value"
    }
];

const Subscribe = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingPlan, setLoadingPlan] = useState("");

    const handleSubscribe = async (plan) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoadingPlan(plan);
            setError("");
            setSuccess("");
            await drawService.subscribe(plan);
            setSuccess("Subscription activated successfully");
            setTimeout(() => {
                navigate("/dashboard");
            }, 700);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingPlan("");
        }
    };

    return (
        <div className="subscribe-page page-enter">
            <section className="subscribe-section">
                <div className="subscribe-intro">
                    <span className="subscribe-small-title">Membership Plans</span>
                    <h1>Choose your Lifto subscription</h1>
                    <p>
                        Start with a simple monthly plan or save more with a discounted yearly membership.
                    </p>
                </div>

                <div className="plans-grid">
                    {plans.map((plan) => (
                        <div key={plan.name} className="plan-card">
                            <span className="plan-badge">{plan.badge}</span>
                            <h2>{plan.name}</h2>
                            <div className="plan-price-row">
                                <span className="plan-price">{plan.price}</span>
                                <span className="plan-billing">{plan.billing}</span>
                            </div>
                            <p className="plan-detail">{plan.detail}</p>

                            <div className="plan-points">
                                {plan.points.map((point) => (
                                    <p key={point}>{point}</p>
                                ))}
                            </div>
                            <button
                                className="plan-button"
                                onClick={() => handleSubscribe(plan.name.includes("Premium") ? "premium" : "standard")}
                            >
                                {loadingPlan === (plan.name.includes("Premium") ? "premium" : "standard")
                                    ? "Processing..."
                                    : plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {!localStorage.getItem("token") ? (
                    <p className="subscribe-helper">
                        Log in first to activate a plan. New here? <Link to="/signup">Create an account</Link>.
                    </p>
                ) : null}

                {error ? <p className="auth-message error-text subscribe-message">{error}</p> : null}
                {success ? <p className="auth-message success-text subscribe-message">{success}</p> : null}
            </section>
        </div>
    );
};

export default Subscribe;
