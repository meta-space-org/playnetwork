const testJson = { test: 'test' };

const circularJson = { };
circularJson.self = { circularJson };

const testLevel = {
    item_id: '1466632',
    branch_id: 'c0888619-8ecc-432d-9cc2-876042ec8c5f',
    scene: 1466632,
    project_id: 857037,
    name: 'Tests',
    settings: {
        physics: { gravity: [0, -9.8, 0] },
        render: {
            fog_end: 1000,
            fog_start: 1,
            global_ambient: [0.2, 0.2, 0.2],
            fog_color: [0, 0, 0],
            fog: 'none',
            fog_density: 0.01,
            gamma_correction: 1,
            tonemapping: 0,
            exposure: 1,
            skybox: null,
            skyboxIntensity: 1,
            skyboxRotation: [0, 0, 0],
            skyboxMip: 0,
            lightmapSizeMultiplier: 16,
            lightmapMaxResolution: 2048,
            lightmapMode: 1,
            lightmapFilterEnabled: false,
            lightmapFilterRange: 10,
            lightmapFilterSmoothness: 0.2,
            ambientBake: false,
            ambientBakeNumSamples: 1,
            ambientBakeSpherePart: 0.4,
            ambientBakeOcclusionBrightness: 0,
            ambientBakeOcclusionContrast: 0
        }
    },
    entities: {
        'e6fed9aa-f422-4834-bddf-acc9c56ee364': {
            name: 'Root',
            parent: null,
            resource_id: 'e6fed9aa-f422-4834-bddf-acc9c56ee364',
            tags: [],
            enabled: true,
            components: {},
            scale: [1, 1, 1],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            children: [
                'f31215f8-4327-46e5-8c73-5c94d056e078',
                '20554bb5-cc24-4bff-ba92-b8577b750cc4',
                '8ea9cdfd-2a5d-484f-96ac-9b03ceb45c6f',
                '31112a88-7798-405c-b212-c546e420c558'
            ]
        },
        'f31215f8-4327-46e5-8c73-5c94d056e078': {
            name: 'Camera',
            parent: 'e6fed9aa-f422-4834-bddf-acc9c56ee364',
            resource_id: 'f31215f8-4327-46e5-8c73-5c94d056e078',
            tags: [],
            enabled: true,
            components: {
                camera: {
                    fov: 45,
                    projection: 0,
                    clearColor: [0.118, 0.118, 0.118, 1],
                    clearColorBuffer: true,
                    clearDepthBuffer: true,
                    frustumCulling: true,
                    enabled: true,
                    orthoHeight: 4,
                    farClip: 1000,
                    nearClip: 0.1,
                    priority: 0,
                    rect: [0, 0, 1, 1],
                    layers: [0, 1, 2, 3, 4]
                }
            },
            scale: [1, 1, 1],
            position: [4, 3.5, 4],
            rotation: [-30, 45, 0],
            children: []
        },
        '20554bb5-cc24-4bff-ba92-b8577b750cc4': {
            name: 'Light',
            parent: 'e6fed9aa-f422-4834-bddf-acc9c56ee364',
            resource_id: '20554bb5-cc24-4bff-ba92-b8577b750cc4',
            tags: [],
            enabled: true,
            components: {
                light: {
                    enabled: true,
                    bake: false,
                    bakeNumSamples: 1,
                    bakeArea: 0,
                    bakeDir: true,
                    affectDynamic: true,
                    affectLightmapped: false,
                    isStatic: false,
                    color: [1, 1, 1],
                    intensity: 1,
                    type: 'directional',
                    shadowDistance: 16,
                    range: 8,
                    innerConeAngle: 40,
                    outerConeAngle: 45,
                    shape: 0,
                    falloffMode: 0,
                    castShadows: true,
                    shadowUpdateMode: 2,
                    shadowType: 0,
                    shadowResolution: 1024,
                    shadowBias: 0.4,
                    normalOffsetBias: 0.05,
                    vsmBlurMode: 1,
                    vsmBlurSize: 11,
                    vsmBias: 0.01,
                    cookieAsset: null,
                    cookieIntensity: 1,
                    cookieFalloff: true,
                    cookieChannel: 'rgb',
                    cookieAngle: 0,
                    cookieScale: [1, 1],
                    cookieOffset: [0, 0],
                    layers: [0]
                }
            },
            scale: [1, 1, 1],
            position: [2, 2, -2],
            rotation: [45, 135, 0],
            children: []
        },
        '8ea9cdfd-2a5d-484f-96ac-9b03ceb45c6f': {
            name: 'Box',
            parent: 'e6fed9aa-f422-4834-bddf-acc9c56ee364',
            resource_id: '8ea9cdfd-2a5d-484f-96ac-9b03ceb45c6f',
            tags: [],
            enabled: true,
            components: {
                render: {
                    enabled: true,
                    type: 'box',
                    asset: null,
                    materialAssets: [null],
                    castShadows: true,
                    receiveShadows: true,
                    lightmapped: false,
                    lightmapSizeMultiplier: 1,
                    castShadowsLightmap: true,
                    rootBone: null,
                    isStatic: false,
                    layers: [0],
                    batchGroupId: -1
                },
                script: {
                    enabled: true,
                    order: ['networkEntity'],
                    scripts: { networkEntity: { enabled: true, attributes: { id: 0, owner: '', properties: [] } } }
                }
            },
            scale: [1, 1, 1],
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            children: []
        },
        '31112a88-7798-405c-b212-c546e420c558': {
            name: 'Plane',
            parent: 'e6fed9aa-f422-4834-bddf-acc9c56ee364',
            resource_id: '31112a88-7798-405c-b212-c546e420c558',
            tags: [],
            enabled: true,
            components: {
                render: {
                    enabled: true,
                    type: 'plane',
                    asset: null,
                    materialAssets: [null],
                    castShadows: true,
                    receiveShadows: true,
                    lightmapped: false,
                    lightmapSizeMultiplier: 1,
                    castShadowsLightmap: true,
                    rootBone: null,
                    isStatic: false,
                    layers: [0],
                    batchGroupId: -1
                }
            },
            scale: [8, 1, 8],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            children: []
        }
    },
    created: '2022-07-07T12:33:08.639Z'
};

export { testJson, circularJson, testLevel };
