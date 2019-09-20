#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const pathName = __dirname; // "D:/bozhong/source2018/event";
const join = path.join;
function getJsonFiles(jsonPath) {
    let jsonGet = {
        'directory': pathName,
        'date': Date(),
        'projects': []
    };
    function findJsonFile(path) {
        let files = fs.readdirSync(path);
        if (!/modules/.test(path)) {
            files.forEach(function (item, index) {
                let fPath = join(path, item);
                let stat = fs.statSync(fPath);
                if (stat.isDirectory() === true) {
                    findJsonFile(fPath);
                }
                if (stat.isFile() === true && /package\.json/.test(fPath)) {
                    let _packageJson;
                    try {
                        _packageJson = JSON.parse(fs.readFileSync(fPath, 'utf8'));
                        jsonGet.projects.push({
                            'name': _packageJson.name,
                            'description': _packageJson.description,
                            'path': fPath.replace(/package\.json/, '')
                        })
                    } catch (err) {
                        console.log('err--------', err)
                    };
                }
            });

            fs.writeFile('./projects.json', JSON.stringify(jsonGet, null, '\t'), 'utf8', (err) => {
                if (err) {
                    console.log('write file wrong-----', err);
                    return false;
                }
            });
        }
    }
    findJsonFile(jsonPath);
}
getJsonFiles(pathName);