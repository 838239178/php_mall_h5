import axios from "@/plugins/axios";

export default {
  sendEmailCode(email) {
    return axios.get(`/api/emailCode/${email}`)
  },
  register(info) {
    return axios.post('/api/register', info)
  },
  login(form) {
    return axios.post('/api/login', form)
  },
  getUserInfo(id) {
    return axios.get(`/api/user_infos/${id}`);
  },
  patchUserInfo(info) {
    return axios.patch(`/api/user_infos/${info.userId}`, info);
  },
  updatePwd(newPwd,oldPwd) {
    return axios.patch("/api/password",{},{
      params: {
        oldPwd: oldPwd,
        newPwd: newPwd
      }
    })
  }
}