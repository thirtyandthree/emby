define(["exports","./browser.js"],function(_exports,_browser){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=function(options){options=options||{};return Promise.all([function(mediaConfig){{var mimeType,codecs;if(globalThis.cast&&cast.framework&&cast.framework.CastReceiverContext&&cast.framework.CastReceiverContext.getInstance().canDisplayType)return mimeType=mediaConfig.video.contentType.split(";")[0],codecs=(codecs=mediaConfig.video.contentType.split('"'))[codecs.length-2],Promise.resolve({supported:cast.framework.CastReceiverContext.getInstance().canDisplayType(mimeType,codecs,mediaConfig.video.width,mediaConfig.video.height,parseInt(mediaConfig.video.framerate)),smooth:!0})}if(navigator.mediaCapabilities&&navigator.mediaCapabilities.decodingInfo)return navigator.mediaCapabilities.decodingInfo(mediaConfig).catch(getDefaultDecodingInfo);return getDefaultDecodingInfo()}({type:"file",video:{contentType:'video/mp4; codecs="avc1.42E01E"',width:3840,height:2160,bitrate:3e7,framerate:"24"}})]).then(function(responses){var maxH264Level,physicalAudioChannels=options.audioChannels||(_browser.default.tv||_browser.default.chromecast?6:2),videoTestElement=document.createElement("video"),canPlayVp8=videoTestElement.canPlayType('video/webm; codecs="vp8"').replace(/no/,""),canPlayVp9=videoTestElement.canPlayType('video/webm; codecs="vp9"').replace(/no/,""),webmAudioCodecs=["vorbis"],canPlayMkv=function(videoTestElement){if(isNativeTizen||_browser.default.web0s||isNativeWindows||_browser.default.netcast)return!0;if(videoTestElement.canPlayType("video/x-matroska").replace(/no/,"")||videoTestElement.canPlayType("video/mkv").replace(/no/,""))return!0;return!(_browser.default.operaTv||!function(){for(var brands=(navigator.userAgentData||{}).brands||[],i=0,length=brands.length;i<length;i++)if("chromium"===(brands[i].brand||"").toLowerCase())return 1;return _browser.default.chrome}())}(videoTestElement),profile={},videoAudioCodecs=(profile.MaxStreamingBitrate=profile.MaxStaticBitrate=14e7,options.maxStaticMusicBitrate&&(profile.MaxStaticMusicBitrate=options.maxStaticMusicBitrate),profile.MusicStreamingTranscodingBitrate=192e3,profile.DirectPlayProfiles=[],[]),hlsVideoAudioCodecs=[],supportsMp3VideoAudio=videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.69"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.6B"').replace(/no/,""),supportsMp2VideoAudio=isNativeWindows||isNativeTizen||_browser.default.web0s,responses=responses[0].supported&&responses[0].smooth?null:1920,canPlayAacVideoAudio=videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"').replace(/no/,""),aacAudioChannelLimit=_browser.default.chromecast?2:_browser.default.xboxOne?6:0,item=(canPlayAacVideoAudio&&_browser.default.chromecast&&physicalAudioChannels<=2&&videoAudioCodecs.push("aac"),options.item),usingHlsJs=!1,eAc3=(item&&enableHlsJsPlayer(item.RunTimeTicks,item.MediaType)&&(usingHlsJs=!0),function(videoTestElement){if(isNativeTizen||_browser.default.web0s)return 1;return videoTestElement.canPlayType('audio/mp4; codecs="ac-3"').replace(/no/,"")}(videoTestElement)&&(videoAudioCodecs.push("ac3"),(eAc3=function(videoTestElement){if(_browser.default.web0s&&_browser.default.sdkVersion&&3.5<=_browser.default.sdkVersion)return!0;if(isNativeTizen)return!0;return videoTestElement.canPlayType('audio/mp4; codecs="ec-3"').replace(/no/,"")}(videoTestElement))&&videoAudioCodecs.push("eac3"),usingHlsJs||function(videoTestElement){if(isNativeTizen||_browser.default.web0s)return 1;if(videoTestElement.canPlayType)return videoTestElement.canPlayType('application/x-mpegurl; codecs="avc1.42E01E, ac-3"').replace(/no/,"")||videoTestElement.canPlayType('application/vnd.apple.mpegURL; codecs="avc1.42E01E, ac-3"').replace(/no/,"");return}(videoTestElement))&&(hlsVideoAudioCodecs.push("ac3"),!eAc3||usingHlsJs||isNativeTizen||hlsVideoAudioCodecs.push("eac3")),!function(videoTestElement){if(isNativeTizen&&_browser.default.sdkVersion)return!!(6<=_browser.default.sdkVersion||4<=_browser.default.sdkVersion&&_browser.default.isTizenUhd);return videoTestElement.canPlayType('audio/mp4; codecs="ac-4"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="ac-4"').replace(/no/,"")}(videoTestElement)||videoAudioCodecs.push("ac4"),canPlayAacVideoAudio&&_browser.default.chromecast&&!videoAudioCodecs.includes("aac")&&videoAudioCodecs.push("aac"),supportsMp3VideoAudio&&(videoAudioCodecs.push("mp3"),_browser.default.ps4||physicalAudioChannels<=2&&hlsVideoAudioCodecs.push("mp3")),canPlayAacVideoAudio&&(videoAudioCodecs.includes("aac")||videoAudioCodecs.push("aac"),hlsVideoAudioCodecs.push("aac")),!supportsMp3VideoAudio||_browser.default.ps4||hlsVideoAudioCodecs.includes("mp3")||hlsVideoAudioCodecs.push("mp3"),supportsMp2VideoAudio&&videoAudioCodecs.push("mp2"),isNativeTizen||_browser.default.web0s||options.supportsDts),canPlayAacVideoAudio=(isNativeTizen&&_browser.default.sdkVersion&&4<=_browser.default.sdkVersion&&(eAc3=!1),_browser.default.web0s&&_browser.default.sdkVersion&&5<=_browser.default.sdkVersion&&(eAc3=!1),(eAc3=_browser.default.web0s&&_browser.default.sdkVersion&&8<=_browser.default.sdkVersion&&(_browser.default.isWeb0sOled||_browser.default.web0sModelName.match(/QNED8[56789]/gi))?!0:eAc3)&&(videoAudioCodecs.push("dca"),videoAudioCodecs.push("dts")),(isNativeTizen||_browser.default.web0s)&&(videoAudioCodecs.push("pcm_s16le"),videoAudioCodecs.push("pcm_s24le")),options.supportsTrueHd&&videoAudioCodecs.push("truehd"),isNativeTizen&&_browser.default.sdkVersion&&_browser.default.sdkVersion<6&&videoAudioCodecs.push("aac_latm"),canPlayAudioFormat("opus")&&(videoAudioCodecs.push("opus"),usingHlsJs||hlsVideoAudioCodecs.push("opus"),webmAudioCodecs.push("opus")),canPlayAudioFormat("flac")&&videoAudioCodecs.push("flac"),[]),supportsMp3VideoAudio=[],supportsMp2VideoAudio=!!(_browser.default.chromecast&&item&&-1===(item.Container||"").indexOf("ts")&&-1===(item.Path||"").indexOf(".avi")&&item.RunTimeTicks),eAc3=!isNativeTizen&&(!_browser.default.web0s||usingHlsJs),item=(canPlayH264(videoTestElement)&&(canPlayAacVideoAudio.push("h264"),supportsMp3VideoAudio.push("h264")),canPlayH265(videoTestElement)&&(canPlayAacVideoAudio.push("h265"),canPlayAacVideoAudio.push("hevc")),canPlayH265(videoTestElement,"hls",eAc3)&&(supportsMp3VideoAudio.push("h265"),supportsMp3VideoAudio.push("hevc")),[]),canPlayVp9=(!function(videoTestElement){if(isNativeTizen&&_browser.default.sdkVersion)return!!(6<=_browser.default.sdkVersion||5.5<=_browser.default.sdkVersion&&_browser.default.isTizenUhd);return videoTestElement.canPlayType&&videoTestElement.canPlayType('video/mp4; codecs="av01.0.00M.08"').replace(/no/,"")}(videoTestElement)||(canPlayAacVideoAudio.push("av1"),item.push("av1"),supportsMp3VideoAudio.push("av1")),supportsMpeg2Video()&&canPlayAacVideoAudio.push("mpeg2video"),supportsVc1()&&canPlayAacVideoAudio.push("vc1"),isNativeTizen&&canPlayAacVideoAudio.push("msmpeg4v2"),(isNativeTizen||_browser.default.web0s)&&canPlayAacVideoAudio.push("mpeg4"),canPlayVp8&&canPlayAacVideoAudio.push("vp8"),canPlayVp9&&canPlayAacVideoAudio.push("vp9"),(canPlayVp8||isNativeTizen)&&videoAudioCodecs.push("vorbis"),canPlayAacVideoAudio.length&&profile.DirectPlayProfiles.push({Container:"mp4,m4v",Type:"Video",VideoCodec:canPlayAacVideoAudio.join(","),AudioCodec:videoAudioCodecs.join(",")}),canPlayMkv&&canPlayAacVideoAudio.length&&profile.DirectPlayProfiles.push({Container:"mkv",Type:"Video",VideoCodec:canPlayAacVideoAudio.join(","),AudioCodec:videoAudioCodecs.join(",")}),["m2ts","wmv","ts","asf","avi","mpg","mpeg","flv","3gp","mts","trp","vob","vro","mov","rm"].map(function(container){return function(container,videoAudioCodecs,videoTestElement){var supported=!1,profileContainer=container,videoCodecs=[];switch(container){case"asf":supported=isNativeTizen||isNativeWindows||_browser.default.web0s||_browser.default.netcast,videoAudioCodecs=[];break;case"avi":supported=isNativeTizen||isNativeWindows||_browser.default.web0s||_browser.default.netcast;break;case"mpg":case"mpeg":supported=isNativeWindows||isNativeTizen||_browser.default.web0s;break;case"flv":if(!(supported=isNativeTizen)&&null!=globalThis.MediaSource&&canPlayH264(videoTestElement))return function(){var videoAudioCodecs=["aac"];return videoAudioCodecs.push("mp3"),{Container:"flv",Type:"Video",VideoCodec:"h264",AudioCodec:videoAudioCodecs.join(",")}}();break;case"3gp":supported=!(!isNativeTizen&&!_browser.default.web0s)||videoTestElement.canPlayType("video/3gpp").replace(/no/,"");break;case"mts":case"trp":case"vob":case"vro":supported=isNativeTizen;break;case"mov":supported=!_browser.default.edge||isNativeWindows,videoCodecs.push("h264");break;case"m2ts":supported=isNativeTizen||_browser.default.web0s||isNativeWindows,videoCodecs.push("h264"),supportsVc1()&&videoCodecs.push("vc1"),supportsMpeg2Video()&&videoCodecs.push("mpeg2video");break;case"wmv":supported=isNativeTizen||_browser.default.web0s||_browser.default.netcast||isNativeWindows,videoAudioCodecs=[];break;case"ts":supported=isNativeTizen||_browser.default.web0s||_browser.default.netcast||isNativeWindows,videoCodecs.push("h264"),canPlayH265(videoTestElement)&&(videoCodecs.push("h265"),videoCodecs.push("hevc")),supportsVc1()&&videoCodecs.push("vc1"),supportsMpeg2Video()&&videoCodecs.push("mpeg2video"),profileContainer="ts,mpegts";break;case"rm":supported=isNativeTizen||_browser.default.web0s,videoAudioCodecs=[]}return supported?{Container:profileContainer,Type:"Video",VideoCodec:videoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}:null}(container,videoAudioCodecs,videoTestElement)}).filter(function(i){return null!=i}).forEach(function(i){profile.DirectPlayProfiles.push(i)}),["opus","mp3","mp2","aac","flac","alac","webma","wma","asf","wav","ogg","oga"].filter(canPlayAudioFormat).forEach(function(audioFormat){"mp2"===audioFormat?profile.DirectPlayProfiles.push({Container:"mp2,mp3",Type:"Audio",AudioCodec:audioFormat}):"mp3"===audioFormat?profile.DirectPlayProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat}):"wav"===audioFormat?profile.DirectPlayProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:"PCM_S16LE,PCM_S24LE"}):"aac"===audioFormat?(_browser.default.iOS||_browser.default.osx||_browser.default.firefox||profile.DirectPlayProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat}),profile.DirectPlayProfiles.push({Container:"m4a",AudioCodec:audioFormat,Type:"Audio"}),_browser.default.tizen||profile.DirectPlayProfiles.push({Container:"mp4",AudioCodec:audioFormat,Type:"Audio"})):profile.DirectPlayProfiles.push({Container:"webma"===audioFormat?"webma,webm":audioFormat,Type:"Audio"}),"alac"===audioFormat&&profile.DirectPlayProfiles.push({Container:"m4a",AudioCodec:audioFormat,Type:"Audio"})}),canPlayVp8&&item.push("VP8"),canPlayVp9&&item.push("VP9"),item.length&&profile.DirectPlayProfiles.push({Container:"webm",Type:"Video",AudioCodec:webmAudioCodecs.join(","),VideoCodec:item.join(",")}),profile.TranscodingProfiles=[],!(!(_browser.default.iOS||_browser.default.osx||_browser.default.edge)&&canPlayNativeHls())),webmAudioCodecs=_browser.default.iOS||_browser.default.osx?"2":"1",item=_browser.default.edge||usingHlsJs||isNativeTizen,canPlayMkv=(!canPlayHls()||_browser.default.web0s&&!usingHlsJs||profile.TranscodingProfiles.push({Container:_browser.default.edge?"ts":"aac",Type:"Audio",AudioCodec:"aac",Context:"Streaming",Protocol:"hls",MaxAudioChannels:physicalAudioChannels.toString(),MinSegments:webmAudioCodecs,BreakOnNonKeyFrames:canPlayVp9}),["aac","mp3","opus","wav"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()})}),["opus","mp3","aac","wav"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Static",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()})}),canPlayMkv&&supportsMp2VideoAudio&&profile.TranscodingProfiles.push({Container:"mkv",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:canPlayAacVideoAudio.join(","),Context:"Streaming",MaxAudioChannels:physicalAudioChannels.toString(),CopyTimestamps:!0}),canPlayMkv&&profile.TranscodingProfiles.push({Container:"mkv",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:canPlayAacVideoAudio.join(","),Context:"Static",MaxAudioChannels:physicalAudioChannels.toString(),CopyTimestamps:!0}),canPlayHls()&&supportsMp3VideoAudio.length&&!1!==options.enableHls&&(usingHlsJs=[],eAc3&&usingHlsJs.push("m4s"),usingHlsJs.push("ts"),supportsMp2VideoAudio={Container:usingHlsJs.join(","),Type:"Video",AudioCodec:hlsVideoAudioCodecs.join(","),VideoCodec:supportsMp3VideoAudio.join(","),Context:"Streaming",Protocol:"hls",MaxAudioChannels:physicalAudioChannels.toString(),MinSegments:webmAudioCodecs,BreakOnNonKeyFrames:canPlayVp9,ManifestSubtitles:item?"vtt":null},isNativeTizen&&(supportsMp2VideoAudio.MaxManifestSubtitles=10),profile.TranscodingProfiles.push(supportsMp2VideoAudio)),canPlayVp8&&profile.TranscodingProfiles.push({Container:"webm",Type:"Video",AudioCodec:"vorbis",VideoCodec:"vpx",Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()}),profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Static",Protocol:"http"}),profile.ContainerProfiles=[],profile.CodecProfiles=[],isNativeTizen||videoTestElement.audioTracks&&globalThis.AudioTrack),canPlayAacVideoAudio=[],usingHlsJs=(canPlayMkv||canPlayAacVideoAudio.push({Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}),aacAudioChannelLimit&&canPlayAacVideoAudio.push({Condition:"LessThanEqual",Property:"AudioChannels",Value:aacAudioChannelLimit.toString(),IsRequired:!0}),canPlayAacVideoAudio.length&&profile.CodecProfiles.push({Type:"VideoAudio",Codec:"aac",Conditions:canPlayAacVideoAudio}),_browser.default.web0s&&profile.CodecProfiles.push({Type:"VideoAudio",Codec:"flac",Conditions:[{Condition:"LessThanEqual",Property:"AudioChannels",Value:"6"}]}),_browser.default.web0s&&_browser.default.sdkVersion&&4<=_browser.default.sdkVersion&&(eAc3=[],canPlayMkv||eAc3.push({Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}),eAc3.push({Condition:"LessThanEqual",Property:"AudioChannels",Value:"2"}),profile.CodecProfiles.push({Type:"VideoAudio",Codec:"vorbis",Conditions:eAc3})),canPlayMkv||profile.CodecProfiles.push({Type:"VideoAudio",Conditions:[{Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}]}),"high|main|baseline|constrained baseline"),hlsVideoAudioCodecs=(_browser.default.netcast||isNativeTizen||_browser.default.web0s?(maxH264Level=51,isNativeTizen&&_browser.default.sdkVersion&&6<=_browser.default.sdkVersion&&(maxH264Level=52)):maxH264Level=videoTestElement.canPlayType('video/mp4; codecs="avc1.64083e"').replace(/no/,"")?62:videoTestElement.canPlayType('video/mp4; codecs="avc1.640834"').replace(/no/,"")?52:videoTestElement.canPlayType('video/mp4; codecs="avc1.640833"').replace(/no/,"")?51:videoTestElement.canPlayType('video/mp4; codecs="avc1.640832"').replace(/no/,"")?50:42,!isNativeTizen&&!videoTestElement.canPlayType('video/mp4; codecs="avc1.6e0033"').replace(/no/,"")||_browser.default.osx&&!_browser.default.chrome||_browser.default.iOS||_browser.default.web0s||(usingHlsJs+="|high 10"),isNativeTizen&&(responses=_browser.default.isTizenUhd?_browser.default.isTizen8K?(console.log("8K UHD is supported"),7680):(console.log("4K UHD is supported"),4096):(console.log("FHD is supported"),1920)),(function(){if(isNativeTizen)return _browser.default.isTizenFhd?2e7:null;if(isNativeTizen)return 2e7;if(_browser.default.ps4)return 8e6;return null}()||"").toString()),supportsMp3VideoAudio=[],webmAudioCodecs=(hlsVideoAudioCodecs&&supportsMp3VideoAudio.push({Condition:"LessThanEqual",Property:"VideoBitrate",Value:hlsVideoAudioCodecs}),responses&&supportsMp3VideoAudio.push({Condition:"LessThanEqual",Property:"Width",Value:responses.toString(),IsRequired:!1}),isNativeTizen&&_browser.default.sdkVersion&&_browser.default.sdkVersion<3&&supportsMp3VideoAudio.push({Condition:"Equals",Property:"VideoRotation",Value:0,IsRequired:!1}),supportsMp3VideoAudio.slice(0)),canPlayVp9=(webmAudioCodecs.push({Condition:"EqualsAny",Property:"VideoProfile",Value:usingHlsJs,IsRequired:!1}),webmAudioCodecs.push({Condition:"LessThanEqual",Property:"VideoLevel",Value:maxH264Level.toString(),IsRequired:!1}),profile.CodecProfiles.push({Type:"Video",Codec:"h264",Conditions:webmAudioCodecs}),supportsMp3VideoAudio.slice(0)),supportsMp2VideoAudio=getSupportedHevcCodecTags(videoTestElement);return supportsMp2VideoAudio.length&&"*"!==supportsMp2VideoAudio[0]&&canPlayVp9.push({Condition:"EqualsAny",Property:"VideoCodecTag",Value:supportsMp2VideoAudio.join("|"),IsRequired:!1}),profile.CodecProfiles.push({Type:"Video",Codec:"hevc",Conditions:canPlayVp9}),isNativeTizen&&_browser.default.sdkVersion&&4<=_browser.default.sdkVersion&&supportsMp3VideoAudio.push({Condition:"NotEquals",Property:"VideoCodecTag",Value:"xvid",IsRequired:!1}),supportsMp3VideoAudio.length&&profile.CodecProfiles.push({Type:"Video",Conditions:supportsMp3VideoAudio}),profile.SubtitleProfiles=[],function(){if(isNativeTizen)return 1;null==_supportsTextTracks&&(_supportsTextTracks=null!=document.createElement("video").textTracks);return _supportsTextTracks}()&&(canPlayHls()&&item&&profile.SubtitleProfiles.push({Format:"vtt",Method:"Hls"}),enableHlsJsPlayer(1,"Video")&&(profile.SubtitleProfiles.push({Format:"eia_608",Method:"VideoSideData",Protocol:"hls"}),profile.SubtitleProfiles.push({Format:"eia_708",Method:"VideoSideData",Protocol:"hls"})),profile.SubtitleProfiles.push({Format:"vtt",Method:"External"})),profile.SubtitleProfiles.push({Format:"ass",Method:"External"}),profile.SubtitleProfiles.push({Format:"ssa",Method:"External"}),profile.ResponseProfiles=[],profile.ResponseProfiles.push({Type:"Video",Container:"m4v",MimeType:"video/mp4"}),profile})};var _supportsTextTracks,_canPlayHls,isNativeTizen=globalThis.tizen,isNativeWindows=globalThis.Windows;function canPlayH264(videoTestElement){return videoTestElement.canPlayType&&videoTestElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,"")}function getSupportedHevcCodecTags(videoTestElement,protocol,supportsfmp4){if(_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<2&&_browser.default.isWeb0sFhd)return[];if(_browser.default.ps4)return[];if(isNativeTizen)return["*"];var tags=[];if(videoTestElement.canPlayType){if("hls"===protocol&&!supportsfmp4&&!_browser.default.web0s)return(videoTestElement.canPlayType('video/mp2t; codecs="hvc1.1.L0.0"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t ; codecs="hvc1.1.6.L93.B0"').replace(/no/,""))&&tags.push("hvc1"),(videoTestElement.canPlayType('video/mp2t; codecs="hev1.1.L0.0"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t; codecs="hev1.1.2.L150"').replace(/no/,""))&&tags.push("hev1"),(videoTestElement.canPlayType('video/mp2t; codecs="dvh1.04.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t; codecs="dvh1.05.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t; codecs="dvh1.08.07"').replace(/no/,""))&&tags.push("dvh1"),(videoTestElement.canPlayType('video/mp2t; codecs="dvhe.04.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t; codecs="dvhe.05.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp2t; codecs="dvhe.08.07"').replace(/no/,""))&&tags.push("dvhe"),tags.length&&(tags.push("hevc"),tags.push("hdmv")),tags;(videoTestElement.canPlayType('video/mp4; codecs="hvc1.1.L0.0"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4 ; codecs="hvc1.1.6.L93.B0"').replace(/no/,""))&&tags.push("hvc1"),(videoTestElement.canPlayType('video/mp4; codecs="hev1.1.L0.0"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="hev1.1.2.L150"').replace(/no/,""))&&tags.push("hev1"),(videoTestElement.canPlayType('video/mp4; codecs="dvh1.04.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="dvh1.05.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="dvh1.08.07"').replace(/no/,""))&&tags.push("dvh1"),(videoTestElement.canPlayType('video/mp4; codecs="dvhe.04.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="dvhe.05.07"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="dvhe.08.07"').replace(/no/,""))&&tags.push("dvhe"),tags.length&&(tags.push("hevc"),tags.push("hdmv"))}return tags}function canPlayH265(videoTestElement,protocol,supportsfmp4){return 0<getSupportedHevcCodecTags(videoTestElement,protocol,supportsfmp4).length}function canPlayHls(){return _canPlayHls=null==_canPlayHls?canPlayNativeHls()||canPlayHlsWithMSE():_canPlayHls}function canPlayNativeHls(){var media;return!!isNativeTizen||!(!(media=document.createElement("video")).canPlayType("application/x-mpegURL").replace(/no/,"")&&!media.canPlayType("application/vnd.apple.mpegURL").replace(/no/,""))}function canPlayHlsWithMSE(){return null!=globalThis.MediaSource}function canPlayAudioFormat(format){var typeString;if("flac"===format){if(_browser.default.web0s)return!0}else if("wma"===format){if(isNativeTizen)return!0;if(isNativeWindows)return!0}else if("asf"===format){if(isNativeTizen)return!0;if(isNativeWindows)return!0}else if("opus"===format)return!(_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<4||(typeString='audio/ogg; codecs="opus"',!document.createElement("audio").canPlayType(typeString).replace(/no/,"")));if("webma"===format)typeString="audio/webm";else if("mp2"===format)typeString="audio/mpeg";else if("alac"===format){if(_browser.default.firefox)return!1;typeString='audio/mp4 codecs="alac"'}else{if(("ogg"===format||"oga"===format)&&_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<4)return!1;typeString="audio/"+format}return!!document.createElement("audio").canPlayType(typeString).replace(/no/,"")}function supportsMpeg2Video(){return isNativeTizen||isNativeWindows||_browser.default.web0s||_browser.default.netcast}function supportsVc1(){return isNativeTizen||isNativeWindows||_browser.default.web0s||_browser.default.netcast}function getDefaultDecodingInfo(){return Promise.resolve({supported:!0,smooth:!0,isDummyInfo:!0})}function enableHlsJsPlayer(runTimeTicks,mediaType){if(!isNativeTizen&&canPlayHlsWithMSE()&&!_browser.default.web0s&&!_browser.default.edge){if(canPlayNativeHls()){if(_browser.default.android&&"Audio"===mediaType)return 1;if(runTimeTicks&&"Audio"===mediaType)return;if(_browser.default.osx)return}return 1}}});