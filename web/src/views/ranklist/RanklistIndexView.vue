<template>
  <ContentField>
    <div>
      <table class="table table-striped table-hover" style="text-align: center;">
        <thead>
          <tr>
            <th>玩家</th>
            <th>天梯分数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <img :src="user.photo" class="ranklist-user-photo">
              &nbsp;
              <span class="ranklist-user-username"> {{ user.username }} </span>
            </td>
            <td>
              <span class="ranklist-user-rating"> {{ user.rating }} </span>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation example" style="float: right;">
        <ul class="pagination">
          <li class="page-item" @click="click_page(-2)">
            <a class="page-link" href="#">前一页</a>
          </li>
          <li :class="'page-item '+page.is_active" v-for="page in pages" :key="page.number" @click="click_page(page.number)">
            <a class="page-link" href="#">{{ page.number }}</a>
          </li>
          
          <li class="page-item" @click="click_page(-1)">
            <a class="page-link" href="#">后一页</a>
          </li>
        </ul>
      </nav>
    </div>
  </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField.vue';
import { useStore } from 'vuex';
import $ from 'jquery';
import { ref } from 'vue';

export default {
  components: {
    ContentField
  },

  setup() {
    const store = useStore();
    let current_page = 1;
    let total_users = 0;
    let users = ref([]);
    let pages = ref([]);

    const click_page = page => {
      if (page === current_page) return;
      if (page === -2) page = current_page - 1;
      if (page === -1) page = current_page + 1;

      if (page >= 1 && page <= parseInt(Math.ceil(total_users / 10))) {
        pull_page(page);
      }
    }

    const update_pages = () => {
      let max_page = parseInt(Math.ceil(total_users / 10));
      let new_pages = [];
      for (let i = current_page - 2; i <= current_page + 2; ++i) {
        if (i >= 1 && i <= max_page) {
          new_pages.push({
            number: i,
            is_active: i === current_page ? "active" : "",
          });
        }
      }
      pages.value = new_pages;
    }

    const pull_page = page => {
      current_page = page;
      $.ajax({
        url: "http://127.0.0.1:3000/ranklist/getlist/",
        type: "GET",
        data: {
          page
        },
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },
        success(resp) {
          console.log(resp);
          users.value = resp.users;
          total_users = resp.users_count;
          update_pages();
        },
        error(resp) {
          console.log(resp);
        }
      })
    }

    pull_page(current_page);

    return {
      users,
      total_users,
      pages,
      click_page,
    }
  }
}
</script>

<style scoped>
img.ranklist-user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>

