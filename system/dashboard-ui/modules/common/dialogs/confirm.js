define(["exports","./../globalize.js","./../../dialog/dialog.js"],function(_exports,_globalize,_dialog){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=function(text,title){var options;options="string"==typeof text?{title:title,text:text}:text;title=[];title.push({name:options.cancelText||_globalize.default.translate("Cancel"),id:"cancel",type:"cancel"===options.primary?null:"cancel"}),title.push({name:options.confirmText||_globalize.default.translate("ButtonOk"),id:"ok",type:"cancel"===options.primary?"cancel":"submit"}),"cancel"!==options.primary&&title.reverse();return options.buttons=title,options.dialogType="confirm",(0,_dialog.default)(options).then(function(result){return"ok"===result?Promise.resolve():options.cancelResult?Promise.reject(options.cancelResult):Promise.reject()})}});