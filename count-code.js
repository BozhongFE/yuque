var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
 
function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {      
          readFileList(path.join(dir, item), filesList);  //递归读取文件
      } else {                
          filesList.push(fullPath);                     
      }        
  });
  return filesList;
}
 
var filesList = [];
readFileList(path.resolve(__dirname, '.'), filesList);
filesList = filesList.filter((item) => /(wxss|css|wxs|js|wxml)$/gi.test(item));
filesList = filesList.sort((a, b) => {
  const map = {
    wxml: 1,
    js: 2,
    wxss: 3,
    wxs: 4,
    css: 5,
  };
  const matcha = a.match(/\.([a-z]+)$/);
  const matchb = b.match(/\.([a-z]+)$/);
  if (!matcha || !matchb) return 0;
  return map[matcha[1]] - map[matchb[1]];
});
const result = filesList.reduce((total, item) => {
  return total + '\n' + fs.readFileSync(item, 'utf-8');
}, '');
fs.writeFileSync(path.resolve(__dirname, 'result.txt'), result, 'utf-8');
