import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { charityService } from "../services/charityService";
import { getCharityImageStyle, getCharityThemeClass } from "../services/charityImages";

const CharityDetails = () => {
    const { id } = useParams();
    const [charity, setCharity] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        message: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadCharity = async () => {
            try {
                const data = await charityService.getCharityById(id);
                setCharity(data);
            } catch (err) {
                setError(err.message);
            }
        };

        loadCharity();
    }, [id]);

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

        if (!formData.name || !formData.email || !formData.amount) {
            setError("Please fill all required donation fields");
            return;
        }

        if (Number(formData.amount) < charity.independentDonationMinimum) {
            setError(`Minimum donation is $${charity.independentDonationMinimum}`);
            return;
        }

        try {
            await charityService.createDonation({
                charityId: id,
                name: formData.name,
                email: formData.email,
                amount: Number(formData.amount),
                message: formData.message
            });

            setSuccess("Donation submitted successfully");
            setFormData({
                name: "",
                email: "",
                amount: "",
                message: ""
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (!charity && !error) {
        return <div className="charity-page page-enter"><section className="charity-section"><p>Loading charity...</p></section></div>;
    }

    return (
        <div className="charity-page page-enter">
            <section className="charity-section">
                {error ? <p className="charity-message charity-top-message error-text">{error}</p> : null}

                {charity ? (
                    <div className="charity-details-layout">
                        <div className="charity-details-main">
                            <div
                                className={`charity-hero ${getCharityThemeClass(charity.theme)}`}
                                style={getCharityImageStyle(charity.theme)}
                            >
                                <span>{charity.name}</span>
                            </div>
                            <p className="charity-category">{charity.category} • {charity.location}</p>
                            <h1>{charity.name}</h1>
                            <p className="charity-description">{charity.description}</p>

                            <div className="charity-events">
                                <h3>Upcoming events</h3>
                                {charity.upcomingEvents.map((event) => (
                                    <p key={event}>{event}</p>
                                ))}
                            </div>
                        </div>

                        <div className="charity-donation-card">
                            <h3>Independent donation</h3>
                            <p>
                                Support this charity directly. Minimum donation: ${charity.independentDonationMinimum}
                            </p>

                            <form className="charity-donation-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Donation amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                                <textarea
                                    name="message"
                                    placeholder="Message (optional)"
                                    value={formData.message}
                                    onChange={handleChange}
                                />

                                {success ? <p className="charity-message success-text">{success}</p> : null}

                                <button className="charity-button" type="submit">
                                    Send Donation
                                </button>
                            </form>
                        </div>
                    </div>
                ) : null}
            </section>
        </div>
    );
};

export default CharityDetails;
