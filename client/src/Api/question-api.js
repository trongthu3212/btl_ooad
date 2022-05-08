import axios from "axios";

export const postQuestion = async (title, content, tags) => {
    const payload = new URLSearchParams({
        title: title,
        content: content,
        // tags: tags.split(" "),
    });

    try {
        const { data } = await axios.post("addPost", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};
