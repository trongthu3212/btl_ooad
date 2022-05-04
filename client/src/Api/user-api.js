import { SERVER_URL } from "./server-url";
import axios from "axios";

export const login = async (email, password) => {
    const payload = new URLSearchParams({
        email: email,
        password: password,
    });

    try {
        const { data } = await axios.post(`${SERVER_URL}/login`, payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const signup = async (displayname, email, password) => {
    const payload = new URLSearchParams({
        username: displayname,
        email: email,
        password: password,
    });

    try {
        const { data } = await axios.post(`${SERVER_URL}/register`, payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getCurrentUser = async () => {
    const data = {
        role: "admin",
        user: { displayname: "displayname" },
    };
    return data;
};
