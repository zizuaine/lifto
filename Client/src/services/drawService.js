const API_URL = import.meta.env.VITE_API_URL || "/api";

function getUserToken() {
    return localStorage.getItem("token");
}

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
    const token = getUserToken();
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

export const drawService = {
    subscribe(plan) {
        return request("/draw/subscribe", {
            method: "POST",
            body: JSON.stringify({ plan })
        });
    },

    selectNumbers(numbers) {
        return request("/draw/numbers", {
            method: "POST",
            body: JSON.stringify({ numbers: numbers.map(Number) })
        });
    },

    getDashboard() {
        return request("/draw/dashboard");
    },

    getResults() {
        return request("/draw/results");
    },

    getSubscription() {
        return request("/draw/subscription");
    },

    submitWinnerProof(winnerId, proofUrl) {
        return request("/draw/results/proof", {
            method: "POST",
            body: JSON.stringify({ winnerId, proofUrl })
        });
    },

    addScore(score, date, course) {
        return request("/scores", {
            method: "POST",
            body: JSON.stringify({ score: Number(score), date, course })
        });
    },

    getScores() {
        return request("/scores");
    }
};
