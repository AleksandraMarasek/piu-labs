class Ajax {
    constructor(options = {}) {
        this.defaultOptions = {
            baseURL: options.baseURL || '',
            headers: options.headers || {},
            timeout: options.timeout || 5000,
        };
    }

    async _request(method, url, data = null, options = {}) {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...this.defaultOptions.headers,
                ...(options.headers || {}),
            },
        };

        if (data !== null) {
            config.body = JSON.stringify(data);
        }

        const controller = new AbortController();
        const timeout = options.timeout || this.defaultOptions.timeout;

        const timer = setTimeout(() => controller.abort(), timeout);
        config.signal = controller.signal;

        const finalURL = this.defaultOptions.baseURL + url;

        let response;
        try {
            response = await fetch(finalURL, config);
        } catch (err) {
            clearTimeout(timer);
            if (err.name === 'AbortError') {
                throw new Error(`Request timeout: ${timeout}ms`);
            }
            throw new Error('Network error: ' + err.message);
        }

        clearTimeout(timer);

        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch (_) {}
            throw new Error(
                `HTTP ${response.status}: ${errorText || response.statusText}`
            );
        }

        try {
            return await response.json();
        } catch {
            throw new Error('Invalid JSON response');
        }
    }

    async get(url, options) {
        return this._request('GET', url, null, options);
    }

    async post(url, data, options) {
        return this._request('POST', url, data, options);
    }

    async put(url, data, options) {
        return this._request('PUT', url, data, options);
    }

    async delete(url, options) {
        return this._request('DELETE', url, null, options);
    }
}
