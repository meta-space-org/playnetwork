const ddata = require('./node_modules/dmd/helpers/ddata.js');

exports.inlineLinks = function(text, options) {
    if (!text) return;

    const links = ddata.parseLink(text);
    links.forEach((link) => {
        const linked = ddata._link(link.url, options);
        if (link.caption === link.url) link.caption = linked.name;
        if (linked.url) link.url = linked.url;
        text = text.replace(link.original, '[' + link.caption + ']');
    });

    return text;
};

exports.eventProperties = function(data) {
    if (!data) return '';
    const args = [];
    for (let i = 0; i < data.length; i++) {
        args.push(data[i].name);
    }
    return args.join(', ');
};
