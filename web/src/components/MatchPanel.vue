<template>
    <div class="matchpanel">
        <div class="row">
            <div class="col-4">
                <div class="user-photo">
                    <img :src="$store.state.user.photo" alt="user photo">
                </div>
                <div class="user-name">
                    {{ $store.state.user.username }}
                </div>
            </div>
            <div class="col-4">
                <div class="user-select-bot">
                    <select v-model="selected_bot" class="form-select" aria-label="Default select example">
                        <option value="-1" selected>手动操作</option>
                        <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                            {{ bot.title }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="user-photo">
                    <img :src="$store.state.pk.opponent_photo" alt="user photo">
                </div>
                <div class="user-name">
                    {{ $store.state.pk.opponent_username }}
                </div>
            </div>

            <div class="col-12" style="text-align: center; padding-top: 15vh;">
                <button @click="click_match_btn" type="button" class="btn btn-warning btn-lg">{{ match_btn_info }}</button>
            </div>

        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import $ from 'jquery';

export default {
    setup() {
        const store = useStore();
        let match_btn_info = ref("开始匹配");
        let bots = ref([]);
        let selected_bot = ref(-1);

        const click_match_btn = () => {
            if (match_btn_info.value === "开始匹配") {
                match_btn_info.value = "取消匹配";
                store.state.pk.socket.send(JSON.stringify({
                    event: "start_matching",
                    bot_id: selected_bot.value,
                }));
            } else {
                match_btn_info.value = "开始匹配";
                store.state.pk.socket.send(JSON.stringify({
                    event: "cancel_matching",
                }));
            }
        }

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

        refresh_bots(); // 动态获取机器人列表

        return {
            match_btn_info,
            click_match_btn,
            bots,
            selected_bot,
        }
    }
}
</script>

<style scoped>
div.matchpanel {
    width: 60vw;
    height: 70vh;
    margin: 40px auto;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3vh;
}

div.user-photo {
    text-align: center;
    padding-top: 10vh;
}

div.user-photo img {
    border-radius: 50%;
    width: 20vh;
}

div.user-name {
    text-align: center;
    font-size: 24px;
    color: black;
    padding-top: 2vh;
}

div.user-select-bot {
    text-align: center;
    padding-top: 20vh;
}
</style>

