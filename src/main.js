import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import './tailwind.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.mixin({
  methods: {
    getImage(name) {
      return new URL(`./assets/${name}`, import.meta.url).href;
    },
    validCall(elform, callback) {
      elform.validate((isValid)=>{
        if(isValid) callback();
      })
    }
  }
})

app.use(router).use(store).use(ElementPlus)
app.mount('#app')
