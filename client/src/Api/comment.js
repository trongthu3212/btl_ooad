import axios from "axios";

export const addComment = async (id, content, type) => {
  let payload;
  type == 1 ? payload = new URLSearchParams({
    postId: id,
    content: content
  }) : payload = new URLSearchParams({
    answerId: id,
    content: content
  });

  try {
      const { data } = await axios.post("comment/add", payload);
      return data;
  } catch (error) {
      console.log(error);
  }
};