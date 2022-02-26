import 'regenerator-runtime/runtime'; // polyfill for async functions

import {TIMEOUT_SEC} from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPromise = !uploadData
            ? fetch(url)
            : fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(uploadData)
            });

        // Timeout prevents bad internet connections running fetch function forever
        const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok)
            throw new Error(`${data.message} (${res.status})`);

        return data;
    } catch (err) {
        // Error will be handled and displayed by functions calling this one
        // The error here is just propagated by throwing the error again
        throw err;
    }
};