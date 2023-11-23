<template>
  <NavBar/>
  <router-view/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
// import $ from 'jquery'

export default {
  components: {
    NavBar
  }, 
  // setup() {
  //   $.ajax({
  //     url: "http://127.0.0.1:3000/user/account/token/",
  //     type: "POST",
  //     data: {
  //       username: "jxz",
  //       password: "12345678",
  //     },
  //     success(resp) {
  //       console.log(resp);
  //     },
  //     error(resp) { 
  //       console.log(resp);
  //     }
  //   });

  //   $.ajax({
  //     url: "http://127.0.0.1:3000/user/account/info/",
  //     type: "GET",
  //     headers: {
  //       Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwYTJkNjFlODkxMTk0NmM4YTNhYTFhMDA1Mjg0NTE1YiIsInN1YiI6IjIiLCJpc3MiOiJzZyIsImlhdCI6MTcwMDcyNDY0NSwiZXhwIjoxNzAxOTM0MjQ1fQ.QMqkyVXSaie0kVkVbXyP8rsqevTV4kai1EcV_OqNMRU",
  //     }, 
  //     success(resp) {
  //       console.log(resp);
  //     },
  //     error(resp) {
  //       console.log(resp);
  //     },
  //   });

  //   $.ajax({
  //     url: "http://127.0.0.1:3000/user/account/register/",
  //     type: "POST",
  //     data: {
  //       username: "test",
  //       password: "12345678",
  //       confirmedPassword: "12345678",
  //     },
  //     success(resp) {
  //       console.log(resp);
  //     },
  //     error(resp) {
  //       console.log(resp);
  //     },
  //   });
  // }


}
</script>
<style>
body {
  background-image: url("@/assets/images/bakcground.jpg");
  background-size: cover;
}
</style>
