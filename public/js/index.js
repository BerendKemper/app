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
let getLargeMulti = () => {
    const timeStart = performance.now();
    let i;
    const done = () => {
        if (--i === 0)
            console.log("done", performance.now() - timeStart);
    };
    for (i = 0; i < 1000; i++)
        fetch("/public/html/large.html?c=" + i).then(done);
};
let getLargeMultiInterval = () => {
    let c = 10;
    let done1 = () => {
        if (--c === 0)
            return console.log("done");
        console.log("running:", c);
        getLargeMulti();
    };
    let getLargeMulti = () => {
        let i;
        const done2 = content => {
            console.log(content.length);
            if (--i === 0)
                setTimeout(done1, 1000);
        };
        for (i = 0; i < 11; i++)
            api.get("/public/html/large.html?c=" + i, done2)
    };
    getLargeMulti();
};
getLargeMulti();
// getLargeMultiInterval();