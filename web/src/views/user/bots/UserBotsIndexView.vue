<template>
    <div class="container" style="margin-top: 20px;">
      <div class="row">
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <img :src="$store.state.user.photo" alt="" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-9">
          <div class="card">
            <div class="card-header">
              <span style="font-size: 130%;">我的Bot</span>
              <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#add-bot-modal" style="">
                创建Bot
              </button>
              <div class="modal fade" id="add-bot-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title fs-5">新建Bot</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="mb-3">
                        <label for="add-bot-title" class="form-label">Bot标题</label>
                        <input v-model="bot_add.title" class="form-control" id="add-bot-title" placeholder="请输入Bot的标题">
                      </div>
                      <div class="mb-3">
                        <label for="add-bot-description" class="form-label">Bot描述</label>
                        <textarea v-model="bot_add.description" class="form-control" id="add-bot-description" rows="3" placeholder="请输入Bot的描述"></textarea>
                      </div>
                      <div class="mb-3">
                        <label for="add-bot-content" class="form-label">Bot代码</label>
                        <VAceEditor 
                          v-model:value="bot_add.content" 
                          @init="editorInit" lang="c_cpp"
                          theme="textmate" style="height: 300px" 
                          :options="{
                            enableBasicAutocompletion: true, //启用基本自动完成
                            enableSnippets: true, // 启用代码段
                            enableLiveAutocompletion: true, // 启用实时自动完成
                            fontSize: 18, //设置字号
                            tabSize: 4, // 标签大小
                            showPrintMargin: false, //去除编辑器里的竖线
                            highlightActiveLine: true,
                          }" />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <div class="error-message">{{bot_add.error_message}}</div>
                      <button type="button" class="btn btn-primary" @click="add_bot">创建</button>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Bot名称</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bot in bots" :key="bot.id">
                    <td>{{ bot.title }}</td>
                    <td>{{ bot.createTime }}</td>
                    <td>
                      <button type="button" class="btn btn-secondary" data-bs-toggle="modal" :data-bs-target="'#update-bot-modal-'+bot.id" style="margin-right: 10px;">修改</button>
                      <button type="button" class="btn btn-danger" @click="remove_bot(bot)">删除</button>
                      <div class="modal fade" :id="'update-bot-modal-'+bot.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title fs-5">创建Bot</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <div class="mb-3">
                                <label for="update-bot-title" class="form-label">Bot标题</label>
                                <input v-model="bot.title" class="form-control" id="update-bot-title" placeholder="请输入Bot的标题">
                              </div>
                              <div class="mb-3">
                                <label for="update-bot-description" class="form-label">Bot描述</label>
                                <textarea v-model="bot.description" class="form-control" id="update-bot-description" rows="3" placeholder="请输入Bot的描述"></textarea>
                              </div>
                              <div class="mb-3">
                                <label for="update-bot-content" class="form-label">Bot代码</label>
                                <VAceEditor 
                                  v-model:value="bot.content" 
                                  @init="editorInit"
                                  lang="c_cpp" 
                                  theme="textmate" 
                                  style="height: 300px"
                                  :options="{
                                    enableBasicAutocompletion: true, //启用基本自动完成
                                    enableSnippets: true, // 启用代码段
                                    enableLiveAutocompletion: true, // 启用实时自动完成
                                    fontSize: 18, //设置字号
                                    tabSize: 4, // 标签大小
                                    showPrintMargin: false, //去除编辑器里的竖线
                                    highlightActiveLine: true,
                                  }" />
                              </div>
                            </div>
                            <div class="modal-footer">
                              <div class="error-message">{{ bot.error_message }}</div>
                              <button type="button" class="btn btn-primary" @click="update_bot(bot)">确认</button>
                              <button type="button" class="btn btn-danger" @click="refresh_bots()" data-bs-dismiss="modal">取消</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
import $ from 'jquery'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap/dist/js/bootstrap'
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/ext-language_tools';

export default {
  components: {
    VAceEditor
  },

  setup() {
    ace.config.set(
            "basePath",
            "https://cdn.jsdelivr.net/npm/ace-builds@" +
            require("ace-builds").version +
            "/src-noconflict/");

    const store = useStore();
    let bots = ref([]);
    
    const bot_add = reactive({
      title: "",
      description: "",
      content: "",
      error_message: "",
    });

    const refresh_bots = () => {
      $.ajax({
        url: "http://127.0.0.1:3000/user/bot/getlist/",
        type: "GET",
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },
        success(resp) {
          bots.value = resp;
          console.log(resp);
        }
      })
    }

    refresh_bots();

    const add_bot = () => {
      bot_add.error_message = "";
      $.ajax({
        url: "http://127.0.0.1:3000/user/bot/add/",
        type: "POST",
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },
        data: {
          title: bot_add.title,
          description: bot_add.description,
          content: bot_add.content,
        },
        success(resp) {
          if (resp.error_message === "success") {
            refresh_bots();
            bot_add.title = "";
            bot_add.description = "";
            bot_add.content = "";
            Modal.getInstance("#add-bot-modal").hide();
          } else {
            bot_add.error_message = resp.error_message;
          }
        }
      });
    }

    const remove_bot = (bot) => {
      $.ajax({
        url: "http://127.0.0.1:3000/user/bot/remove/",
        type: "POST",
        data: {
          bot_id: bot.id,
        },
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },
        success(resp) {
          if (resp.error_message === "success") {
            refresh_bots();
          } else {
            alert(resp.error_message);
          }
        }
      })
    }

    const update_bot = (bot) => {
      $.ajax({
        url: "http://127.0.0.1:3000/user/bot/update/",
        type: "POST",
        data: {
          bot_id: bot.id,
          title: bot.title,
          description: bot.description,
          content: bot.content,
        },
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },
        success(resp) {
          if (resp.error_message === "success") {
            Modal.getInstance("#update-bot-modal-" + bot.id).hide();
            refresh_bots();
          } else {
            alert(resp.error_message);
          }
        }
      })
    }

    return {
      bots, bot_add, add_bot, remove_bot, update_bot, refresh_bots
    }
  }
}
</script>

<style scoped>
div.error-message {
  color: red;
}
</style>

