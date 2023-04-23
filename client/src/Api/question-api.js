import axios from "axios";

export const postQuestion = async (title, content, tags) => {
    const payload = new URLSearchParams({
        title: title,
        content: content,
        tags: tags.split(" "),
    });

    try {
        const { data } = await axios.post("addPost", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getPost = async (idQuestion) => {
    try {
        const { data } = await axios.get(`getPost/${idQuestion}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllPosts = async () => {
    try {
        const { data } = await axios.get("getAllPosts");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async (idQuestion) => {
    const payload = new URLSearchParams({
        _id: idQuestion,
    });

    try {
        const { data } = await axios.delete("deletePost", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updatePost = async (post) => {
    const payload = new URLSearchParams(post);

    try {
        const { data } = await axios.put(`updatePost?_id=${post._id}`, payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const increasePostView = async (idQuestion) => {
    const payload = new URLSearchParams({
        _id: idQuestion,
    });

    try {
        const { data } = await axios.put("post/increaseView", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getPostsPaging = async (page, pageSize) => {
    try {
        const { data } = await axios.get(`listPosts?page=${page}&quantity=${pageSize}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getComment = async (id) => {
    try {
        const { data } = await axios.get(`comment/list?postId=${id}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};
