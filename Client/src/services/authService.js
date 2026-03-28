const API_URL = "http://localhost:3000/api";

export const authService = {
    async signup(userData) {
        const response = await fetch(`${API_URL}/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        return data;
    },

    async signin(userData) {
        const response = await fetch(`${API_URL}/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signin failed");
        }

        return data;
    }
};
