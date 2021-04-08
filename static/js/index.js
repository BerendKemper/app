"use strict";
import { api } from "../mod/api.js";

const testAnApi = () => {
	api.get("/artists", artists => {
		console.log(artists);
		api.get(artists.mongol, mongol => {
			console.log(mongol);
			api.get(mongol.albums, console.log);
		});
	});
};
testAnApi();