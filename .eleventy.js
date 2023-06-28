const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return replaceBrackets({
                content: htmlmin.minify(replaceBrackets({ content }), {
                    collapseWhitespace: true,
                    removeComments: true,
                    useShortDoctype: true,
                    // ignore minifying <pre> tags.
                    // remember that < and > are now &lt; and &gt;
                    ignoreCustomFragments: [/&lt;pre[.\s\S]*?\/pre&gt;/],
                }),
                switchBack: true,
            });
        }
        return content;
    });

    return {
        dir: {
            input: "views",
            output: "public",
        },
    };
};

// replace > and < with &gt; and &lt; or vice versa
function replaceBrackets({ content, switchBack = false }) {
    return content
        .replaceAll(...(switchBack ? ["&gt;", ">"] : [">", "&gt;"]))
        .replaceAll(...(switchBack ? ["&lt;", "<"] : ["<", "&lt;"]));
}
