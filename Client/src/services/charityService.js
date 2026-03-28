const API_URL = "http://localhost:3000/api";

export const charityService = {
    async getCharities(search = "", category = "") {
        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (category && category !== "All") {
            params.append("category", category);
        }

        const queryString = params.toString();
        const response = await fetch(`${API_URL}/charities${queryString ? `?${queryString}` : ""}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch charities");
        }

        return data;
    },

    async getFeaturedCharity() {
        const response = await fetch(`${API_URL}/charities/featured`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch charity");
        }

        return data;
    },

    async getCharityById(id) {
        const response = await fetch(`${API_URL}/charities/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch charity details");
        }

        return data;
    },

    async createDonation(donationData) {
        const response = await fetch(`${API_URL}/charities/donations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(donationData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Donation failed");
        }

        return data;
    }
};
