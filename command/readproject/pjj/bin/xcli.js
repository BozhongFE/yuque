#!/usr/bin/env node
let fs = require('fs');
let path = require('path');

/**
 * 格式化路径（斜杆\）和去除路径名
 * @param {*} url 传入路径
 * @param {*} sign 标记1走
 */
let formatPath = (url, sign) => {
  if (sign == 1) {
    return url.replace(path.resolve(__dirname, '../../'), '').replace(/^\\/g, '').replace(/\\/g, '/');
  } else {
    return url.replace(/\\/g, '/');
  }
};
/**
 * 格式化时间
 */
let getDate = () => {
  let date = new Date().toString();
  return date.replace(/GMT\+08:00/g, '中国标准时间');
};
/**
 * 写入文件
 * @param {*} url 传入路径
 * @param {*} content 传入数据
 */
let writeFile = (url, content) => {
  fs.writeFile(path.resolve(url), content, (err) => {
    if (err) throw err;
  });
};
/**
 * 读取package.json，拿到字段
 * @param {*} url 传入路径
 */
let newContent = {}, projects = []; // 构造数据
newContent.directory = formatPath(path.resolve(__dirname, '../../'));
newContent.date = getDate();
let readFile = (url) => {
  let obj = {};
  fs.readFile(path.resolve(url, './package.json'), 'utf8', (err, content) => {
    if (err) throw err;
    content = JSON.parse(content);
    obj.name = content.name || '';
    obj.description = content.description || '';
    obj.path = formatPath(url, 1);
    projects.push(obj);
    newContent.projects = projects;
    writeFile(path.resolve(__dirname, '../../../projects.json'), JSON.stringify(newContent));
  });
};
/**
 * 循环读取文件夹
 */
let readdir = (url) => {
  fs.readdir(url, (err, files) => {
    if (err) throw err;
    let len = files.length;
    
    if (files.indexOf('package.json') > 0) {
      readFile(path.resolve(url));
    } else {
      let len = files.length;
      let i = 0;
      while(i < len) {
        let newUrl = path.resolve(url, files[i].toString());
        readdir(newUrl);
        i++;
      }
    }
  });
}
/**
 * 读取文件夹
 */
fs.readdir(path.resolve(__dirname, '../../'), (err, files) => {
  if (err) throw err;
  let len = files.length;
  for (let i = 0; i < len; i++) {
    readdir(path.resolve(__dirname, '../../', files[i]));
  }
});
