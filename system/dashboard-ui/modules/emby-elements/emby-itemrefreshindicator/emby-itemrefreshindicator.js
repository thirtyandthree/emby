define(["exports","./../../emby-apiclient/events.js","./../../common/input/api.js","./../../shortcuts.js","./../emby-progressring/emby-progressring.js"],function(_exports,_events,_api,_shortcuts,_embyProgressring){function onRefreshProgress(e,apiClient,info){var item;this.itemId||(item=_shortcuts.default.getItemFromChildNode(this))&&(this.itemId=item.Id),info.ItemId===this.itemId&&((item=parseFloat(info.Progress))&&item<100?this.classList.remove("hide"):this.classList.add("hide"),this.setProgress(item))}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;var EmbyItemRefreshIndicator=function(_EmbyProgressRing){babelHelpers.inherits(EmbyItemRefreshIndicator,_EmbyProgressRing);var _super=_createSuper(EmbyItemRefreshIndicator);function EmbyItemRefreshIndicator(){babelHelpers.classCallCheck(this,EmbyItemRefreshIndicator);var _this,self=_this=_super.call(this);return function(){this.hasInit||(this.hasInit=!0)}.call(self),babelHelpers.possibleConstructorReturn(_this,self)}return babelHelpers.createClass(EmbyItemRefreshIndicator,[{key:"connectedCallback",value:function(){var instance,name,handler;_embyProgressring.default.prototype.connectedCallback.call(this),name="RefreshProgress",handler=(handler=onRefreshProgress).bind(instance=this),_events.default.on(_api.default,name,handler),instance[name]=handler}},{key:"disconnectedCallback",value:function(){var instance,name,handler;_embyProgressring.default.prototype.disconnectedCallback.call(this),(handler=(instance=this)[name="RefreshProgress"])&&(_events.default.off(_api.default,name,handler),instance[name]=null),this.itemId=null}}]),EmbyItemRefreshIndicator}(_embyProgressring.default);customElements.define("emby-itemrefreshindicator",EmbyItemRefreshIndicator,{extends:"div"}),_exports.default=_embyProgressring.default});