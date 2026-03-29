const API_URL = import.meta.env.VITE_API_URL || "/api";

async function readJsonSafely(response) {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function getRequestError(error, fallbackMessage) {
    if (error instanceof TypeError) {
        return new Error("Unable to load charities right now. Check that the server is running and try again.");
    }

    return error instanceof Error ? error : new Error(fallbackMessage);
}

export const charityService = {
    async getCharities(search = "", category = "") {
        try {
            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (category && category !== "All") {
                params.append("category", category);
            }

            const queryString = params.toString();
            const response = await fetch(`${API_URL}/charities${queryString ? `?${queryString}` : ""}`);
            const data = await readJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.message || "Failed to fetch charities");
            }

            return Array.isArray(data) ? data : [];
        } catch (error) {
            throw getRequestError(error, "Failed to fetch charities");
        }
    },

    async getFeaturedCharity() {
        try {
            const response = await fetch(`${API_URL}/charities/featured`);
            const data = await readJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.message || "Failed to fetch charity");
            }

            return data;
        } catch (error) {
            throw getRequestError(error, "Failed to fetch charity");
        }
    },

    async getCharityById(id) {
        try {
            const response = await fetch(`${API_URL}/charities/${id}`);
            const data = await readJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.message || "Failed to fetch charity details");
            }

            return data;
        } catch (error) {
            throw getRequestError(error, "Failed to fetch charity details");
        }
    },

    async createDonation(donationData) {
        try {
            const response = await fetch(`${API_URL}/charities/donations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(donationData)
            });

            const data = await readJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.message || "Donation failed");
            }

            return data;
        } catch (error) {
            throw getRequestError(error, "Donation failed");
        }
    }
};
