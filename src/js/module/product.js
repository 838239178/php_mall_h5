import axios from "@/plugins/axios";


export default {
  getProducts(query) {
    return axios.get("/api/products", {
      params: query
    })
  },
  getProduct(id) {
    return axios.get("/api/products/" + id)

  },
  getProductIntro(id) {
    return axios.get(`/api/products/${id}/intro`)
  },
  getGood(id) {
    return axios.get(`/api/goods/${id}`)
  },
  searchGood(productId,
    options = [{
      propKeyId: "",
      value: ""
    }]
  ) {
    return axios.post("/api/goods/getByProp/" + productId, {options: options});
  }
}