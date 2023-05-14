import axios from "axios";


export const suggestCourse = async (keyword, limitCount) => {
  const payload = new URLSearchParams({
    keyword: keyword,
    limit: limitCount
  });

  try {
      const { data } = await axios.post("course/suggest", payload);
      return data;
  } catch (error) {
      console.log(error);
  }
};