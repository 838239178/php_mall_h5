import axios from "@/plugins/axios";


export default {
  getShopCars(dto) {
    return axios.get("/api/shop_cars", {
      params: dto
    })
  },
  getShopCar(id) {
    return axios.get("/api/shop_cars/"+id);
  },
  addShopCar(car) {
    return axios.post('/api/shop_cars', car);
  },
  updateShopCar(car) {
    return axios.patch('/api/shop_cars', car);
  },
  removeShopCar(id) {
    return axios.delete("/api/shop_cars/"+id);
  }
}