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