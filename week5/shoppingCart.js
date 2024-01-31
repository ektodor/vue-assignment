// 使用 https://unpkg.com/vue@3/dist/vue.esm-browser.js 再導入 loading 出錯，
// 要在導入 loading 之前匯入  https://unpkg.com/vue@3/dist/vue.global.js
// import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
let openDetailModal;
const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: "ektodorwang-api",
      // 商品細節相關 loading
      isDetailLoading: false,
      // 購物車相關 loading
      isCartLoading: false,
      products: [],
      pagination: {},
      tempProduct: {},
      cart: {},
      tempQty: 1,
      user: {
        name: "",
        email: "",
        tel: "",
        address: "",
      },
      message: "",
    };
  },
  methods: {
    // 開啟 Modal
    openModal(item) {
      this.tempQty = 1;
      openDetailModal.show();
      this.tempProduct = JSON.parse(JSON.stringify(item));
    },
    // 所有產品的列表
    getProducts(page = 1) {
      // console.log(page);
      let loader = this.$loading.show();
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          loader.hide();
        })
        .catch((err) => {
          this.errorMessage(err, "取得商品資料失敗");
        });
    },
    // 單一產品細節 好像沒用到?! 因為 getProducts 以取得內容
    getSingleProduct(id) {
      this.isDetailLoading = true;
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/product/${id}`)
        .then((res) => {
          this.tempProduct = res.data.product;
          this.isDetailLoading = false;
        })
        .catch((err) => {
          this.errorMessage(err, "商品細節取得失敗");
        });
    },
    // 加入購物車
    addProduct(id, qty = 1) {
      this.isDetailLoading = true;
      // console.log("加入購物車");
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/cart`, {
          data: {
            product_id: id,
            qty,
          },
        })
        .then((res) => {
          openDetailModal.hide();
          this.getCartProducts();
          alert("購物車更新成功");
        })
        .catch((err) => {
          this.errorMessage(err, "加入購物車失敗");
        });
    },
    // 購物車列表
    getCartProducts() {
      // console.log("購物車列表");
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/cart`)
        .then((res) => {
          this.cart = JSON.parse(JSON.stringify(res.data.data));
          this.isDetailLoading = false;
          this.isCartLoading = false;
        })
        .catch((err) => {
          this.errorMessage(err, "取得購物車列表失敗");
        });
    },
    // 刪除購物車項目 單一
    deleteProduct(id) {
      this.isCartLoading = true;
      // console.log("刪除購物車項目 單一", id);
      axios
        .delete(`${this.apiUrl}/api/${this.apiPath}/cart/${id}`)
        .then((res) => {
          this.getCartProducts();
          alert("購物車更新成功");
        })
        .catch((err) => {
          this.errorMessage(err, "刪除購物車項目失敗 (單一)");
        });
    },
    // 刪除購物車項目 全部
    deleteAllProducts() {
      // console.log("刪除購物車項目 全部");
      axios
        .delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
        .then((res) => {
          this.getCartProducts();
          alert("購物車更新成功");
        })
        .catch((err) => {
          this.errorMessage(err, "刪除購物車項目失敗 (全部)");
        });
    },
    // 購物車產品數量
    updateCartQuantity(id, qty) {
      this.isCartLoading = true;
      // console.log("購物車產品數量", id, qty);
      axios
        .put(`${this.apiUrl}/api/${this.apiPath}/cart/${id}`, {
          data: {
            product_id: id,
            qty,
          },
        })
        .then((res) => {
          this.getCartProducts();
          alert("購物車更新成功");
        })
        .catch((err) => {
          this.errorMessage(err, "更改產品數量失敗");
        });
    },
    // 結帳
    checkoutProducts() {
      if (this.cart) {
        alert("請選擇商品");
        return;
      }
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/order`, {
          data: {
            user: this.user,
            message: this.message,
          },
        })
        .then((res) => {
          (this.user = {
            name: "",
            email: "",
            tel: "",
            address: "",
          }),
            (this.message = "");
          this.getCartProducts();
          alert("商品已完成結帳");
        })
        .then((err) => {
          this.errorMessage(err, "結帳失敗");
        });
    },
    // 錯誤資訊
    errorMessage(err, meg) {
      console.error(err.message);
      alert(meg);
    },
    //  電話認證
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
  },
  mounted() {
    this.getProducts();
    this.getCartProducts();
    openDetailModal = new bootstrap.Modal(this.$refs.detailModal);
  },
});
app.use(VueLoading.LoadingPlugin);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});
app.mount("#app");
