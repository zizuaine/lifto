import Charity from "../models/charity.js";
import Donation from "../models/donation.js";

const charitySeedData = [
    {
        name: "Trees for Life",
        category: "Environment",
        location: "Scotland",
        shortDescription: "Restoring forests and protecting biodiversity for future generations.",
        description: "Trees for Life helps restore native forests, protect wildlife habitats, and create greener spaces that communities can enjoy for years.",
        theme: "green",
        featured: true,
        upcomingEvents: ["Spring Golf Day - April 18", "Community Tree Planting - May 6"],
        independentDonationMinimum: 5
    },
    {
        name: "Golf Aid",
        category: "Sports",
        location: "London",
        shortDescription: "Supporting young players and community golf programmes.",
        description: "Golf Aid funds coaching support, youth equipment, and local sporting events that make golf more accessible to new players.",
        theme: "gold",
        featured: false,
        upcomingEvents: ["Junior Skills Camp - May 10", "Charity Stableford Day - June 2"],
        independentDonationMinimum: 5
    },
    {
        name: "Hope Foundation",
        category: "Community",
        location: "Manchester",
        shortDescription: "Helping families with food, education, and local support programmes.",
        description: "Hope Foundation runs practical community projects with a focus on food support, education help, and emergency family assistance.",
        theme: "blue",
        featured: false,
        upcomingEvents: ["Fundraising Dinner - April 25", "Summer Family Support Drive - June 15"],
        independentDonationMinimum: 10
    }
];

async function ensureSeedCharities() {
    const totalCharities = await Charity.countDocuments();

    if (totalCharities === 0) {
        await Charity.insertMany(charitySeedData);
    }
}

async function getAllCharities(search = "", category = "") {
    await ensureSeedCharities();

    const query = {};

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
        query.category = category;
    }

    return Charity.find(query).sort({ name: 1 });
}

async function getFeaturedCharity() {
    await ensureSeedCharities();

    const featuredCharity = await Charity.findOne({ featured: true });

    if (featuredCharity) {
        return featuredCharity;
    }

    return Charity.findOne();
}

async function getCharityById(charityId) {
    await ensureSeedCharities();

    const charity = await Charity.findById(charityId);

    if (!charity) {
        const err = new Error("Charity not found");
        err.statusCode = 404;
        throw err;
    }

    return charity;
}

async function createDonation({ charityId, name, email, amount, message }) {
    await ensureSeedCharities();

    const charity = await Charity.findById(charityId);

    if (!charity) {
        const err = new Error("Charity not found");
        err.statusCode = 404;
        throw err;
    }

    if (amount < charity.independentDonationMinimum) {
        const err = new Error(`Minimum donation is $${charity.independentDonationMinimum}`);
        err.statusCode = 400;
        throw err;
    }

    return Donation.create({
        charityId,
        name,
        email,
        amount,
        message
    });
}

export { getAllCharities, getFeaturedCharity, getCharityById, createDonation };
