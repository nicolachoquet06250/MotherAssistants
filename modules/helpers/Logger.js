let filePath = null;
class Logger {
    static set Console(v) {
        console.log(v);
    }

    static set Error(v) {
        console.error(v);
    }

    static set Warning(v) {
        console.warn(v);
    }

    static set Debug(v) {
        console.debug(v);
    }

    static set FilePath(v) {
        filePath = v;
    }

    static get FilePath() {
        return filePath;
    }

    static set File(v) {
        let fs = require('fs');
        fs.writeFileSync(Logger.FilePath, v);
        return '';
    }
}

module.exports = Logger;