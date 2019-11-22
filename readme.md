# Lite YouTube Embed

> #### Renders faster than a sneeze.

Provide videos with a supercharged focus on visual performance.
This custom element renders just like the real thing but approximately 224X faster.

## Comparison

| Normal `<iframe>` YouTube embed |  `lite-youtube` |
|---|---|
|  ![Screen Shot 2019-11-03 at 5 23 50 PM](https://user-images.githubusercontent.com/39191/68095560-5c930d00-fe5f-11e9-8104-e73e77a21287.png)   ![Screen Shot 2019-11-03 at 5 21 05 PM](https://user-images.githubusercontent.com/39191/68095562-5d2ba380-fe5f-11e9-8b5f-18f451b0716d.png)  ![Screen Shot 2019-11-03 at 5 19 35 PM](https://user-images.githubusercontent.com/39191/68095565-5d2ba380-fe5f-11e9-835d-85d37df71f52.png)  | ![Screen Shot 2019-11-03 at 5 23 27 PM](https://user-images.githubusercontent.com/39191/68095561-5d2ba380-fe5f-11e9-9393-e2206a64c8bf.png) ![Screen Shot 2019-11-03 at 5 20 55 PM](https://user-images.githubusercontent.com/39191/68095563-5d2ba380-fe5f-11e9-8f9a-f5c4a774cd56.png)  ![Screen Shot 2019-11-03 at 5 20 16 PM](https://user-images.githubusercontent.com/39191/68095564-5d2ba380-fe5f-11e9-908f-7e12eab8b2ad.png) |

## Basic usage

To use the custom embed you will need to:

1. Include the stylesheet within your application
1. Include the script as well
1. Use the element `lite-youtube` markup and scripting
1. Be happy that you're providing a better user experience to your visitors

```html
<!-- Include the stylesheet, this could be direct from the package or bundled -->
<link rel="stylesheet" href="node_modules/lite-youtube-embed/src/lite-yt-embed.css" />

<!-- Include the custom element script -->
<script src="node_modules/lite-youtube-embed/src/lite-yt-embed.js"></script>

<!-- Use the element. You may define uses before the scripts are parsed and executed. -->
<lite-youtube videoid="ogfYd705cRs"></lite-youtube>
```

## Pro-usage

Use this as your HTML, load the script asynchronously, and let the JS progressively enhance it.

```html
<lite-youtube videoid="ogfYd705cRs" style="background-image: url('https://i.ytimg.com/vi/ogfYd705cRs/hqdefault.jpg');">
	<button class="lty-playbtn">
		<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
			<path
				class="ytp-large-play-button-bg"
				d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
				fill="#212121"
				fill-opacity="0.8"
			></path>
			<path d="M 45,24 27,14 27,34" fill="#fff"></path>
		</svg>
	</button>
</lite-youtube>
```

More coming soon.
