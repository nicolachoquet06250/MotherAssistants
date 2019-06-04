class FalseWebSocket {
    constructor(url = null, options = {}) {
        this.connect(url, options);
        this.events = [];
        this.connection = null;
    }

    connect(url, options) {
        this.url = url;
        this.options = options;
        return this;
    }

    on(event, callback) {
        this.events.push({ event, callback });
        return this;
    }

    async go(user) {
        let fetch_enabled = typeof (window) !== undefined && typeof (window.fetch) !== undefined;
        console.error(fetch_enabled);
        this.connection = setInterval(() => {
            this.options['method'] = 'post';
            this.events.forEach(event => {
                if(fetch_enabled) {
                    fetch(`${this.url}/websocket/${event.event}`, this.options).then(r => r.json())
                        .then(json => event.callback(null, json, user, this))
                        .catch(err => event.callback(err, null, user, this));
                }
                else {
                    let options = this.options;
                    let url = this.url;
                    let path = url.indexOf('/') ? url.split('/')[0] : null;
                    let port = url.indexOf('/') ? (url.indexOf(':') ? parseInt(url.split('/')[0].split(':')[1]) : null) : null;
                    let host = url.indexOf('/') ? (url.indexOf(':') ? parseInt(url.split('/')[0].split(':')[0]) : null) : null;
                    if(path) options['path'] = path;
                    if(port) options['port'] = port;
                    if(host) options['host'] = host;
                    else options['host'] = '/websocket/' + options['host'];
                    require('http').request(options,res => {
                        res.on('data', data => event.callback(null, JSON.parse(data), user, this));
                        res.on('error', err => event.callback(err, null, user, this));
                    });
                }
            }, this);
        }, 500);
        return this.connection;
    }

    disconnect(callback) {
        clearInterval(this.connection);
        if(this.connection === null) callback();
    }

}

let ws = new FalseWebSocket('http://localhost:3000');
ws.on('parent_messages', (err, json, user, ws) => {
    if(!err) console.log(json, user);
    else {
        console.error(err);
    }
}).go({}).catch(console.error)/*.then(() => {
    ws.disconnect(console.log);
});*/