import axios from "axios";
import FormData from "form-data";

export const login = async (email, password) => {
    const payload = new URLSearchParams({
        email: email,
        password: password,
    });

    try {
        const { data } = await axios.post("login", payload);
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
        const { data } = await axios.post("register", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async () => {
    try {
        const { data } = await axios.get("getAllUsers");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getUser = async (idUser) => {
    try {
        const { data } = await axios.get(`user/${idUser}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateProfile = async (profileUploaded) => {
    const payload = new FormData();
    payload.append("userAvatar", profileUploaded.userAvatar);
    payload.append("userName", profileUploaded.userName);
    payload.append("userAbout", profileUploaded.userAbout);

    const { data } = await axios.post("/user/update", payload, {
        transformRequest: () => payload
    });

    return data;
};

export const getCurrentUser = async () => {
    try {
        const { data } = await axios.get("currentUser");
        return data;
    } catch (error) {
        console.log(error);
    }
};
