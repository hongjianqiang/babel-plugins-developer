const utils = {
    /**
     * fetch请求
     * 超时功能参考 https://zh.javascript.info/fetch-abort
     * @param {string} url 
     * @param {object} options 
     */
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
            timeout: 60,
    
            ...options
        };

        let controller = window.AbortController && new AbortController();
        let signal = controller && controller.signal;

        const timeout = (sec) => {
            return new Promise((resolve)=>{
                setTimeout(() => {
                    resolve(new Response('timeout', { status: 504, statusText: 'TIMEOUT' }));
                    controller && controller.abort();
                }, sec*1000);
            });
        };

        const request = (url, opts) => {
            return fetch(url, {
                signal: signal,
                ...opts
            });
        };

        return Promise.race([timeout(opts.timeout), request(url, opts)]);
    }
};

export default utils;
