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

    /**
     * Initialize the custom element.
     * Create and cache the youtube embed iframe without injecting it to the page just yet.
     */
    constructor() {
        super();

        this.iframeNode = document.createElement('iframe');
        this.iframeNode.setAttribute('frameborder', '0');
        this.iframeNode.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        this.iframeNode.setAttribute('allowfullscreen', '');
        this.iframeNode.setAttribute('src', this.embedSourceUrl);
    }

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
     *
     * @returns {string}
     */
    get posterUrl() {
        return `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
    }


    /**
     * Retrieve the URL targeting the embed video from YouTube.
     *
     * @returns {string}
     */
    get embedSourceUrl() {
        return `https://www.youtube-nocookie.com/embed/${this.videoId}?autoplay=1&${this.params}`;
    }

    static get observedAttributes() {
        return [
            'videoid',
            'params',
        ];
    }

    /**
     * Conduct required actions when an attribute being watched is modified.
     *
     * @param {string} name The name of the modified attribute.
     * @param {string} oldValue The value of the attribute before modification.
     * @param {string} newValue The value of the attribute after modification.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'videoid') {
            this.videoIdChanged();
        }
        if (name === 'params') {
            this.updateSrc();
        }
    }

    /**
     * Property setter for the video identifier.
     * This will update the attribute of the HTML to the provided string.
     *
     * @param {string} value
     */
    set videoId(value) {
        this.setAttribute('videoid', value);
    }

    /**
     * Retrieve the video identifier from the `videoid` attribute.
     * Encode it for security since it can't necessarily be trusted.
     * Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-2---attribute-escape-before-inserting-untrusted-data-into-html-common-attributes
     *
     * @returns {string}
     */
    get videoId() {
        return encodeURIComponent(this.getAttribute('videoid'));
    }

    /**
     * Set any additional parameters for the video embed.
     *
     * @param {string} value
     */
    set params(value) {
        this.setAttribute('params', value);
    }

    /**
     * Get any additional parameters for the URL.
     * Encode them for safety like the video id.
     * This string will not have an ampersand as the first character.
     *
     * @returns {string}
     */
    get params() {
        const parameters = this.getAttribute('params');
        const hasNoParameters = parameters === null;
        const encodeKeyAndValue = (param) => {
            return param
                .split('=')
                .map(encodeURIComponent)
                .join('=');
        };

        if (hasNoParameters === true) {
            return '';
        }

        return parameters
            .split('&')
            .filter(Boolean)
            .map(encodeKeyAndValue)
            .join('&');
    }

    /**
     * Carry out the required actions to update the iframe and placeholder content as the video changes.
     *
     * @returns {void}
     */
    videoIdChanged() {
        // Warm the connection for the poster image
        LiteYTEmbed.addPrefetch('preload', this.posterUrl, 'image');

        this.updateBackgroundImage();
        this.updateSrc();
    }

    /**
     * Set the source attribute to the iframe to the current compiled URL
     *
     * @returns {void}
     */
    updateSrc() {
        this.iframeNode.setAttribute('src', this.embedSourceUrl);
    }

    /**
     * Set the background image of the container to the poster image.
     *
     * @returns {void}
     */
    updateBackgroundImage() {
        this.style.backgroundImage = `url("${this.posterUrl}")`;
    }

    connectedCallback() {
        this.updateBackgroundImage();

        const playBtn = document.createElement('div');
        playBtn.classList.add('lty-playbtn');
        this.append(playBtn);

        // On hover (or tap), warm up the TCP connections we're (likely) about to use.
        this.addEventListener('pointerover', LiteYTEmbed.warmConnections, {once: true});

        // Once the user clicks, add the real iframe and drop our play button
        // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
        //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
        this.addEventListener('click', this.addIframe);
    }

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
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
        // The botguard script is fetched off from google.com
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com');

        // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.
        LiteYTEmbed.addPrefetch('preconnect', 'https://googleads.g.doubleclick.net');
        LiteYTEmbed.addPrefetch('preconnect', 'https://static.doubleclick.net');

        LiteYTEmbed.preconnected = true;
    }

    /**
     * Put the iframe into the DOM
     *
     * @returns {void}
     */
    addIframe(){
        this.insertAdjacentElement('beforeend', this.iframeNode);
        this.classList.add('lyt-activated');
    }
}
// Register custome element
customElements.define('lite-youtube', LiteYTEmbed);
