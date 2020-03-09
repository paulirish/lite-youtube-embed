# Lite YouTube Embed

> #### Renders faster than a sneeze.

Provide videos with a supercharged focus on visual performance.
This custom element renders just like the real thing but approximately 224× faster.

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

## Notes

Note that the embed will be using youtube-nocookie.com instead of youtube.com in order
to be more privacy friendly for end users.


## Pro-usage

Use this as your HTML, load the script asynchronously, and let the JS progressively enhance it.

```html
<lite-youtube videoid="ogfYd705cRs" style="background-image: url('https://i.ytimg.com/vi/ogfYd705cRs/hqdefault.jpg');">
	<div class="lty-playbtn"></div>
</lite-youtube>
```

More coming soon.

## Other lite embeds

- Using Vimeo? Check out [`<lite-vimeo>`](https://github.com/luwes/lite-vimeo-embed) by [Wesley Luyten](https://github.com/luwes).
