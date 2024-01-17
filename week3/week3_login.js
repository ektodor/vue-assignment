import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";

const app = {
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
          const { token, expired } = res.data;
          document.cookie = `token=${token};expired=${new Date(expired)}`;
          window.location = "week3_crud.html";
        })
        .catch((err) => {
          console.error("Login error");
          console.error(err.message);
        });
    },
  },
};

createApp(app).mount("#app");
