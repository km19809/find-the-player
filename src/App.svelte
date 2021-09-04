<script>
	import * as Tone from "tone";
	import { _, setupI18n } from "./i18n.js";
	import { getLocaleFromNavigator } from "svelte-i18n";
	import { onMount } from "svelte";

	const HalfWidth = 20;
	let mainElement;
	let mainMessage = "Put your headphones on.\nClick to start!";
	let lang = "ko-KR";
	let effector = null;
	let instrument = null;
	let isGameEnd = false;
	const initialPosition = { x: 0, y: 0 };
	function ratioToRange(ratio, start, end) {
		return Math.floor(ratio * (end - start)) + start;
	}
	function textToSpeech(text, lang = "en-US") {
		lang = lang.startsWith("ko") ? "ko-KR" : "en-US";
		if (window.speechSynthesis) {
			let utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = lang;
			speechSynthesis.speak(utterance);
			console.log(utterance);
		}
	}
	async function initTone() {
		await Tone.start();
		const aspectRatio = mainElement.clientWidth / mainElement.clientHeight;
		initialPosition.x = ratioToRange(
			Math.random(),
			-HalfWidth / 2,
			HalfWidth / 2
		);
		initialPosition.y = ratioToRange(
			Math.random(),
			-HalfWidth / 2 / aspectRatio,
			HalfWidth / 2 / aspectRatio
		);
		textToSpeech($_("speech.afterStart"), lang);
		effector = new Tone.Panner3D({
			//Right-hand cartesian
			panningModel: "HRTF",
			positionX: initialPosition.x,
			positionY: 0,
			positionZ: initialPosition.y,
		}).toDestination();
		instrument = new Tone.Player({
			url: "./sleepyGuitar.wav",
			autostart: true,
			loop: true,
		}).connect(effector);
		mainMessage = $_("message.afterStart");
	}
	function onMove(clientX, clientY) {
		if (!instrument) {
			return;
		}
		let dx = (clientX / mainElement.clientWidth - 0.5) * HalfWidth * 2;
		let dy =
			((clientY - 0.5 * mainElement.clientHeight) /
				mainElement.clientWidth) *
			HalfWidth *
			2;
		if (effector) {
			effector.positionX.value = initialPosition.x - dx;
			effector.positionZ.value = initialPosition.y - dy;
			console.log(
				"move",
				effector.positionX.value,
				effector.positionZ.value
			);
		}
	}

	function onMouseMove(ev) {
		onMove(ev.clientX, ev.clientY);
	}
	function onTouchMove(ev) {
		ev.preventDefault();
		onMove(ev.touches[0].clientX, ev.touches[0].clientY);
	}
	function onMouseUp(ev) {
		if (!instrument) {
			return;
		}
		let dx = (ev.clientX / mainElement.clientWidth - 0.5) * HalfWidth * 2;
		let dy =
			((ev.clientY - 0.5 * mainElement.clientHeight) /
				mainElement.clientWidth) *
			HalfWidth *
			2;
		if (effector) {
			effector.positionX.value = initialPosition.x - dx;
			effector.positionZ.value = initialPosition.y - dy;
			if (
				!isGameEnd &&
				Math.abs(effector.positionX.value) < 2 &&
				Math.abs(effector.positionZ.value) < 2
			) {
				mainMessage = $_("message.end");

				instrument.stop();

				textToSpeech($_("speech.end"), lang);
				isGameEnd = true;
			}
			console.log(
				"up",
				effector.positionX.value,
				effector.positionZ.value
			);
		}
	}
	onMount(() => {
		lang = getLocaleFromNavigator();
		setupI18n({ withLocale: lang });
		mainMessage = $_("message.beforeStart");
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta
		name="description"
		content="An simple, audio-only web game. You move cursor to find the player of background music."
	/>
	<meta charset="UTF-8" />
	<title>Find the player</title>
</svelte:head>
<main
	bind:this={mainElement}
	on:click|once={initTone}
	on:touchmove|nonpassive={onTouchMove}
	on:mousemove={onMouseMove}
	on:mouseup={onMouseUp}
>
	{mainMessage}
	{#if isGameEnd}
		<br/><button
			on:focus={() => textToSpeech($_("speech.reload"), lang)}
			on:click={()=>location.reload()}>{$_("message.reload")}</button
		>
	{/if}
</main>

<style>
	main {
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		white-space: pre-line;
		font-size: x-large;
		user-select: none;
	}
</style>
