import axios from "axios";


export const getCourse = async (page, pageSize) => {
  try {
      const { data } = await axios.get(`course/list?page=${page}&quantity=${pageSize}`);
      return data;
  } catch (error) {
      console.log(error);
  }
};