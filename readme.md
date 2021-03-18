# Lite YouTube Embed [![NPM lite-youtube-embed package](https://img.shields.io/npm/v/lite-youtube-embed.svg)](https://npmjs.org/package/lite-youtube-embed)

> #### Renders faster than a sneeze.

Provide videos with a supercharged focus on visual performance.
This custom element renders just like the real thing but approximately 224× faster.

Demo: https://paulirish.github.io/lite-youtube-embed/

## Comparison

| Normal `<iframe>` YouTube embed |  `lite-youtube` |
|---|---|
|  ![Screen Shot 2019-11-03 at 5 23 50 PM](https://user-images.githubusercontent.com/39191/68095560-5c930d00-fe5f-11e9-8104-e73e77a21287.png)   ![Screen Shot 2019-11-03 at 5 21 05 PM](https://user-images.githubusercontent.com/39191/68095562-5d2ba380-fe5f-11e9-8b5f-18f451b0716d.png)  ![Screen Shot 2019-11-03 at 5 19 35 PM](https://user-images.githubusercontent.com/39191/68095565-5d2ba380-fe5f-11e9-835d-85d37df71f52.png)  | ![Screen Shot 2019-11-03 at 5 23 27 PM](https://user-images.githubusercontent.com/39191/68095561-5d2ba380-fe5f-11e9-9393-e2206a64c8bf.png) ![Screen Shot 2019-11-03 at 5 20 55 PM](https://user-images.githubusercontent.com/39191/68095563-5d2ba380-fe5f-11e9-8f9a-f5c4a774cd56.png)  ![Screen Shot 2019-11-03 at 5 20 16 PM](https://user-images.githubusercontent.com/39191/68095564-5d2ba380-fe5f-11e9-908f-7e12eab8b2ad.png) |

## Basic usage

Use the [`lite-youtube-embed` npm package](https://www.npmjs.com/package/lite-youtube-embed) or download from this repo and use `src/`.

To use the custom element you will need to:

1. Include the stylesheet within your application
1. Include the script as well
1. Use the `lite-youtube` tag via HTML or JS.
1. Be happy that you're providing a better user experience to your visitors

```html
<!-- Include the CSS & JS.. (This could be direct from the package or bundled) -->
<link rel="stylesheet" href="node_modules/lite-youtube-embed/src/lite-yt-embed.css" />

<script src="node_modules/lite-youtube-embed/src/lite-yt-embed.js"></script>

<!-- Use the element. You may use it before the lite-yt-embed JS is executed. -->
<lite-youtube videoid="ogfYd705cRs" playlabel="Play: Keynote (Google I/O '18)"></lite-youtube>
```

<br>

Privacy note: lite-youtube uses youtube-nocookie.com instead of youtube.com in order
to be more privacy friendly for end users.

### Custom Player Parameters

YouTube supports a variety of [player parameters](https://developers.google.com/youtube/player_parameters#Parameters) to control the iframe's behavior and appearance.
These may be applied by using the `params` attribute.

```html
<!-- Example to show a video player without controls, starting at 10s in, ending at 20s,
     with modest branding *and* enabling the JS API -->
<lite-youtube videoid="ogfYd705cRs" params="controls=0&start=10&end=30&modestbranding=2&rel=0&enablejsapi=1"></lite-youtube>
```

Note that lite-youtube uses `autoplay=1` by default.

Demo: https://paulirish.github.io/lite-youtube-embed/variants/params.html

## Pro-usage: load w/ JS deferred (aka progressive enhancement)

Use this as your HTML, load the script asynchronously, and let the JS progressively enhance it.

```html
<lite-youtube videoid="ogfYd705cRs" style="background-image: url('https://i.ytimg.com/vi/ogfYd705cRs/hqdefault.jpg');">
  <button type="button" class="lty-playbtn">
    <span class="lyt-visually-hidden">Play Video: Keynote (Google I/O '18)</span>
  </button>
</lite-youtube>
```

Demo: https://paulirish.github.io/lite-youtube-embed/variants/pe.html

## Custom poster image

If you want to provide a custom poster image, just set it as the background-image, and lite-yt will not overwrite it:
```html
<lite-youtube videoid="ogfYd705cRs" style="background-image: url('https://i.ytimg.com/vi/ogfYd705cRs/hqdefault.jpg');"></lite-youtube>
```

Demo: https://paulirish.github.io/lite-youtube-embed/variants/custom-poster-image.html

## Other lite embeds

- Youtube: [`justinribeiro/lite-youtube`](https://github.com/justinribeiro/lite-youtube) - Shadow-DOM-using port of paulirish/lite-youtube-embed
- Vimeo: [`luwes/lite-vimeo-embed`](https://github.com/luwes/lite-vimeo-embed)
- Vimeo: [`slightlyoff/lite-vimeo`](https://github.com/slightlyoff/lite-vimeo)
- Intercom, Help Scout, Drift, & Facebook Messenger: [`calibreapp/react-live-chat-loader`](https://github.com/calibreapp/react-live-chat-loader)
