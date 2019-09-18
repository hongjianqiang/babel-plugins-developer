const utils = {
    fetch(url, options) {
        const opts = {
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            referrer: 'no-referrer',
    
            ...options
        };
    
        return fetch(url, opts);
    }
};

export default utils;
