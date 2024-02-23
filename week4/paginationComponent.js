
export default{
    props: ["pagination"],
    methods: {
        changePage(page) {
            this.$emit("change-page", page);
        },
    },
    template: `<nav aria-label="Page navigation">
    <ul class="pagination">
      <li
        :class="pagination.has_pre ? '':'disabled'"
        class="page-item"
        @click="changePage(pagination.current_page - 1)"
      >
        <a class="page-link" href="#">Previous</a>
      </li>
      <li
        :class="index !== pagination.current_page ? '':'active'"
        class="page-item"
        v-for="index in pagination.total_pages"
        :key="index"
        @click="changePage(index)"
      >
        <a
          class="page-link"
          href="#"
          v-if="index !== pagination.current_page"
          >{{index}}</a
        >
        <span class="page-link" href="#" v-else>{{index}}</span>
      </li>
      <li
        :class="pagination.has_next ? '':'disabled'"
        class="page-item"
        @click="changePage(pagination.current_page + 1)"
      >
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>`,
}