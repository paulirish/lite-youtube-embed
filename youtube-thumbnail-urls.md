# Lo, the youtube placeholder image!
### (AKA the thumbnail, poster image, etc)

YT thumbnails (eg https://i.ytimg.com/vi/ogfYd705cRs/sddefault.jpg) have multiple resolutions with the following widths:

 - `maxresdefault`: 1280px
 - `sddefault`: 640px
 - `hqdefault`: 480px (lol, naming is hard)
 - `mqdefault`: 320px
 - `default`: 120px

There is [much internet debate](https://stackoverflow.com/q/2068344/89484) on the reliability of thumbnail URLs. And indeed, not every resolution thumbnail is available for every video.

The Google I/O keynote video `ogfYd705cRs` is available in all, but the classic rickroll video (`lXMskKTw3Bc`) is missing maxresdefault. And poor ole "because of the lactose" `lQKdEdzHnfU` is missing the sddefault. (In many, but not all, cases, the deciding factor of having an sddefault is being published after ~2010.)

## Finding the right resolution to use

Many folks have given up with a silver bullet and resort to using the YouTube Data API.

amp-youtube also eschews using the API, so they just [try sddefault with a hqdefault fallback](https://github.com/ampproject/amphtml/blob/186d10a0adadcc8367aaa047b58598b587958946/extensions/amp-youtube/0.1/amp-youtube.js#L496-L527).

I've started with using hqdefault from `i.ytimg` to optimize for origin reuse.

## Annoying Youtube 404 behavior

When YouTube serves a response for a 404 thumbnail, they serve a true 404 response code (good), however they still serve [`content-type: image/jpeg` and valid JPEG data in the response body](https://stackoverflow.com/questions/58560120/why-do-image-and-picture-elements-display-images-despite-http-status-404).  ([example](https://img.youtube.com/vi/lXMskKTw3Bc/maxresdefault.jpg)).  I assume they do this to avoid people seeing broken image icons, but unfortunately this also means you can't rely on `img.onerror`. The linked SO post and [`amp-youtube` both](https://github.com/ampproject/amphtml/blob/186d10a0adadcc8367aaa047b58598b587958946/extensions/amp-youtube/0.1/amp-youtube.js#L519-L528) use `onload` plus a `naturalWidth` check to check instead.

## Aspect ratios

`maxresdefault` and `mqdefault` are 30:17 (very close to 16:9, the HD standard aspect ratio).

`sddefault`, `hqdefault`, `default` are 4:3.

This difference ends up being mostly unimportant, in practice. The YT iframe is a 16:9 size by default. Using `background-position: center` ensures the (possible) black bars in the 4:3 images are hidden.

## WebP

`https://i.ytimg.com/vi_webp/${videoid}/${width}.webp`

I tested across some old and new videos and here's the best image they had available, counted:

```
  "maxresdefault.webp (1280px)": 178,
  "sddefault.webp (640px)"     :  21,
  "hqdefault.webp (480px)"     :   8,
  "maxresdefault.jpg (1280px)" :   6,
  "sddefault.jpg (640px)"      :   2,
  "hqdefault.jpg (480px)"      :  89,
```

My test page (with a smaller set of test videos): https://paulirish.github.io/lite-youtube-embed/testpage/poster-image-summary.html

I found no cases where it a smaller size was not available. For example, if they have the maxresdefault webp, then they definitely have the sddefault webp.

All this means, it'd be very reasonable and efficient to try first for the `maxresdefault.webp`. If it isn't available (see annoying 404 behavior above), then fall back to `hqdefault.jpg`.

In lite-youtube-embed's case though, we'll default to trying the `sddefault.webp` first, as that resolution is plenty for our uses.

## The best poster image for your video

See https://paulirish.github.io/lite-youtube-embed/testpage/poster-image-availability.html


