const url = "https://ec-course-api.hexschool.io/v2";
const path = "ektodorwang-api";
export default {
  data() {
    return {
      openDeleteModalBtn: null,
    };
  },
  props: ["tempProduct"],
  methods: {
    openModal() {
      this.openDeleteModalBtn.show();
    },
    //   5. 刪除產品
    deletePrdouct() {
      axios
        .delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          this.$emit("readProducts");
          this.openDeleteModalBtn.hide();
        })
        .catch((error) => {
          console.error(error.message);
          alert("刪除資料失敗");
        });
    },
  },
  mounted() {
    this.openDeleteModalBtn = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );

    this.$emit("open-modal", this.openModal);
  },
  template: `<div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
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
            class="btn btn-danger"
            @click="deletePrdouct"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>`,
};
