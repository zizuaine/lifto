import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { charityService } from "../services/charityService";
import { getCharityImageStyle, getCharityThemeClass } from "../services/charityImages";

const categories = ["All", "Environment", "Sports", "Community"];

const Charities = () => {
    const [charities, setCharities] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCharities = async () => {
            try {
                const data = await charityService.getCharities(search, category);
                setCharities(data);
                setError("");
            } catch (err) {
                setError(err.message);
                setCharities([]);
            }
        };

        loadCharities();
    }, [search, category]);

    return (
        <div className="charity-page page-enter">
            <section className="charity-section">
                <div className="charity-intro">
                    <span className="charity-small-title">Charity Directory</span>
                    <h1>Find a cause that fits your game</h1>
                    <p>Search, filter, and learn more about the charities you can support through Lifto.</p>
                </div>

                <div className="charity-filter-bar">
                    <input
                        type="text"
                        placeholder="Search charities"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {error ? (
                    <div className="charity-state">
                        <p className="charity-message error-text">{error}</p>
                    </div>
                ) : (
                    <div className="charity-grid">
                        {charities.map((charity) => (
                            <div key={charity._id} className="charity-card">
                                <div
                                    className={`charity-image ${getCharityThemeClass(charity.theme)}`}
                                    style={getCharityImageStyle(charity.theme)}
                                >
                                    <span>{charity.name}</span>
                                </div>
                                <div className="charity-card-body">
                                    <p className="charity-category">{charity.category}</p>
                                    <h2>{charity.name}</h2>
                                    <p>{charity.shortDescription}</p>
                                    <Link to={`/charities/${charity._id}`}>
                                        <button className="charity-button">View Profile</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Charities;
