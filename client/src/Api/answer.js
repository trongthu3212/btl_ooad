import axios from "axios";

export const addAnswer = async (postId, content) => {
  const payload = new URLSearchParams({
    postId: postId,
    content: content
  });

  try {
      const { data } = await axios.post("answer/add", payload);
      return data;
  } catch (error) {
      console.log(error);
  }
};

export const changeVoteAnswer = async (id, type) => {
  try {
      const { data } = await axios.post(`answer/${type}/${id}`);
      return data;
  } catch (error) {
      console.log(error);
  }
};

export const acceptAnswerById = async (id) => {
  try {
      const { data } = await axios.post(`answer/accept/${id}`);
      return data;
  } catch (error) {
      console.log(error);
  }
};

export const unacceptAnswerById = async (id) => {
  try {
      const { data } = await axios.post(`answer/unaccept/${id}`);
      return data;
  } catch (error) {
      console.log(error);
  }
};