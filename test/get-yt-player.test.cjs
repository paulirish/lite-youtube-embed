const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

test('concurrent getYTPlayer calls wait for the same player', async () => {
    let LiteYTEmbed;
    const player = { playVideo() {} };
    const context = {
        HTMLElement: class {},
        customElements: { define(name, element) { LiteYTEmbed = element; } },
        document: { createElement() { return {}; } },
        URLSearchParams,
        YT: { Player: function (element, options) {
            queueMicrotask(() => options.events.onReady({ target: player }));
            return player;
        } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/lite-yt-embed.js'), 'utf8'), context);
    const embed = new LiteYTEmbed();
    const classes = new Set();
    embed.classList = { contains: name => classes.has(name), add: name => classes.add(name) };
    embed.needsYTApi = true;
    embed.videoId = 'video';
    embed.getAttribute = () => null;
    embed.append = () => {};
    let ready;
    embed.fetchYTPlayerApi = () => {
        embed.ytApiPromise = new Promise(resolve => { ready = resolve; });
    };

    const first = embed.getYTPlayer();
    const second = embed.getYTPlayer();
    ready();
    assert.equal(await first, player);
    assert.equal(await second, player);
});
