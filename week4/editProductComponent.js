const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
export default {
  data() {
    return {
      openModalBtn: null,
    };
  },
  props: ["tempProduct", "isCreateModal"],
  methods: {
    openModal() {
      this.openModalBtn.show();
    },
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
          this.openModalBtn.hide();
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
          this.openModalBtn.hide();
        })
        .catch((err) => {
          console.error(err.message);
          alert("更新失敗");
        });
    },
  },
  mounted() {
    // modal
    this.openModalBtn = new bootstrap.Modal(
      document.getElementById("productModal")
    );
    this.$emit("open-modal", this.openModal);
  },
  template: `      <div
  id="productModal"
  ref="productModal"
  class="modal fade"
  tabindex="-1"
  aria-labelledby="productModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isCreateModal">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label"
                  >輸入圖片網址</label
                >
                <input
                  type="text"
                  class="form-control"
                  placeholder="請輸入圖片連結"
                  v-model="tempProduct.imageUrl"
                />
              </div>
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
            </div>
            <h4>多圖片網址</h4>
            <div
              class="mb-3"
              v-for="(item, index) in tempProduct.imagesUrl"
              :key="item"
            >
              <!-- 補充圖片網址的 label for 和 input id 在未填入網址之前會無法對應，可改為綁定 補充圖片 - index + 1  之類的名稱 -->
              <label :for="'補充圖片-'+index + 1" class="form-label mb-2"
                >補充圖片網址</label
              >
              <input
                :id="'補充圖片-'+index + 1"
                type="text"
                class="form-control mb-2"
                placeholder="請輸入圖片連結"
                v-model.lazy="tempProduct.imagesUrl[index]"
              />
              <img
                class="img-fluid mb-2"
                :src="tempProduct.imagesUrl[index]"
              />
              <div>
                <button
                  class="btn btn-outline-danger btn-sm d-block w-100"
                  @click="tempProduct.imagesUrl.splice(index,1)"
                >
                  刪除圖片
                </button>
              </div>
            </div>
            <div>
              <button
                class="btn btn-outline-primary btn-sm d-block w-100"
                @click="()=>{tempProduct.imagesUrl.push('')}"
              >
                新增圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input
                id="title"
                type="text"
                class="form-control"
                placeholder="請輸入標題"
                v-model="tempProduct.title"
              />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input
                  id="category"
                  type="text"
                  class="form-control"
                  placeholder="請輸入分類"
                  v-model="tempProduct.category"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input
                  id="unit"
                  type="text"
                  class="form-control"
                  placeholder="請輸入單位"
                  v-model="tempProduct.unit"
                />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <input
                  id="origin_price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入原價"
                  v-model.number="tempProduct.origin_price"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入售價"
                  v-model.number="tempProduct.price"
                />
              </div>
            </div>
            <hr />

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入產品描述"
                v-model="tempProduct.description"
              >
              </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入說明內容"
                v-model="tempProduct.content"
              >
              </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input
                  id="is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempProduct.is_enabled"
                />
                <label class="form-check-label" for="is_enabled"
                  >是否啟用</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="isCreateModal ? createPrdouct() : updatePrdouct()"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</div>`,
};
