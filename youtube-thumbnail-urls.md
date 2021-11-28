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