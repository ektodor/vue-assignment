import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
let openModalBtn;
let openDeleteModalBtn;
const app = {
  data() {
    return {
      products: [],
      tempProduct: {},
      isInCreateModal: false,
    };
  },
  /*
  1. create
  2. Read
  3. update
  4. delete
  */
  methods: {
    openModal(method, item) {
      method === "edit"
        ? (this.isInCreateModal = false)
        : (this.isInCreateModal = true);
      this.tempProduct = item;
      // 沒有 imagesUrl 會造成 html 中使用 push 出錯
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }
      openModalBtn.show();
    },
    openDeleteModal(item) {
      this.tempProduct = item;
      openDeleteModalBtn.show();
    },
    // create
    createItem() {
      this.tempProduct.imagesUrl = this.tempProduct.imagesUrl.filter(
        (data) => data != ""
      );
      const { category, num, origin_price, price, title, unit } =
        this.tempProduct;

      if (!(category || num || origin_price || price || title || unit)) {
        alert("請勿空白");
        return;
      }
      axios
        .post(`${url}/api/${path}/admin/product`, {
          data: this.tempProduct,
        })
        .then((res) => {
          this.readItem();
          openModalBtn.hide();
        })
        .catch((err) => {
          console.error(err.message);
          alert("上傳失敗");
        });
    },
    // read
    readItem() {
      axios
        .post(`${url}/api/user/check`, {})
        .then((res) => {
          return axios.get(`${url}/api/${path}/admin/products`);
        })
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.error(err.message);
          window.location = "./week3_login.html";
        });
    },
    // update
    updateItem() {
      axios
        .put(`${url}/api/${path}/admin/product/${this.tempProduct.id}`, {
          data: this.tempProduct,
        })
        .then((res) => {
          this.readItem();
          openModalBtn.hide();
        })
        .catch((err) => {
          console.error(err.message);
          alert("更新失敗");
        });
    },
    // delete
    deleteItem() {
      // 採坑紀錄: 直接複製網頁url，在呼叫時路徑會出錯，
      // 會出現 %E2%80%8B (zero width space， 零寬空格（zero-width space, ZWSP）是一種不可列印的Unicode字元)，需有重新自己打
      axios
        .delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          this.readItem();
          openDeleteModalBtn.hide();
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
  mounted() {
    openModalBtn = new bootstrap.Modal(document.getElementById("productModal"));
    openDeleteModalBtn = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
    var token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.readItem();
  },
};

createApp(app).mount("#app");
