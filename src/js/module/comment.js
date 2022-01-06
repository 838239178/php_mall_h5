import axios from "@/plugins/axios";

export const api = "/api/comments"

export default {
  getComments(dto) {
    return axios.get(api,{
      params: dto
    });
  },
  getComment(id) {
    return axios.get(`${api}/${id}`);
  },
  removeComment(id) {
    return axios.delete(`${api}/${id}`);
  },
  addComment(comm) {
    return axios.post(api,comm);
  }
}