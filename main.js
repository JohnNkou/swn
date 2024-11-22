/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SWN)
/* harmony export */ });
/* harmony import */ var _src_constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/constant.js */ "./src/constant.js");


class SWN {
	#name;
	#urls;
	#to_handle = {
		[_src_constant_js__WEBPACK_IMPORTED_MODULE_0__.NETWORK.CACHE]:true,
		[_src_constant_js__WEBPACK_IMPORTED_MODULE_0__.NETWORK.CACHE_NETWORK_CACHE]:true
	}

	constructor(name,urls){
		this.#name = name;
		this.#urls = urls;
		this.handleFetch = this.handleFetch.bind(this);
		this.handleInstall = this.handleInstall.bind(this);

		addEventListener('fetch',this.handleFetch);
		addEventListener('install',this.handleInstall);
	}

	handleFetch(event){
		let request = event.request,
		url = new URL(request.url),
		pathname = url.pathname,
		recordEntry = this.#urls.find((url)=> url.pathname == pathname);

		if(recordEntry){
			let network_instruction = recordEntry.network_instruction;

			event.respondWith(Promise.resolve(true).then(()=>{
				if(this.#to_handle[network_instruction]){
					return caches.open(this.#name).then((cache)=>{
						return cache.match(pathname).then((response)=>{
							if(response){
								return response;
							}
							else{
								if(network_instruction == _src_constant_js__WEBPACK_IMPORTED_MODULE_0__.NETWORK.CACHE_NETWORK_CACHE){
									event.waitUntil(fetch(request).then(async (response)=>{
										if(response.status >= 200 && response.status < 300){

											event.waitUntil(caches.put(pathname,response));
										}

										return response;
									}));
									
								}
								else{
									console.error("Request for",url,"Failed");
									return Promise.reject(new Error("Request failed"));
								}
							}
						})
					})
				}
				else if(network_instruction == _src_constant_js__WEBPACK_IMPORTED_MODULE_0__.NETWORK.NETWORK_CACHE){
					return fetch(request).then(async (response)=>{
						try{
							if(response.status >= 200 && response.status < 300){
								let r = await caches.match(pathname);

								if(!r){
									let cache = await caches.open(this.#name);
									event.waitUntil(cache.put(pathname,response.clone()));
								}
							}
						}
						catch(error){
							console.error("Error while matching request from cache",pathname);
						}

						return response;
					}).catch((error)=>{
						return caches.match(pathname)
					})
				}
				else if(network_instruction == _src_constant_js__WEBPACK_IMPORTED_MODULE_0__.NETWORK.CUSTOM){
					return recordEntry.handler(event);
				}
			}))
		}
	}

	async handleInstall(event){
		let urls = this.#urls,
		name = this.#name,
		exist;

		console.log('INSTALLING',name);

		urls = urls.filter((url)=> url.network_instruction in this.#to_handle);

		event.waitUntil(Promise.resolve(true).then(async function(){
				exist = await caches.has(name);

				console.log("BUGGY MAN");

				if(exist){
					await caches.delete(name);
				}

				let cache = await caches.open(name);

				await cache.addAll(urls.map((url)=> url.pathname));

				console.log('INSTALLATION ENDED');

				return true;
			})
		)
	}
}

/***/ }),

/***/ "./src/constant.js":
/*!*************************!*\
  !*** ./src/constant.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NETWORK: () => (/* binding */ NETWORK)
/* harmony export */ });
const NETWORK = {
	CACHE:					Symbol('cache'),
	CACHE_NETWORK_CACHE:	Symbol('cache_network_cache'),
	NETWORK_CACHE:			Symbol('network_cache'),
	CUSTOM:					Symbol('custom')
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************!*\
  !*** ./ws.js ***!
  \***************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./index.js");
/* harmony import */ var _src_constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/constant.js */ "./src/constant.js");



//VERSION 3

const urls = [
	{ pathname:'/', network_instruction: _src_constant_js__WEBPACK_IMPORTED_MODULE_1__.NETWORK.CACHE },
	{ pathname:'/hello.png', network_instruction: _src_constant_js__WEBPACK_IMPORTED_MODULE_1__.NETWORK.NETWORK_CACHE }
],
SWN = new _index_js__WEBPACK_IMPORTED_MODULE_0__["default"]("BULGAR", urls);
})();

/******/ })()
;