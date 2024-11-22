import swnjs from './index.js'
import { NETWORK } from './src/constant.js';

//VERSION 3

const urls = [
	{ pathname:'/', network_instruction: NETWORK.CACHE },
	{ pathname:'/hello.png', network_instruction: NETWORK.NETWORK_CACHE }
],
SWN = new swnjs("BULGAR", urls);