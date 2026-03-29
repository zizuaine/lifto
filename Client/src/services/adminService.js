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

async function request(path, options = {}) {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        }
    });

    const data = await readJsonSafely(response);

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
}

export const adminService = {
    async signin(credentials) {
        const response = await fetch(`${API_URL}/admin/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        const data = await readJsonSafely(response);

        if (!response.ok) {
            throw new Error(data?.message || "Admin signin failed");
        }

        return data;
    },

    getSummary() {
        return request("/draw/admin/summary");
    },

    runDraw() {
        return request("/draw/admin/run", {
            method: "POST"
        });
    },

    publishResults(drawId) {
        return request(`/draw/admin/${drawId}/publish`, {
            method: "POST"
        });
    },

    rolloverJackpot(drawId) {
        return request(`/draw/admin/${drawId}/rollover`, {
            method: "POST"
        });
    },

    reviewWinner(winnerId, verificationStatus, verificationNotes) {
        return request("/draw/admin/winners/review", {
            method: "POST",
            body: JSON.stringify({ winnerId, verificationStatus, verificationNotes })
        });
    },

    markWinnerPaid(winnerId) {
        return request(`/draw/admin/winners/${winnerId}/pay`, {
            method: "POST"
        });
    }
};
