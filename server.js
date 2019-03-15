/**
* 静态资源服务端口默认为80，需要更改端口可以新建另一个文件执行#
*/
var express = require('express');
var dir = process.cwd();
var app = express()
app.use('/', express.static('./'))
app.listen(80);
console.log('本地服务器已经运行，请通过ip或者修改HOST绑定域名访问');