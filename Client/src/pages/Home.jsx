import mainImage from "../../src/assets/main.jpg";
import HowItWorks from "../components/HowItWorks"
import Footer from "../components/Footer";
import { Link } from "react-router-dom"
import FeaturedCharity from "../components/FeaturedCharity";


const Home = () => {
    return (
        <div className="home-wrapper page-enter">
            <section className="hero-media">
                <span className="hero-title">Play to change lives</span>
                <img
                    className="hero-photo"
                    src={mainImage}
                    alt="Golf course with a ball in focus and a flag in the distance"
                />
            </section>
            <section className="home-info">
                <HowItWorks />
                <FeaturedCharity />

            </section>
            <div className="home-button" >
                <Link to="/login">
                    <button className="button-charity">Get Started</button>
                </Link>
                <Link to="/charities">
                    <button className="button-charity">Explore Charities</button>
                </Link>
            </div>

            <Footer />

        </div>
    );
};

export default Home;
