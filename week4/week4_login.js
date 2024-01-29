import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
const app = {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .post(`${url}/admin/signin`, {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `token=${token};expired=${new Date(expired)}`;
          window.location = "week4_products.html";
        })
        .catch((err) => {
          console.error(err);
          alert("登入失敗");
        });
    },
  },
  mounted() {},
};
createApp(app).mount("#app");
