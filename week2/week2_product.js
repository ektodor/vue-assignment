import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
// 產品資料格式
createApp({
  data() {
    return {
      currentOrder: {},
      products: [],
    };
  },
  methods: {
    viewOrderDetail(item) {
      this.currentOrder = { ...item };
    },
  },
  created() {
    var token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post(`${url}/api/user/check`, {})
      .then((res) => {
        this.loginStatus = true;
        return axios.get(`${url}/api/${path}/admin/products`);
      })
      .then((res) => {
        this.products = res.data.products;
      })
      .catch((err) => {
        console.error(err.message);
        window.location = "./week2_login.html";
      });
  },
}).mount("#app");
