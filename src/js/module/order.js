import axios from "@/plugins/axios";
const api = "/api/orders"


const statusMap = {
  '全部': null,
  '待支付': 'wait_pay',
  '待发货': 'wait_express',
  '待收货': 'wait_receive',
  '待退款': 'wait_draw_back',
  '已完成': 'finished',
  '已取消': 'canceled',
}
const statusMap2 = {
  'wait_pay': '待支付',
  'wait_express': '待发货',
  'wait_receive': '待收货',
  'wait_draw_back': '待退款',
  'finished': '已完成',
  'canceled': '已取消'
}

export default {
  getOrder(id) {
    return axios.get(`${api}/${id}`);
  },
  getOrders(dto) {
    return axios.get(api, {
      params: dto
    })
  },
  addOrder(order) {
    return axios.post(api, order);
  },
  removeOrder(id) {
    return axios.delete(`${api}/${id}`)
  },
  //state: cancel drawback pay
  updateOrderState(state, id) {
    return axios.patch(`${api}/${id}/${state}`);
  },
  getOrderStatusLabel(status) {
    return statusMap2[status]
  },
  getOrderStatus(label) {
    return statusMap[label]
  },
  getAllStatusLabel() {
    return Object.keys(statusMap)
  }
}