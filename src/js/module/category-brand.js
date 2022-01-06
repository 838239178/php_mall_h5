import axios from "@/plugins/axios";

export default {
  getCategories(query) {
    return axios.get("/api/categories", {
      params: query
    })
  },
  getCategory(id) {
    return axios.get(`/api/categories/${id}`);
  },
  getBrands(query) {
    return axios.get("/api/brands", {
      params: query
    })
  },
  getBrand(id) {
    return axios.get(`/api/brands/${id}`);
  }
}