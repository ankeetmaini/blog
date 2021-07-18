const Image = require("@11ty/eleventy-img");

module.exports = function markdownImage (md, opts) {
    md.renderer.rules.image = function imageRule (tokens, idx) {
        const image = tokens[idx];
        const src = image.attrGet('src');
        const alt = image.content;

        let options = {
            widths: [300, 600],
            formats: ['avif', 'webp', 'jpeg']
        };
        
        Image(src, options);

        let imageAttributes = {
            alt,
            sizes: "(min-width: 30em) 50vw, 100vw",
            loading: "lazy",
            decoding: "async",
        };

        metadata = Image.statsSync(src, options);
        return Image.generateHTML(metadata, imageAttributes);
    }
}