import { SERVER_URL } from "./server-url";
import axios from "axios";

export const postQuestion = async (title, content, tags) => {
    const payload = {
        title: title,
        content: content,
        tags: tags.split(" "),
    };

    try {
        console.log(payload);
    } catch (error) {
        console.log(error);
    }
};
