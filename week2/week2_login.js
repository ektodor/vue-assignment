import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";

createApp({
  data() {
    return {
      account: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .post(`${url}/admin/signin`, {
          username: this.account,
          password: this.password,
        })
        .then((res) => {
          console.log("Login success");
          //   console.log(res.data);
          const { token, expired } = res.data;
          axios.defaults.headers.common["Authorization"] = token;
          document.cookie = `token=${token};expired=${new Date(expired)}`;
          window.location = "week2_product.html";
        })
        .catch((err) => {
          console.error("Login error");
          console.error(err.message);
        });
    },
  },
}).mount("#app");
