/**
 * A lightweight youtube embed. Still should feel the same to the user, just MUCH faster to initialize and paint.
 *
 * Thx to these as the inspiration
 *   https://storage.googleapis.com/amp-vs-non-amp/youtube-lazy.html
 *   https://autoplay-youtube-player.glitch.me/
 *
 * Once built it, I also found these:
 *   https://github.com/ampproject/amphtml/blob/master/extensions/amp-youtube (👍👍)
 *   https://github.com/Daugilas/lazyYT
 *   https://github.com/vb/lazyframe
 */
class LiteYTEmbed extends HTMLElement {
    constructor() {
        super();

        // Gotta encode the untrusted values
        // https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-2---attribute-escape-before-inserting-untrusted-data-into-html-common-attributes
        this.videoId = encodeURIComponent(this.getAttribute('videoid'));
        this.playLabel = this.getAttribute('playlabel') ? encodeURIComponent(this.getAttribute('playlabel')) : null;

        /**
         * Lo, the youtube placeholder image!  (aka the thumbnail, poster image, etc)
         * There is much internet debate on the reliability of thumbnail URLs. Weak consensus is that you
         * cannot rely on anything and have to use the YouTube Data API.
         *
         * amp-youtube also eschews using the API, so they just try sddefault with a hqdefault fallback:
         *   https://github.com/ampproject/amphtml/blob/6039a6317325a8589586e72e4f98c047dbcbf7ba/extensions/amp-youtube/0.1/amp-youtube.js#L498-L537
         * For now I'm gonna go with this confident (lol) assertion: https://stackoverflow.com/a/20542029, though I'll use `i.ytimg` to optimize for origin reuse.
         *
         * Worth noting that sddefault is _higher_ resolution than hqdefault. Naming is hard. ;)
         * From my own testing, it appears that hqdefault is ALWAYS there sddefault is missing for ~10% of videos
         *
         * TODO: Do the sddefault->hqdefault fallback
         *       - When doing this, apply referrerpolicy (https://github.com/ampproject/amphtml/pull/3940)
         * TODO: Consider using webp if supported, falling back to jpg
         */
        this.posterUrl = `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
        // Warm the connection for the poster image
        LiteYTEmbed.addPrefetch('preload', this.posterUrl, 'image');
        // TODO: support dynamically setting the attribute via attributeChangedCallback
    }

    connectedCallback() {
        this.style.backgroundImage = `url("${this.posterUrl}")`;

        let playBtn = this.querySelector('.lty-playbtn');

        if (!playBtn) {
            playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.title = this.playLabel ? decodeURIComponent(this.playLabel) : `Play Video: ${this.videoId}`;
            playBtn.classList.add('lty-playbtn');
            const iconHTML = `
                <svg class="lty-playicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48">
                    <defs/>
                    <path class="lty-playicon-base" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" class="ytp-large-play-button-bg"/>
                    <path class="lty-playicon-play" d="M45 24L27 14v20"/>
                </svg>
            `;
            playBtn.insertAdjacentHTML('afterbegin', iconHTML);
            this.append(playBtn);
        }

        // On hover (or tap), warm up the TCP connections we're (likely) about to use.
        this.addEventListener('pointerover', LiteYTEmbed.warmConnections, {once: true});

        // Once the user clicks, add the real iframe and drop our play button
        // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
        //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
        this.addEventListener('click', e => this.addIframe());
    }

    // // TODO: Support the the user changing the [videoid] attribute
    // attributeChangedCallback() {
    // }

    /**
     * Add a <link rel={preload | preconnect} ...> to the head
     */
    static addPrefetch(kind, url, as) {
        const linkElem = document.createElement('link');
        linkElem.rel = kind;
        linkElem.href = url;
        if (as) {
            linkElem.as = as;
        }
        linkElem.crossorigin = true;
        document.head.append(linkElem);
    }

    /**
     * Begin pre-connecting to warm up the iframe load
     * Since the embed's network requests load within its iframe,
     *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
     * So, the best we can do is warm up a few connections to origins that are in the critical path.
     *
     * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
     * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
     */
    static warmConnections() {
        if (LiteYTEmbed.preconnected) return;

        // The iframe document and most of its subresources come right off youtube.com
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube.com');
        // The botguard script is fetched off from google.com
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com');

        // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.
        LiteYTEmbed.addPrefetch('preconnect', 'https://googleads.g.doubleclick.net');
        LiteYTEmbed.addPrefetch('preconnect', 'https://static.doubleclick.net');

        LiteYTEmbed.preconnected = true;
    }

    addIframe(){
        const iframeHTML = `
<iframe width="560" height="315" frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
  src="https://www.youtube.com/embed/${this.videoId}?autoplay=1"
></iframe>`;
        this.insertAdjacentHTML('beforeend', iframeHTML);
        this.classList.add('lyt-activated');
    }
}
// Register custome element
customElements.define('lite-youtube', LiteYTEmbed);
