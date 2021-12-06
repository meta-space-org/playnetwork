const valueToRaw = {
    vec2: (value) => {
        if (! value) return null;
        return [ value.x, value.y ];
    },
    vec3: (value) => {
        if (! value) return null;
        return [ value.x, value.y, value.z ];
    },
    vec4: (value) => {
        if (! value) return null;
        return [ value.x, value.y, value.z, value.w ];
    },
    rgb: (value) => {
        if (! value) return null;
        return [ value.r, value.g, value.b ];
    },
    rgba: (value) => {
        if (! value) return null;
        return [ value.r, value.g, value.b, value.a ];
    },
    asset: (value) => {
        if (value === null || typeof(value) === 'number')
            return value;

        if (value instanceof pc.Asset)
            return value.id;

        return null;
    },
    entity: (value) => {
        if (value === null || typeof(value) === 'string')
            return value;

        if (value instanceof pc.Entity)
            return value.getGuid();

        return null;
    },
    arrayClone: (value) => {
        if (! value) return null;
        return value.slice(0);
    }
};

const componentsSchema = {
    camera: {
        enabled: null,
        fov: null,
        projection: null,
        clearColor: valueToRaw.rgba,
        clearColorBuffer: null,
        clearDepthBuffer: null,
        frustumCulling: null,
        orthoHeight: null,
        farClip: null,
        nearClip: null,
        priority: null,
        rect: valueToRaw.vec4,
        layers: valueToRaw.arrayClone
    },
    collision: {
        enabled: null,
        type: null,
        halfExtents: valueToRaw.vec3,
        radius: null,
        axis: null,
        height: null,
        asset: valueToRaw.asset,
        renderAsset: valueToRaw.asset
    },
    screen: {
        enabled: null,
        screenSpace: null,
        scaleMode: null,
        scaleBlend: null,
        resolution: valueToRaw.vec2,
        referenceResolution: valueToRaw.vec2
    },
    element: {
        enabled: null,
        width: null,
        height: null,
        anchor: valueToRaw.vec4,
        pivot: valueToRaw.vec2,
        margin: valueToRaw.vec4,
        alignment: valueToRaw.vec2,
        autoWidth: null,
        autoHeight: null,
        type: null,
        rect: valueToRaw.vec4,
        rtlReorder: null,
        unicodeConverter: null,
        materialAsset: null,
        // material: ,
        color: valueToRaw.rgba,
        opacity: null,
        textureAsset: null,
        // texture: ,
        spriteAsset: null,
        // sprite: ,
        spriteFrame: null,
        pixelsPerUnit: null,
        spacing: null,
        lineHeight: null,
        wrapLines: null,
        layers: valueToRaw.arrayClone,
        fontSize: null,
        minFontSize: null,
        maxFontSize: null,
        autoFitWidth: null,
        autoFitHeight: null,
        maxLines: null,
        fontAsset: null,
        // font: ,
        useInput: null,
        batchGroupId: null,
        mask: null,
        outlineColor: valueToRaw.rgba,
        outlineThickness: null,
        shadowColor: valueToRaw.rgba,
        shadowOffset: valueToRaw.vec2,
        enableMarkup: null,
        key: null,
        text: null
    },
    button: {
        enabled: null,
        active: null,
        imageEntity: null,
        hitPadding: valueToRaw.vec4,
        transitionMode: null,
        hoverTint: valueToRaw.rgba,
        pressedTint: valueToRaw.rgba,
        inactiveTint: valueToRaw.rgba,
        fadeDuration: null,
        hoverSpriteAsset: valueToRaw.asset,
        hoverSpriteFrame: null,
        pressedSpriteAsset: valueToRaw.asset,
        pressedSpriteFrame: null,
        inactiveSpriteAsset: valueToRaw.asset,
        inactiveSpriteFrame: null,
        hoverTextureAsset: valueToRaw.asset,
        pressedTextureAsset: valueToRaw.asset,
        inactiveTextureAsset: valueToRaw.asset
    },
    rigidbody: {
        enabled: null,
        mass: null,
        linearDamping: null,
        angularDamping: null,
        linearFactor: valueToRaw.vec3,
        angularFactor: valueToRaw.vec3,
        friction: null,
        rollingFriction: null,
        restitution: null,
        type: null,
        group: null,
        mask: null
    },
    render: {
        enabled: null,
        material: () => {
            return null;
        },
        asset: valueToRaw.asset,
        materialAssets: valueToRaw.arrayClone,
        castShadows: null,
        receiveShadows: null,
        castShadowsLightmap: null,
        lightmapped: null,
        lightmapSizeMultiplier: null,
        renderStyle: null,
        type: null,
        layers: valueToRaw.arrayClone,
        isStatic: null,
        batchGroupId: null
    },
    light: {
        enabled: null,
        bake: null,
        bakeDir: null,
        affectDynamic: null,
        affectLightmapped: null,
        isStatic: null,
        color: valueToRaw.rgb,
        intensity: null,
        type: null,
        shadowDistance: null,
        range: null,
        innerConeAngle: null,
        outerConeAngle: null,
        shape: null,
        falloffMode: null,
        castShadows: null,
        shadowUpdateMode: null,
        shadowType: null,
        shadowResolution: null,
        shadowBias: null,
        normalOffsetBias: null,
        vsmBlurMode: null,
        vsmBlurSize: null,
        vsmBias: null,
        cookieAsset: null,
        cookieIntensity: null,
        cookieFalloff: null,
        cookieChannel: null,
        cookieAngle: null,
        cookieScale: valueToRaw.vec2,
        cookieOffset: valueToRaw.vec2,
        layers: valueToRaw.arrayClone,
        numCascades: null,
        cascadeDistribution: null
    },
    script: {
        enabled: null,
        order: function(value, script) {
            return script._scripts.map((v) => { return v.__scriptType.__name });
        },
        scripts: function(scripts) {
            const data = { };
            for(let i = 0; i < scripts.length; i++) {
                const scriptName = scripts[i].__scriptType.__name;
                const attributes = { };

                for(const attrName in scripts[i].__scriptType.attributes.index) {
                    let value = null;
                    let valueRaw = scripts[i].__attributes[attrName];
                    const attrType = scripts[i].__scriptType.attributes.index[attrName].type;
                    const attrArray = scripts[i].__scriptType.attributes.index[attrName].array;

                    switch(attrType) {
                        case 'boolean':
                        case 'number':
                        case 'string':
                            if (attrArray) {
                                value = valueRaw.slice(0);
                            } else {
                                value = valueRaw;
                            }
                            break;
                        case 'vec2':
                        case 'vec3':
                        case 'vec4':
                        case 'rgb':
                        case 'rgba':
                        case 'entity':
                        case 'asset':
                            if (attrArray) {
                                value = valueRaw.map((v) => { return valueToRaw[attrType](v); });
                            } else {
                                value = valueToRaw[attrType](valueRaw);
                            }
                            break;
                        // curve
                        // json
                    }

                    attributes[attrName] = value;
                }

                data[scriptName] = {
                    enabled: scripts[i]._enabled,
                    attributes: attributes
                }
            }

            return data;
        }
    }
};

function entityToData(entity) {
    const guid = entity.getGuid();
    const position = entity.getLocalPosition();
    const rotation = entity.getLocalEulerAngles();
    const scale = entity.getLocalScale();

    const components = { };

    for(const name in componentsSchema) {
        if (! entity[name]) continue;
        const fields = componentsSchema[name];
        const component = entity[name];
        components[name] = { };

        for(let fieldName in fields) {
            const field = fields[fieldName];

            if (typeof(field) === 'function') {
                components[name][fieldName] = field(component[fieldName], component);
            } else {
                components[name][fieldName] = component[fieldName];
            }
        }
    }

    const children = [ ];
    for(let i = 0; i < entity.children.length; i++) {
        if (! (entity.children[i] instanceof pc.Entity))
            continue;

        children.push(entity.children[i].getGuid());
    }

    return {
        name: entity.name,
        parent: entity.parent.getGuid(),
        resource_id: guid,
        tags: entity.tags.list(),
        enabled: entity.enabled,
        components: components,
        position: valueToRaw.vec3(position),
        rotation: valueToRaw.vec3(rotation),
        scale: valueToRaw.vec3(scale),
        children: children
    };
};

export default entityToData;
