import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
/*
1. 設定開啟新增、編輯、刪除頁面 ✅
2. 新增產品 ✅
3. 讀取產品 ✅
4. 更新產品 ✅
5. 刪除產品 ✅
6. 確認登入狀態 ✅
-- 元件化 --
1. 編輯、新增頁面 元件化 ✅
2. 刪除頁面 元件化 ✅
3. 分頁元件化 ✅
*/
let openModalBtn;
let openDeleteModalBtn;

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      isCreateModal: false,
      pagination: {},
    };
  },
  methods: {
    // 1. 設定開啟新增、編輯、刪除頁面
    openModal(mode, item = {}) {
      this.tempProduct = JSON.parse(JSON.stringify(item));
      //   console.log(this.tempProduct);
      // 刪除的 modal
      if (mode === "delete") {
        openDeleteModalBtn.show();
        return;
      }
      // 編輯和新增的 modal
      mode === "edit"
        ? (this.isCreateModal = false)
        : (this.isCreateModal = true);

      // 沒有 imagesUrl 會造成 html 中使用 push 出錯
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }
      openModalBtn.show();
    },
    //   3. 讀取產品
    readProducts(currentPage) {
      axios
        .get(`${url}/api/${path}/admin/products?page=${currentPage}`)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          console.error(err.message);
          alert("讀取資料失敗");
        });
    },
    //   6.確認登入狀態
    checkLogin() {
      var token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(`${url}/api/user/check`, {})
        .then((res) => {
          return;
        })
        .catch((err) => {
          console.error(err.message);
          alert("請重新登入");
          window.location = "./week4_login.html";
        });
    },
  },
  mounted() {
    this.checkLogin();
    this.readProducts(1);
  },
});
// 分頁
app.component("pagination", {
  template: "#pagination",
  props: ["pagination"],
  methods: {
    changePage(page) {
      this.$emit("change-page", page);
    },
  },
});
// 新增 編輯 頁面
app.component("productDetail", {
  template: "#productDetail",
  props: ["tempProduct", "isCreateModal"],
  methods: {
    //   2. 新增產品
    createPrdouct() {
      //   console.log("createPrdouct");
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
          this.$emit("readProducts");
          // this.readProducts();
          openModalBtn.hide();
        })
        .catch((err) => {
          console.error(err.message);
          alert("新增失敗");
        });
    },
    //   4. 更新產品
    updatePrdouct() {
      //   console.log("updatePrdouct");
      axios
        .put(`${url}/api/${path}/admin/product/${this.tempProduct.id}`, {
          data: this.tempProduct,
        })
        .then((res) => {
          this.$emit("readProducts");
          // this.readProducts();
          openModalBtn.hide();
        })
        .catch((err) => {
          console.error(err.message);
          alert("更新失敗");
        });
    },
  },
  mounted() {
    // modal
    openModalBtn = new bootstrap.Modal(document.getElementById("productModal"));
  },
});
app.component("deleteProduct", {
  template: "#deleteProduct",
  props: ["tempProduct", "readProducts"],
  methods: {
    //   5. 刪除產品
    deletePrdouct() {
      axios
        .delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          this.readProducts();
          openDeleteModalBtn.hide();
        })
        .catch((error) => {
          console.error(error.message);
          alert("刪除資料失敗");
        });
    },
  },
  mounted() {
    openDeleteModalBtn = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
});
app.mount("#app");
