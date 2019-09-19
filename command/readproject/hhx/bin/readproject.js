#!/usr/bin/env node

const fs = require('fs');
const process = require('process');

const curDirPath = process.cwd();
const dir = getDirectoryList(curDirPath);
const fileData = {
  directory: curDirPath,
  date: new Date().toLocaleString(),
  projects: []
};
function getDirectoryList(path) {
  return fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory());
};
function getProjects(dir, parentPath = '') {
  while(dir.length) {
    const file = dir.shift();
    const curdirectoryPath = `${curDirPath}${parentPath}/${file}`
    const filePath = curdirectoryPath + '/package.json';
    const isExistPath = fs.existsSync(filePath);
    if (isExistPath) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      fileData.projects.push({
        name: data.name,
        description: data.description,
        path: `${parentPath}/${file}`
      })
    } else {
      getProjects(getDirectoryList(curdirectoryPath), `${parentPath}/${file}`);
    }
  }
}

getProjects(dir);

fs.writeFileSync(curDirPath + '/projects.json', JSON.stringify(fileData));
console.log('Read project successfully')
