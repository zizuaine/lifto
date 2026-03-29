import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { drawService } from "../services/drawService";

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [scoreForm, setScoreForm] = useState({ score: "", date: "", course: "" });
    const [proofLinks, setProofLinks] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingScore, setSavingScore] = useState(false);
    const [activePanel, setActivePanel] = useState("scores");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await drawService.getDashboard();
            setDashboard(data);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleScoreChange = (e) => {
        setScoreForm((current) => ({
            ...current,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveScore = async (e) => {
        e.preventDefault();

        try {
            setSavingScore(true);
            setError("");
            setSuccess("");
            await drawService.addScore(scoreForm.score, scoreForm.date || undefined, scoreForm.course);
            setSuccess("Score saved successfully. Your draw numbers were updated from your latest 5 scores.");
            setScoreForm({ score: "", date: "", course: "" });
            await loadDashboard();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingScore(false);
        }
    };

    const handleProofChange = (winnerId, value) => {
        setProofLinks((current) => ({
            ...current,
            [winnerId]: value
        }));
    };

    const handleProofSubmit = async (winnerId) => {
        try {
            setError("");
            setSuccess("");
            await drawService.submitWinnerProof(winnerId, proofLinks[winnerId]);
            setSuccess("Winner proof submitted successfully.");
            await loadDashboard();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="simple-page page-enter">
                <section className="simple-page-section">
                    <span className="simple-page-label">Dashboard</span>
                    <h1>Loading your dashboard...</h1>
                </section>
            </div>
        );
    }

    return (
        <div className="dashboard-page page-enter">
            <section className="dashboard-shell">
                <aside className="dashboard-sidebar">
                    <p className="dashboard-sidebar-label">Main</p>
                    <button className={`dashboard-side-link ${activePanel === "scores" ? "active-side-link" : ""}`} onClick={() => setActivePanel("scores")}>My Scores</button>
                    <button className={`dashboard-side-link ${activePanel === "monthly-draw" ? "active-side-link" : ""}`} onClick={() => setActivePanel("monthly-draw")}>Monthly Draw</button>
                    <button className={`dashboard-side-link ${activePanel === "profile" ? "active-side-link" : ""}`} onClick={() => setActivePanel("profile")}>Profile</button>
                    <button className={`dashboard-side-link ${activePanel === "subscription" ? "active-side-link" : ""}`} onClick={() => setActivePanel("subscription")}>Subscription</button>
                </aside>

                <section className="dashboard-section">
                    <div className="dashboard-header">
                        <span className="simple-page-label">Dashboard</span>
                        <h1>Welcome back, {dashboard?.profile?.firstname || "player"}</h1>
                        <p>Track your subscription, latest 5 scores, auto-generated draw numbers, and winning history.</p>
                    </div>

                    {error ? <p className="auth-message error-text subscribe-message">{error}</p> : null}
                    {success ? <p className="auth-message success-text subscribe-message">{success}</p> : null}

                    {activePanel === "scores" ? (
                        <>
                            <div className="dashboard-split dashboard-split-feature">
                                <div className="dashboard-card">
                                    <h2>Add a Stableford Score</h2>
                                    <form className="score-form" onSubmit={handleSaveScore}>
                                        <input
                                            type="text"
                                            name="course"
                                            value={scoreForm.course}
                                            onChange={handleScoreChange}
                                            placeholder="Golf Club / Course"
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={scoreForm.date}
                                            onChange={handleScoreChange}
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            max="45"
                                            name="score"
                                            value={scoreForm.score}
                                            onChange={handleScoreChange}
                                            placeholder="Stableford Score"
                                        />
                                        <button className="plan-button" type="submit">
                                            {savingScore ? "Saving..." : "Add Score"}
                                        </button>
                                    </form>
                                    <p className="dashboard-note">Your latest 5 scores automatically become your draw numbers.</p>
                                </div>

                                <div className="dashboard-card">
                                    <h2>Current 5 Scores</h2>
                                    {dashboard?.scores?.length ? (
                                        <div className="results-list">
                                            {dashboard.scores.map((entry, index) => (
                                                <div key={entry._id} className="result-item">
                                                    <p>Score: {entry.score}</p>
                                                    <p>{entry.course}</p>
                                                    <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
                                                    {index === dashboard.scores.length - 1 ? <p className="dashboard-note">Oldest stored score</p> : null}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No scores yet. Add your latest rounds to enter the draw properly.</p>
                                    )}
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h2>Your Draw Numbers</h2>
                                <p>{dashboard?.numbers?.length ? dashboard.numbers.join(", ") : "Add 5 scores to unlock your numbers."}</p>
                                <p className="dashboard-note">Based on your latest 5 stored scores.</p>
                            </div>
                        </>
                    ) : null}

                    {activePanel === "monthly-draw" ? (
                        <>
                            <div className="dashboard-split">
                                <div className="dashboard-card">
                                    <h2>Latest Published Draw</h2>
                                    {dashboard?.latestDraw ? (
                                        <>
                                            <p>Numbers: {dashboard.latestDraw.numbers.join(", ")}</p>
                                            <p>Date: {new Date(dashboard.latestDraw.drawDate).toLocaleDateString()}</p>
                                            <p>Prize pool: ${dashboard.latestDraw.totalPool.toFixed(2)}</p>
                                        </>
                                    ) : (
                                        <p>No published draw yet.</p>
                                    )}
                                </div>

                                <div className="dashboard-card">
                                    <h2>Current Jackpot</h2>
                                    <p className="dashboard-highlight">${dashboard?.jackpotAmount?.toFixed?.(2) || "0.00"}</p>
                                    <p>Total won so far: ${dashboard?.winningsOverview?.totalWon?.toFixed?.(2) || "0.00"}</p>
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h2>Your Results</h2>
                                {dashboard?.results?.length ? (
                                    <div className="results-list">
                                        {dashboard.results.map((winner) => (
                                            <div key={winner._id} className="result-item">
                                                <p>{winner.matchCount}-match winner</p>
                                                <p>Prize: ${winner.prize.toFixed(2)}</p>
                                                <p>Verification: {winner.verificationStatus}</p>
                                                <p>Payout: {winner.payoutStatus}</p>
                                                <p>Matched numbers: {winner.matchedNumbers?.join(", ") || "N/A"}</p>
                                                {winner.proofUrl ? (
                                                    <p>Proof submitted: <a href={winner.proofUrl} target="_blank" rel="noreferrer">Open proof</a></p>
                                                ) : null}
                                                {winner.verificationStatus === "pending" && !winner.proofUrl ? (
                                                    <div className="proof-form">
                                                        <input
                                                            type="url"
                                                            placeholder="Paste proof screenshot URL"
                                                            value={proofLinks[winner._id] || ""}
                                                            onChange={(e) => handleProofChange(winner._id, e.target.value)}
                                                        />
                                                        <button
                                                            className="plan-button"
                                                            type="button"
                                                            onClick={() => handleProofSubmit(winner._id)}
                                                        >
                                                            Submit Proof
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No winning results yet. Once a published draw matches your numbers, it will show up here.</p>
                                )}
                            </div>
                        </>
                    ) : null}

                    {activePanel === "profile" ? (
                        <div className="dashboard-split">
                            <div className="dashboard-card">
                                <h2>Profile</h2>
                                <p>Name: {dashboard?.profile?.firstname} {dashboard?.profile?.lastname}</p>
                                <p>Email: {dashboard?.profile?.email}</p>
                                <button className="plan-button profile-logout-button" onClick={handleLogout}>Logout</button>
                            </div>

                            <div className="dashboard-card">
                                <h2>Your Charity</h2>
                                <p>{dashboard?.charity?.name || "No charity selected"}</p>
                                <p>Contribution: {dashboard?.charityPercentage || 10}%</p>
                            </div>
                        </div>
                    ) : null}

                    {activePanel === "subscription" ? (
                        <div className="dashboard-split">
                            <div className="dashboard-card">
                                <h2>Subscription</h2>
                                <p>Status: {dashboard?.subscription?.status || "inactive"}</p>
                                <p>Plan: {dashboard?.subscription?.plan || "Not selected"}</p>
                                <p>
                                    Renewal: {dashboard?.subscription?.renewalDate
                                        ? new Date(dashboard.subscription.renewalDate).toLocaleDateString()
                                        : "Not active"}
                                </p>
                                {!dashboard?.subscription?.isSubscribed ? (
                                    <Link to="/subscribe">
                                        <button className="plan-button">Choose a Plan</button>
                                    </Link>
                                ) : null}
                            </div>

                            <div className="dashboard-card">
                                <h2>Support Summary</h2>
                                <p>Selected charity: {dashboard?.charity?.name || "No charity selected"}</p>
                                <p>Contribution rate: {dashboard?.charityPercentage || 10}%</p>
                            </div>
                        </div>
                    ) : null}
                </section>
            </section>
        </div>
    );
};

export default Dashboard;
