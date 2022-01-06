import axios from "@/plugins/axios";

export default {
  addCollection(productId) {
    return axios.post("/api/collections", {
      product: productId
    });
  },
  getCollections(dto) {
    return axios.get("/api/collections", {
      params: dto
    });
  },
  getCollection(id) {
    return axios.get("/api/collections/"+id);
  },
  removeCollection(id) {
    return axios.delete("/api/collections/"+id);
  }
}