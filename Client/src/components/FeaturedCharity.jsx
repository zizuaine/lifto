import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { charityService } from "../services/charityService";
import { getCharityImageStyle, getCharityThemeClass } from "../services/charityImages";

const FeaturedCharity = () => {
    const [charity, setCharity] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFeaturedCharity = async () => {
            try {
                const data = await charityService.getFeaturedCharity();
                setCharity(data);
                setError("");
            } catch (err) {
                setError(err.message);
            }
        };

        loadFeaturedCharity();
    }, []);

    if (error) {
        return (
            <section className="featured-charity charity-state">
                <p className="charity-message error-text">{error}</p>
            </section>
        );
    }

    if (!charity) {
        return null;
    }

    return (
        <section className="featured-charity">
            <div
                className={`featured-charity-image ${getCharityThemeClass(charity.theme)}`}
                style={getCharityImageStyle(charity.theme)}
            >
                <span>{charity.name}</span>
            </div>

            <div className="featured-charity-content">
                <span className="featured-charity-label">Featured Charity</span>
                <h2>{charity.name}</h2>
                <p>{charity.shortDescription}</p>
                <Link to={`/charities/${charity._id}`}>
                    <button className="button-charity">Read More</button>
                </Link>
            </div>
        </section>
    );
};

export default FeaturedCharity;
