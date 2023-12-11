<template>
	<PlayGround v-if="$store.state.pk.status === 'playing'"/>
	<MatchPanel v-if="$store.state.pk.status === 'matching'"/>
	<div>对战</div>
</template>

<script>
import PlayGround from '@/components/PlayGround.vue'
import MatchPanel from '@/components/MatchPanel.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
	components: {
		PlayGround, MatchPanel,
	},
	setup() {
		const store = useStore();
		const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

		let socket = null;

		onMounted(() => {
			// 初始化对手用户
			store.commit("updateOpponent", {
				username: "对手",
				photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
			})
			socket = new WebSocket(socketUrl);

			socket.onopen = () => {
				console.log('websocket open');
				store.commit("updateSocket", socket);
			}

			socket.onmessage = msg => {
				const data = JSON.parse(msg.data);
				if (data.event === "match_success") {	// 匹配成功
					store.commit("updateOpponent", {
						username: data.opponent_username,
						photo: data.opponent_photo,
					});

					setTimeout(() => {
						store.commit("updateStatus", "playing");
					}, 2000);
					store.commit("updateGamemap", data.gamemap);
					
				}
				console.log(data);
			}

			socket.onclose = () => {
				console.log('websocket close');
			}
		});

		onUnmounted(() => {
			socket.close();
			store.commit("updateStatus", "matching");
		});
	}
}
</script>

<style scoped></style>

