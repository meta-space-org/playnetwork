const valueToRaw = {
    vec2: (value) => {
        if (!value) return null;
        return [value.x, value.y];
    },
    vec3: (value) => {
        if (!value) return null;
        return [value.x, value.y, value.z];
    },
    vec4: (value) => {
        if (!value) return null;
        return [value.x, value.y, value.z, value.w];
    },
    rgb: (value) => {
        if (!value) return null;
        return [value.r, value.g, value.b];
    },
    rgba: (value) => {
        if (!value) return null;
        return [value.r, value.g, value.b, value.a];
    },
    curve: (value) => {
        if (!value) return undefined;

        const data = {
            type: value.type,
            keys: []
        };

        for (let i = 0; i < value.keys.length; i++) {
            const values = value.keys[i];
            data.keys.push(values[0], values[1]);
        }

        return data;
    },
    curveSet: (value) => {
        if (!value) return undefined;

        const data = {
            type: value._type,
            keys: []
        };

        for (let i = 0; i < value.curves.length; i++) {
            const keys = [];

            for (let x = 0; x < value.curves[i].keys.length; x++) {
                const values = value.curves[i].keys[x];
                keys.push(values[0], values[1]);
            }

            data.keys.push(keys);
        }

        return data;
    },
    asset: (value) => {
        if (value === null || typeof (value) === 'number')
            return value;

        if (value instanceof pc.Asset)
            return value.id;

        return null;
    },
    entity: (value) => {
        if (value === null || typeof (value) === 'string')
            return value;

        if (value instanceof pc.Entity)
            return value.getGuid();

        return null;
    },
    arrayClone: (value) => {
        if (!value) return null;
        return value.slice(0);
    },
    json: (value, attribute) => {
        let i = 0;
        for (const key in value) {
            value[key] = getValueFromAttribute(attribute.schema[i], value[key]);
            i++;
        }
        return value;
    },
    originalData: (_, component, fieldName) => {
        return component.originalData[fieldName];
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
    layoutchild: {
        enabled: null,
        minWidth: null,
        minHeight: null,
        maxWidth: null,
        maxHeight: null,
        fitWidthProportion: null,
        fitHeightProportion: null,
        excludeFromLayout: null
    },
    layoutgroup: {
        enabled: null,
        orientation: null,
        reverseX: null,
        reverseY: null,
        alignment: valueToRaw.vec2,
        padding: valueToRaw.vec4,
        spacing: valueToRaw.vec2,
        widthFitting: null,
        heightFitting: null,
        wrap: null
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
    sprite: {
        enabled: null,
        type: null,
        width: null,
        height: null,
        color: valueToRaw.rgb,
        opacity: null,
        flipX: null,
        flipY: null,
        spriteAsset: null,
        frame: null,
        speed: null,
        batchGroupId: null,
        layers: valueToRaw.arrayClone,
        drawOrder: null,
        autoPlayClip: null,
        clips: valueToRaw.originalData
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
    scrollview: {
        enabled: null,
        horizontal: null,
        vertical: null,
        scrollMode: null,
        bounceAmount: null,
        friction: null,
        useMouseWheel: null,
        mouseWheelSensitivity: null,
        horizontalScrollbarVisibility: null,
        verticalScrollbarVisibility: null,
        viewportEntity: valueToRaw.entity,
        contentEntity: valueToRaw.entity,
        horizontalScrollbarEntity: valueToRaw.entity,
        verticalScrollbarEntity: valueToRaw.entity
    },
    scrollbar: {
        enabled: null,
        orientation: null,
        value: null,
        handleSize: null,
        handleEntity: valueToRaw.entity
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
        batchGroupId: null,
        rootBone: valueToRaw.entity
    },
    model: {
        enabled: null,
        type: null,
        asset: valueToRaw.asset,
        materialAsset: valueToRaw.asset,
        castShadows: null,
        castShadowsLightmap: null,
        receiveShadows: null,
        lightmapped: null,
        lightmapSizeMultiplier: null,
        isStatic: null,
        layers: valueToRaw.arrayClone,
        batchGroupId: null
    },
    anim: {
        activate: null,
        animationAssets: valueToRaw.originalData,
        masks: valueToRaw.originalData,
        layerIndices: null,
        parameters: null,
        playing: null,
        rootBone: valueToRaw.entity,
        speed: null,
        stateGraph: null,
        stateGraphAsset: valueToRaw.originalData,
        targets: null
    },
    audiolistener: {
        enabled: null
    },
    sound: {
        data: null,
        distanceModel: null,
        enabled: null,
        maxDistance: null,
        pitch: null,
        positional: null,
        refDistance: null,
        rollOffFactor: null,
        slots: valueToRaw.originalData,
        volume: null
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
    particlesystem: {
        numParticles: null,
        rate: null,
        rate2: null,
        startAngle: null,
        startAngle2: null,
        lifetime: null,
        emitterExtents: valueToRaw.vec3,
        emitterExtentsInner: valueToRaw.vec3,
        emitterRadius: null,
        emitterRadiusInner: null,
        emitterShape: null,
        initialVelocity: null,
        wrapBounds: valueToRaw.vec3,
        localSpace: null,
        screenSpace: null,
        colorMap: null,
        colorMapAsset: valueToRaw.asset,
        normalMap: null,
        normalMapAsset: valueToRaw.asset,
        loop: null,
        preWarm: null,
        sort: null,
        mode: null,
        scene: null,
        lighting: null,
        halfLambert: null,
        intensity: 1,
        stretch: 0.0,
        alignToMotion: false,
        depthSoftening: 0,
        meshAsset: valueToRaw.asset,
        mesh: null,
        depthWrite: false,
        noFog: false,
        orientation: null,
        particleNormal: valueToRaw.vec3,
        animTilesX: null,
        animTilesY: null,
        animStartFrame: null,
        animNumFrames: null,
        animNumAnimations: null,
        animIndex: null,
        randomizeAnimIndex: null,
        animSpeed: null,
        animLoop: null,
        scaleGraph: valueToRaw.curve,
        scaleGraph2: valueToRaw.curve,
        colorGraph: valueToRaw.curveSet,
        colorGraph2: valueToRaw.curveSet,
        alphaGraph: valueToRaw.curve,
        alphaGraph2: valueToRaw.curve,
        localVelocityGraph: valueToRaw.curveSet,
        localVelocityGraph2: valueToRaw.curveSet,
        velocityGraph: valueToRaw.curveSet,
        velocityGraph2: valueToRaw.curveSet,
        rotationSpeedGraph: valueToRaw.curve,
        rotationSpeedGraph2: valueToRaw.curve,
        radialSpeedGraph: valueToRaw.curve,
        radialSpeedGraph2: valueToRaw.curve,
        blendType: null,
        enabled: null,
        paused: null,
        autoPlay: null,
        layers: null
    },
    script: {
        enabled: null,
        order: (_, component) => component.originalData.order,
        scripts: function(scripts, component) {
            const data = {};

            for (let i = 0; i < scripts.length; i++) {
                const scriptName = scripts[i].__scriptType.__name;
                const attributes = {};

                for (const attrName in scripts[i].__scriptType.attributes.index) {
                    attributes[attrName] = getValueFromAttribute(scripts[i].__scriptType.attributes.index[attrName], scripts[i].__attributes[attrName]);
                }

                data[scriptName] = {
                    enabled: scripts[i]._enabled,
                    attributes
                };
            }

            for (const key in component.originalData.scripts) {
                if (data[key])
                    continue;

                const v = component.originalData.scripts[key];

                data[key] = {
                    enabled: v.enabled,
                    attributes: v.attributes
                };
            }

            return data;
        }
    }
};

function getValueFromAttribute(attribute, valueRaw) {
    let value = null;

    switch (attribute.type) {
        case 'boolean':
        case 'number':
        case 'string':
            if (attribute.array) {
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
        case 'json':
            if (attribute.array) {
                value = valueRaw.map((v) => { return valueToRaw[attribute.type](v, attribute); });
            } else {
                value = valueToRaw[attribute.type](valueRaw, attribute);
            }
            break;
    }

    return value;
}

function entityToData(entity) {
    const guid = entity.getGuid();
    const position = entity.getLocalPosition();
    const rotation = entity.getLocalEulerAngles();
    const scale = entity.getLocalScale();

    const components = {};

    for (const name in componentsSchema) {
        if (!entity[name]) continue;

        const fields = componentsSchema[name];
        const component = entity[name];
        components[name] = {};

        for (const fieldName in fields) {
            const field = fields[fieldName];

            if (typeof (field) === 'function') {
                components[name][fieldName] = field(component[fieldName], component, fieldName);
            } else {
                components[name][fieldName] = component[fieldName];
            }
        }
    }

    const children = [];
    for (let i = 0; i < entity.children.length; i++) {
        if (!(entity.children[i] instanceof pc.Entity))
            continue;

        children.push(entity.children[i].getGuid());
    }

    return {
        name: entity.name,
        parent: entity.parent?.getGuid() || null,
        resource_id: guid,
        tags: entity.tags.list(),
        enabled: entity._enabled,
        components,
        position: valueToRaw.vec3(position),
        rotation: valueToRaw.vec3(rotation),
        scale: valueToRaw.vec3(scale),
        children
    };
};

export default entityToData;
