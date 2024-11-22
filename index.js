import { NETWORK } from './src/constant.js'

export default class SWN {
	#name;
	#urls;
	#to_handle = {
		[NETWORK.CACHE]:true,
		[NETWORK.CACHE_NETWORK_CACHE]:true
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
								if(network_instruction == NETWORK.CACHE_NETWORK_CACHE){
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
				else if(network_instruction == NETWORK.NETWORK_CACHE){
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
				else if(network_instruction == NETWORK.CUSTOM){
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