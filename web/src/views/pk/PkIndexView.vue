<template>
	<PlayGround v-if="$store.state.pk.status === 'playing'"/>
	<MatchPanel v-if="$store.state.pk.status === 'matching'"/>
	<ResultBoard v-if="$store.state.pk.loser !== 'none'"/>
	<div>对战</div>
</template>

<script>
import PlayGround from '@/components/PlayGround.vue'
import MatchPanel from '@/components/MatchPanel.vue'
import ResultBoard from '@/components/ResultBoard.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
	components: {
		PlayGround, MatchPanel, ResultBoard,
	},
	setup() {
		const store = useStore();
		const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

		store.commit("updateLoser", "none");
		store.commit("updateIsRecord", false);

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
					}, 200);
					store.commit("updateGame", data.game);
					
				} else if (data.event === "move") {
					const game = store.state.pk.gameObject;
					const [snake0, snake1] = game.snakes;
					snake0.set_direction(data.a_direction);
					snake1.set_direction(data.b_direction);
				} else if (data.event === "result") {
					const game = store.state.pk.gameObject;
					const [snake0, snake1] = game.snakes;
					const loser = data.loser;
					store.commit("updateLoser", loser);
					if (loser === "A" || loser === "all") {
						snake0.status = "die";
					} 
					if (loser === "B" || loser === "all") {
						snake1.status = "die";
					}
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

