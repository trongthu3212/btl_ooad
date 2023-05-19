import axios from "axios";

export const postQuestion = async (title, content, courseId) => {
    const payload = new URLSearchParams({
        title: title,
        content: content,
        courseId: courseId,
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
        id: idQuestion,
    });

    try {
        const { data } = await axios.put("post/increaseView", payload);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getPostsPaging = async (page, pageSize, filter, keyword) => {
    const payload = new URLSearchParams({
        page: page,
        quantity: pageSize,
        filter: filter,
        keyword: keyword
    });
    try {
        const { data } = await axios.post("listPosts", payload);
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

export const changeVoteQuestion = async (id, type) => {
    try {
        const { data } = await axios.post(`post/${type}/${id}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const searchPostsPaging = async (page, pageSize, filter) => {
    try {
        const { data } = await axios.get(`search?page=${page}&quantity=${pageSize}&keyword=${filter}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};