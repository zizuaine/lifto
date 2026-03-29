import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";

const Admin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "nu50855@gmail.com",
        password: "herbluesky10"
    });
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviewNotes, setReviewNotes] = useState({});

    const loadSummary = async () => {
        try {
            const data = await adminService.getSummary();
            setSummary(data);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("adminToken")) {
            loadSummary();
        }
    }, []);

    const handleChange = (e) => {
        setCredentials((current) => ({
            ...current,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            const data = await adminService.signin(credentials);
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUser", JSON.stringify(data.admin));
            setSuccess("Admin signed in successfully");
            await loadSummary();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRunDraw = async () => {
        try {
            setError("");
            setSuccess("");
            const data = await adminService.runDraw();
            setSuccess(data.message);
            await loadSummary();
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePublish = async (drawId) => {
        try {
            setError("");
            setSuccess("");
            const data = await adminService.publishResults(drawId);
            setSuccess(data.message);
            await loadSummary();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRollover = async (drawId) => {
        try {
            setError("");
            setSuccess("");
            const data = await adminService.rolloverJackpot(drawId);
            setSuccess(data.message);
            await loadSummary();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReview = async (winnerId, verificationStatus) => {
        try {
            setError("");
            setSuccess("");
            const data = await adminService.reviewWinner(
                winnerId,
                verificationStatus,
                reviewNotes[winnerId] || ""
            );
            setSuccess(data.message);
            await loadSummary();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMarkPaid = async (winnerId) => {
        try {
            setError("");
            setSuccess("");
            const data = await adminService.markWinnerPaid(winnerId);
            setSuccess(data.message);
            await loadSummary();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin");
        window.location.reload();
    };

    if (!localStorage.getItem("adminToken")) {
        return (
            <div className="auth-page page-enter">
                <section className="auth-section">
                    <div className="auth-intro">
                        <span className="auth-small-title">Admin Access</span>
                        <h1>Manage Lifto draws</h1>
                        <p>Sign in with your admin account to run, publish, and review draw results.</p>
                    </div>

                    <div className="auth-card auth-card-small">
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label>Email address</label>
                                <input type="email" name="email" value={credentials.email} onChange={handleChange} />
                            </div>

                            <div className="auth-field">
                                <label>Password</label>
                                <input type="password" name="password" value={credentials.password} onChange={handleChange} />
                            </div>

                            <p className="auth-message">Default admin email: nu50855@gmail.com</p>
                            <p className="auth-message">Default admin password: herbluesky10</p>

                            {error ? <p className="auth-message error-text">{error}</p> : null}
                            {success ? <p className="auth-message success-text">{success}</p> : null}

                            <button className="auth-button" type="submit">
                                {loading ? "Signing In..." : "Admin Sign In"}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="dashboard-page page-enter">
            <section className="dashboard-shell admin-shell">
                <section className="dashboard-section">
                    <div className="dashboard-header">
                        <span className="simple-page-label">Admin</span>
                        <h1>Draw Management</h1>
                        <p>Run simulations, publish results, track winners, and manage jackpot rollover.</p>
                    </div>

                    {error ? <p className="auth-message error-text subscribe-message">{error}</p> : null}
                    {success ? <p className="auth-message success-text subscribe-message">{success}</p> : null}

                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <h2>Active Subscribers</h2>
                            <p className="dashboard-highlight">{summary?.activeSubscribers || 0}</p>
                        </div>

                        <div className="dashboard-card">
                            <h2>Current Jackpot</h2>
                            <p className="dashboard-highlight">${summary?.currentJackpot?.toFixed?.(2) || "0.00"}</p>
                        </div>

                        <div className="dashboard-card">
                            <h2>Run Draw</h2>
                            <p>This app uses random monthly draws only.</p>
                            <button className="plan-button" onClick={handleRunDraw}>Trigger Draw</button>
                            <button className="plan-button profile-logout-button" onClick={handleAdminLogout}>Admin Logout</button>
                        </div>
                    </div>

                    <div className="dashboard-card admin-panel-block">
                        <h2>Recent Draws</h2>
                        {summary?.draws?.length ? (
                            <div className="results-list">
                                {summary.draws.map((draw) => (
                                    <div key={draw._id} className="result-item">
                                        <p>Status: {draw.status}</p>
                                        <p>Logic: {draw.logicType}</p>
                                        <p>Numbers: {draw.numbers.join(", ")}</p>
                                        <p>Total pool: ${draw.totalPool.toFixed(2)}</p>
                                        <div className="admin-actions">
                                            {draw.status !== "published" ? (
                                                <button className="plan-button" onClick={() => handlePublish(draw._id)}>
                                                    Publish Results
                                                </button>
                                            ) : null}
                                            <button className="plan-button" onClick={() => handleRollover(draw._id)}>
                                                Jackpot Rollover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No draws have been triggered yet.</p>
                        )}
                    </div>

                    <div className="dashboard-card admin-panel-block">
                        <h2>Recent Winners</h2>
                        {summary?.winners?.length ? (
                            <div className="results-list">
                                {summary.winners.map((winner) => (
                                    <div key={winner._id} className="result-item">
                                        <p>
                                            {(winner.userId?.firstname || "User")} {(winner.userId?.lastname || "")}
                                        </p>
                                        <p>{winner.matchCount}-match</p>
                                        <p>Prize: ${winner.prize.toFixed(2)}</p>
                                        <p>Verification: {winner.verificationStatus}</p>
                                        <p>Payout: {winner.payoutStatus}</p>
                                        {winner.proofUrl ? (
                                            <p>Proof: <a href={winner.proofUrl} target="_blank" rel="noreferrer">Open proof</a></p>
                                        ) : (
                                            <p>Proof: Not submitted yet</p>
                                        )}
                                        <textarea
                                            className="admin-note-input"
                                            placeholder="Review notes"
                                            value={reviewNotes[winner._id] || ""}
                                            onChange={(e) => setReviewNotes((current) => ({
                                                ...current,
                                                [winner._id]: e.target.value
                                            }))}
                                        />
                                        <div className="admin-actions">
                                            <button className="plan-button" onClick={() => handleReview(winner._id, "approved")}>
                                                Approve
                                            </button>
                                            <button className="plan-button" onClick={() => handleReview(winner._id, "rejected")}>
                                                Reject
                                            </button>
                                            {winner.verificationStatus === "approved" && winner.payoutStatus !== "paid" ? (
                                                <button className="plan-button" onClick={() => handleMarkPaid(winner._id)}>
                                                    Mark Paid
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No winners recorded yet.</p>
                        )}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default Admin;
