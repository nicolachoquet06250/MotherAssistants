let fs = require('fs');

if(!fs.existsSync(`${__dirname}/../uploads`)) {
    fs.mkdirSync('uploads');
    fs.mkdirSync('uploads/tmp');
}