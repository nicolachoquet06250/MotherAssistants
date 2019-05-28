let exec = require('child_process').exec;
let fs = require('fs');

if(!fs.existsSync(`${__dirname}/../public/uploads`)) {
    exec(`cd ${__dirname}/../public && ln -s ../uploads/ .`);
}