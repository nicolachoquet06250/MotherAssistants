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

    go(user, window) {
        let fetch_enabled = window !== undefined;
        this.connection = setInterval(() => {
            this.options['method'] = 'POST';
            this.events.forEach(event => {
                if(fetch_enabled) {
                    fetch(`${this.url}/websocket/${event.event}`, this.options).then(r => r.json())
                        .then(json => event.callback(null, json, user, this))
                        .catch(err => event.callback(err, null, user, this));
                }
                else {
                    let options = this.options;
                    let url = this.url;
                    let path = url.indexOf('/') ? url.split('/')[2] : null;
                    if(path.indexOf(':')) {
                        path = null;
                    }
                    let port = url.indexOf('/') ? (url.indexOf(':') ? parseInt(url.split('/')[2].split(':')[1]) : null) : null;
                    let host;
                    if(url.indexOf('/')) {
                        if(url.indexOf(':')) {
                            host = url.split('/')[2].split(':')[0];
                        }
                        else host = null;
                    }
                    else host = null;
                    if(path !== null) options['path'] = path;
                    if(port !== null) options['port'] = port;
                    if(host !== null) options['hostname'] = `${host}`;
                    options['path'] = path !== null ? `/${options['path']}/${event.event}` : `/websocket/${event.event}`;
                    let complete_data = '';
                    require('http').request(options,res => {
                        res.on('data', (data) => {
                            if(data.length < 16) {
                                complete_data += data.toString();
                                event.callback(null, JSON.parse(complete_data), user, this)
                            }
                            else complete_data += data.toString();
                        });
                    }).on('error', err => event.callback(err, null, user, this))
                        .end();
                }
            }, this);
        }, 500);
        return this;
    }

    disconnect(callback) {
        clearInterval(this.connection);
        if(this.connection === null) callback();
    }
}