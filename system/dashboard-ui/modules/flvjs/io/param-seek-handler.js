define(["exports"],function(_exports){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;_exports.default=function(){function ParamSeekHandler(paramStart,paramEnd){babelHelpers.classCallCheck(this,ParamSeekHandler),this._startName=paramStart,this._endName=paramEnd}return babelHelpers.createClass(ParamSeekHandler,[{key:"getConfig",value:function(baseUrl,range){var needAnd;return 0===range.from&&-1===range.to||(needAnd=!0,-1===baseUrl.indexOf("?")&&(baseUrl+="?",needAnd=!1),needAnd&&(baseUrl+="&"),baseUrl+="".concat(this._startName,"=").concat(range.from.toString()),-1!==range.to&&(baseUrl+="&".concat(this._endName,"=").concat(range.to.toString()))),{url:baseUrl,headers:{}}}},{key:"removeURLParameters",value:function(seekedURL){var params,baseURL=seekedURL.split("?")[0],queryIndex=seekedURL.indexOf("?"),resultParams="";if((params=-1!==queryIndex?seekedURL.substring(queryIndex+1):params)&&0<params.length)for(var pairs=params.split("&"),i=0;i<pairs.length;i++){var pair=pairs[i].split("=");pair[0]!==this._startName&&pair[0]!==this._endName&&(0<i&&(resultParams+="&"),resultParams+=pairs[i])}return 0===resultParams.length?baseURL:baseURL+"?"+resultParams}}]),ParamSeekHandler}()});