'use strict';
const {formatDuration} = require('../utils');
const {basename} = require('path');
const request = require('request-prom');

const statuses = {
	F: ({reply}) => reply('⚡ Flashing firmware ⚡'),
	O: ({reply}) => reply('☠️ Printer is off ☠️'),
	H: ({reply}) => reply('☠️ Printer halted ☠️'),
	D: replyWithWebcam('⚠️ Pausing'),
	S: replyWithWebcam('ℹ️ Paused'),
	R: replyWithWebcam('⚠️ Resuming'),
	M: ({reply}) => reply('🙌 Simulating'),
	B: replyWithWebcam('⚠️ Busy'),
	T: replyWithWebcam('ℹ️ Changing Tool'),
	I: replyWithWebcam((ctx, status) => `ℹ️ Idle\n${tempStatus(status)}`),
	P: printing
};

function replyWithWebcam(message) {
	return async (ctx, status) => {
		if (typeof (message) === 'function') {
			message = await message(ctx, status);
		}

		const {webcamSnapshotUrl} = ctx.config;
		if (!webcamSnapshotUrl) {
			return ctx.reply(message);
		}

		return ctx.replyWithPhoto(
			{source: request.stream({url: webcamSnapshotUrl})},
			{caption: message}
		);
	};
}

async function printing(ctx, status) {
	const {
		currentLayer,
		printDuration,
		fractionPrinted,
		timesLeft
	} = status;

	const file = await ctx.duet.getFileInfo();

	return replyWithWebcam(
		`Printing ${basename(file.fileName)} at layer ${currentLayer}.\n` +
		`${tempStatus(status)}\n` +
		`${formatDuration(printDuration)}, ${fractionPrinted}% done, ${formatDuration(timesLeft.filament)} remaining.`
	)(ctx, status);
}

function tempStatus(status) {
	const {temps} = status;
	const currentTool = status.currentTool > -1 ? status.currentTool : 0;
	return `Bed ${temps.bed.current}/${temps.bed.active}, Extruder ${temps.current[currentTool + 1]}/${temps.tools.active[currentTool]}.`;
}

module.exports = (ctx, status) => {
	if (!statuses[status.status]) {
		return ctx.reply(`⚠️ Unknown status (${status.status})`);
	}

	return statuses[status.status](ctx, status);
};

module.exports.replyWithWebcam = replyWithWebcam;
