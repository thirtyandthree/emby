define(["exports","./../../layoutmanager.js","./../../dialoghelper/dialoghelper.js","./../../common/globalize.js","./../../dom.js"],function(_exports,_layoutmanager,_dialoghelper,_globalize,_dom){function onInit(){var header;this.hasInit||(this.hasInit=!0,this.classList.add("dialogCloseButton","hide-mouse-idle-tv","dialogHeaderButton","paper-icon-button-light"),this.setAttribute("tabindex","-1"),(null==(header=this.closest(".formDialogHeader"))?void 0:header.classList.contains("justify-content-center"))&&this.classList.add("dialogCloseButton-positionstart"),_layoutmanager.default.tv?this.classList.add("paper-icon-button-light-tv"):(this.classList.add("dialogCloseButton-auto-focus-style"),"done"===this.getAttribute("closetype")&&this.classList.add("dialogCloseButton-autoright")),"true"===this.getAttribute("data-blur")&&(this.classList.add("paper-icon-button-light-blur"),_dom.default.allowBackdropFilter())&&this.classList.add("paper-icon-button-light-blur-bf"),this.addEventListener("click",onClick),this.innerHTML=function(instance){var html="";return _layoutmanager.default.tv||"done"!==instance.getAttribute("closetype")?html+'<i class="md-icon">&#xe5cd;</i>':(html+='<i class="md-icon dialogCloseButton-icon-autohide">&#xe5cd;</i>')+'<span class="dialogCloseButton-text color-accent dialogCloseButton-text-autohide">'+_globalize.default.translate("Done")+"</span>"}(this))}function onClick(){var dlg=this.closest(".dialog");dlg&&_dialoghelper.default.close(dlg)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!modules/emby-elements/emby-dialogclosebutton/emby-dialogclosebutton.css"]);var EmbyDialogCloseButton=function(_HTMLButtonElement){babelHelpers.inherits(EmbyDialogCloseButton,_HTMLButtonElement);var _super=_createSuper(EmbyDialogCloseButton);function EmbyDialogCloseButton(){babelHelpers.classCallCheck(this,EmbyDialogCloseButton);var _this,self=_this=_super.call(this);return onInit.call(self),babelHelpers.possibleConstructorReturn(_this,self)}return babelHelpers.createClass(EmbyDialogCloseButton,[{key:"connectedCallback",value:function(){onInit.call(this)}},{key:"disconnectedCallback",value:function(){var observer=this.observer;observer&&(observer.disconnect(),this.observer=null)}}]),EmbyDialogCloseButton}(babelHelpers.wrapNativeSuper(HTMLButtonElement));customElements.define("emby-dialogclosebutton",EmbyDialogCloseButton,{extends:"button"}),_exports.default=EmbyDialogCloseButton});