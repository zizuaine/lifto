const steps = [
    {
        number: "1",
        title: "Subscribe & Choose",
        desc: "Pick your plan and select a charity to support. A portion of your subscription goes directly to them every month."
    },
    {
        number: "2",
        title: "Enter Your Scores",
        desc: "Log your 5 most recent Stableford scores. These determine your draw numbers and qualify you for monthly prizes."
    },
    {
        number: "3",
        title: "Win & Give",
        desc: "Monthly draws match your scores against prize numbers. Match 3, 4, or 5 to win — jackpot rolls over if unclaimed!"
    }
]

const HowItWorks = () => {
    return (
        <section className="how-section">
            <h2 className="how-title">How It Works</h2>
            <p className="how-subtitle">
                Three simple steps to play, win, and give back
            </p>

            <div className="how-grid">
                {steps.map((step) => (
                    <div key={step.number} className="how-card">
                        <div className="step-circle">{step.number}</div>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks