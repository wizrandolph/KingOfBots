<template>
    <ContentField>
        <div>我的Bots</div>
    </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField.vue'
import $ from 'jquery'
import { useStore } from 'vuex';

export default {
  components: {
    ContentField
  },
  setup() {
    const store = useStore();
    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/bot/add/",
    //   type: "POST",
    //   data: {
    //     title: "test_title",
    //     description: "这是我的第一个Bot",
    //     content: "这是我的第一个Bot的内容",
    //   }, 
    //   headers: {
    //     Authorization: "Bearer " + store.state.user.token,
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   },

    // });
    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/bot/remove/",
    //   type: "POST",
    //   data: {
    //     bot_id: 3,
    //   }, 
    //   headers: {
    //     Authorization: "Bearer " + store.state.user.token,
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   },

    // });
    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/bot/update/",
    //   type: "POST",
    //   data: {
    //     bot_id: "2",
    //     title: "modified_title_2",
    //     description: "modified_description_2",
    //     content: "modified_content_2",
    //   }, 
    //   headers: {
    //     Authorization: "Bearer " + store.state.user.token,
    //   },
    //   success(resp) {
    //     console.log(resp)
    //   },
    //   error(resp) {
    //     console.log(resp)
    //   },

    // });
    $.ajax({
      url: "http://127.0.0.1:3000/user/bot/getlist/",
      type: "GET", 
      headers: {
        Authorization: "Bearer " + store.state.user.token,
      },
      success(resp) {
        console.log(resp)
      },
      error(resp) {
        console.log(resp)
      },

    });
  }
}
</script>

<style scoped>
</style>

