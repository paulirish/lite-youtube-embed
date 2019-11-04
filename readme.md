# `lite-youtube`

### _Render your youtube embed faster than a sneeze._

This custom element visually renders just like the real thing but approximately 224X faster.

## Comparison



| Normal `<iframe>` YouTube embed |  `lite-youtube` |
|---|---|
|  ![Screen Shot 2019-11-03 at 5 23 50 PM](https://user-images.githubusercontent.com/39191/68095560-5c930d00-fe5f-11e9-8104-e73e77a21287.png)   ![Screen Shot 2019-11-03 at 5 21 05 PM](https://user-images.githubusercontent.com/39191/68095562-5d2ba380-fe5f-11e9-8b5f-18f451b0716d.png)  ![Screen Shot 2019-11-03 at 5 19 35 PM](https://user-images.githubusercontent.com/39191/68095565-5d2ba380-fe5f-11e9-835d-85d37df71f52.png)  | ![Screen Shot 2019-11-03 at 5 23 27 PM](https://user-images.githubusercontent.com/39191/68095561-5d2ba380-fe5f-11e9-9393-e2206a64c8bf.png) ![Screen Shot 2019-11-03 at 5 20 55 PM](https://user-images.githubusercontent.com/39191/68095563-5d2ba380-fe5f-11e9-8f9a-f5c4a774cd56.png)  ![Screen Shot 2019-11-03 at 5 20 16 PM](https://user-images.githubusercontent.com/39191/68095564-5d2ba380-fe5f-11e9-908f-7e12eab8b2ad.png) |


## Basic usage

```html
 <lite-youtube data-videoid="ogfYd705cRs"></lite-youtube>
```

## Pro-usage

Use this as your HTML, load the script asynchronously, and let the JS progressively enhance it.

```html
<lite-youtube data-videoid="ogfYd705cRs" style="background-image: url('https://i.ytimg.com/vi/ogfYd705cRs/hqdefault.jpg');">
	<div class="lty-playbtn"></div>
</lite-youtube>
```

More coming soon.