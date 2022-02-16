class Templates {
    constructor() {
        pn.on('_self', (data) => {
            for (let i = 0; i < data.templates.length; i++) {
                const json = data.templates[i];
                const asset = new pc.Asset(json.name, json.type, json.file, json.data);

                // id
                asset.id = json.id;
                asset.preload = true;

                // tags
                for (let i = 0; i < json.tags.length; i++) {
                    asset.tags.add(json.tags[i]);
                }

                pc.app.assets.add(asset);
            }
        });
    }
}
