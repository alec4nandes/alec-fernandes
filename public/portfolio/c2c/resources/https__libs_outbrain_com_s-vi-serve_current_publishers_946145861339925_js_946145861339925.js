/**/ typeof vi.publisherConfig === 'function' && vi.publisherConfig({
    tagConfig: {
        IAB_Category: 'IAB10, IAB7, IAB20, IAB3, IAB17, IAB5, IAB17-44',
        UseOnlyCategories: false,
        IASPixelEnabled: false,
        AllowMultipleInstances: true,
        PlaylistRandomOrder: true,
        AllowImaAdsInHiddenMode:true,
        AdBreakRetry: true,
        ExactCategoriesOnly: false,
        FloatSize: 0.35,
        Float: false,
        PlaylistMode: 1,
        BlockWaterfallCondition: 'missingImpressionListener',
        PlaylistLength: 50,
        SkipContent: true,
        SkipContentSettings: {
            contentPlayTime: 60,
            labelShowTime: 5,
            label: 'Continue watching'
        },
        OverlayMode: 1,
        CustomMetaParams: [{
            type: 'js',
            param: 'language',
            value: '(config.env.pageLanguage && config.env.pageLanguage.trim().toLowerCase().slice(0,2).match(/en|de|fr|es|ja/)) || (config.tagConfig.Language && config.tagConfig.Language.trim().toLowerCase().slice(0,2).match(/^(?:(?!:en).)*$/)) || "en"'
        }],
        CustomActions: [{
            type: 'js',
            condition: 'config.env.pageLanguage == "ja" ||  top.window.location.href.match(/https?:\\/\\/[^\\/]*?\\.jp\\/.*/)',
            action: 'config.viPlayerConfig.midrolltime = 30;',
            params: ''
        }],

    },
    playerConfig: {},
    viPlayerConfig: {
        preroll: 2,
        maxFetchedAds: 2,
        maximp: 10,
        midrolltime: 10,
        maxAdErrors: 18,
        maxrun: 40,
        waterfallRetry: 35,
        adSources: 'https://vas.outbrain.com/adserver/sources'
    },
    mobile: {
        tagConfig: {
            FloatSize: 0.65,
            Float: false,
        }
    }
});