/**/ typeof vi.publisherConfig === 'function' && vi.publisherConfig({ 
  tagConfig: {
        IASPixelEnabled: false,
        AllowMultipleInstances: true,
        OverlayMode: 1, 
        Float: false,
        AdUnitType: '3',
        AllowNonFriendlyIframe: true,
        Maximp: 20,
        HideUnit: 'beforeAd, afterContent',	
        BlockWaterfallCondition: 'missingImpressionListener',

   
  }, 
  playerConfig: { 
  }, 
  viPlayerConfig: {  
        midrolltime: 3, 
        delayBeforeRetry: 10000, 
	    maxFetchedAds: 2,
        maximp: 20,  
        maxrun: 10,  
        maxAdErrors: 7,  
        waterfallRetry: 6,  
        adSources : 'https://vas.outbrain.com/adserver/sources'
  },  
  mobile: { 
        tagConfig: { 	

           } 
  } 
}); 