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

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      isCreateModal: false,
      pagination: {},
      openEditModal: null,
      openDeleteModal: null,
    };
  },
  methods: {
    // 1. 設定開啟新增、編輯、刪除頁面
    openModal(mode, item = {}) {
      this.tempProduct = JSON.parse(JSON.stringify(item));
      //   console.log(this.tempProduct);
      // 刪除的 modal
      if (mode === "delete") {
        this.openDeleteModal();
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
      this.openEditModal();
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
import paginationComponent from "./paginationComponent.js";
app.component("pagination", paginationComponent);
// 新增 編輯 頁面
import editProductComponent from "./editProductComponent.js";
app.component("productDetail", editProductComponent);
import deleteProductComponent from "./deleteProductComponent.js";
app.component("deleteProduct", deleteProductComponent);
app.mount("#app");
