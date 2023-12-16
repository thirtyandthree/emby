define(["exports"],function(_exports){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.SampleInfo=_exports.MediaSegmentInfoList=_exports.MediaSegmentInfo=_exports.IDRSampleList=void 0;_exports.SampleInfo=babelHelpers.createClass(function SampleInfo(dts,pts,duration,originalDts,isSync){babelHelpers.classCallCheck(this,SampleInfo),this.dts=dts,this.pts=pts,this.duration=duration,this.originalDts=originalDts,this.isSyncPoint=isSync,this.fileposition=null}),_exports.MediaSegmentInfo=function(){function MediaSegmentInfo(){babelHelpers.classCallCheck(this,MediaSegmentInfo),this.beginDts=0,this.endDts=0,this.beginPts=0,this.endPts=0,this.originalBeginDts=0,this.originalEndDts=0,this.syncPoints=[],this.firstSample=null,this.lastSample=null}return babelHelpers.createClass(MediaSegmentInfo,[{key:"appendSyncPoint",value:function(sampleInfo){sampleInfo.isSyncPoint=!0,this.syncPoints.push(sampleInfo)}}]),MediaSegmentInfo}(),_exports.IDRSampleList=function(){function IDRSampleList(){babelHelpers.classCallCheck(this,IDRSampleList),this._list=[]}return babelHelpers.createClass(IDRSampleList,[{key:"clear",value:function(){this._list=[]}},{key:"appendArray",value:function(syncPoints){var list=this._list;0!==syncPoints.length&&(0<list.length&&syncPoints[0].originalDts<list[list.length-1].originalDts&&this.clear(),Array.prototype.push.apply(list,syncPoints))}},{key:"getLastSyncPointBeforeDts",value:function(dts){if(0===this._list.length)return null;var mid,list=this._list,idx=0,last=list.length-1,lbound=0,ubound=last;for(dts<list[0].dts&&(idx=0,lbound=ubound+1);lbound<=ubound;){if((mid=lbound+Math.floor((ubound-lbound)/2))===last||dts>=list[mid].dts&&dts<list[mid+1].dts){idx=mid;break}list[mid].dts<dts?lbound=mid+1:ubound=mid-1}return this._list[idx]}}]),IDRSampleList}(),_exports.MediaSegmentInfoList=function(){function MediaSegmentInfoList(type){babelHelpers.classCallCheck(this,MediaSegmentInfoList),this._type=type,this._list=[],this._lastAppendLocation=-1}return babelHelpers.createClass(MediaSegmentInfoList,[{key:"type",get:function(){return this._type}},{key:"length",get:function(){return this._list.length}},{key:"isEmpty",value:function(){return 0===this._list.length}},{key:"clear",value:function(){this._list=[],this._lastAppendLocation=-1}},{key:"_searchNearestSegmentBefore",value:function(originalBeginDts){var list=this._list;if(0===list.length)return-2;var mid,last=list.length-1,lbound=0,ubound=last,idx=0;if(originalBeginDts<list[0].originalBeginDts)return idx=-1;for(;lbound<=ubound;){if((mid=lbound+Math.floor((ubound-lbound)/2))===last||originalBeginDts>list[mid].lastSample.originalDts&&originalBeginDts<list[mid+1].originalBeginDts){idx=mid;break}list[mid].originalBeginDts<originalBeginDts?lbound=mid+1:ubound=mid-1}return idx}},{key:"_searchNearestSegmentAfter",value:function(originalBeginDts){return this._searchNearestSegmentBefore(originalBeginDts)+1}},{key:"append",value:function(mediaSegmentInfo){var list=this._list,lastAppendIdx=this._lastAppendLocation,insertIdx=0;-1!==lastAppendIdx&&lastAppendIdx<list.length&&mediaSegmentInfo.originalBeginDts>=list[lastAppendIdx].lastSample.originalDts&&(lastAppendIdx===list.length-1||lastAppendIdx<list.length-1&&mediaSegmentInfo.originalBeginDts<list[lastAppendIdx+1].originalBeginDts)?insertIdx=lastAppendIdx+1:0<list.length&&(insertIdx=this._searchNearestSegmentBefore(mediaSegmentInfo.originalBeginDts)+1),this._lastAppendLocation=insertIdx,this._list.splice(insertIdx,0,mediaSegmentInfo)}},{key:"getLastSegmentBefore",value:function(originalBeginDts){originalBeginDts=this._searchNearestSegmentBefore(originalBeginDts);return 0<=originalBeginDts?this._list[originalBeginDts]:null}},{key:"getLastSampleBefore",value:function(originalBeginDts){originalBeginDts=this.getLastSegmentBefore(originalBeginDts);return null!=originalBeginDts?originalBeginDts.lastSample:null}},{key:"getLastSyncPointBefore",value:function(originalBeginDts){for(var segmentIdx=this._searchNearestSegmentBefore(originalBeginDts),syncPoints=this._list[segmentIdx].syncPoints;0===syncPoints.length&&0<segmentIdx;)syncPoints=this._list[--segmentIdx].syncPoints;return 0<syncPoints.length?syncPoints[syncPoints.length-1]:null}}]),MediaSegmentInfoList}()});