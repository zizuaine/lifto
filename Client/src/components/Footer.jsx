import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <section className="footer">
            <h2>Ready to make your round count?</h2>

            <p>
                Join 1,240 golfers already winning prizes and changing lives.
            </p>

            <Link to="/subscribe">
                <button className="footer-button">
                    Choose Your Plan →
                </button>
            </Link>
        </section>
    );
};

export default Footer;