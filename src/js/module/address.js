import axios from "@/plugins/axios";

export const api = "/api/addresses"

export default {
  getAddresses(dto) {
    return axios.get(api,{
      params: dto
    });
  },
  getAddress(id) {
    return axios.get(`${api}/${id}`);
  },
  removeAddress(id) {
    return axios.delete(`${api}/${id}`);
  },
  addAddress(addr) {
    return axios.post(api,addr);
  },
  updateAddress(addr) {
    return axios.patch(`${api}/${addr.addressId}`,addr);
  },
  setDefaultAddress(id) {
    return axios.get(`${api}/${id}/default`);
  }
}