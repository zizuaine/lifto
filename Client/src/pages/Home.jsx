import mainImage from "../../src/assets/main-hero.jpg";
import HowItWorks from "../components/HowItWorks"
import Footer from "../components/Footer";
import { Link } from "react-router-dom"
import FeaturedCharity from "../components/FeaturedCharity";


const Home = () => {
    return (
        <div className="home-wrapper page-enter">
            <section className="hero-media">
                <div className="hero-copy">
                    <span className="hero-title">Play to change lives</span>
                    <p className="hero-subtitle">
                        Lifto connects your golf journey with real-world impact through subscriptions, score tracking,
                        and charity support.
                    </p>
                    <p className="hero-subtitle">
                        Choose a cause, stay on top of your game, and help fund meaningful work every month.
                    </p>
                </div>
                <img
                    className="hero-photo"
                    src={mainImage}
                    alt="Golf course with a ball in focus and a flag in the distance"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
            </section>
            <section className="home-info">
                <HowItWorks />
                <FeaturedCharity />

            </section>
            <div className="home-buttons" >
                <Link to="/login">
                    <button className="home-btn">Get Started</button>
                </Link>
                <Link to="/charities">
                    <button className="home-btn">Explore Charities</button>
                </Link>
            </div>

            <Footer />

        </div>
    );
};

export default Home;
