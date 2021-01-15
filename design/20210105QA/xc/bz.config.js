const { existsSync } = require('fs');
const { resolve } = require('path');
const assert = require('assert');
const shell = require('shelljs');

const publicPath = './';
const projectPath = './';
const outputPath = resolve(process.cwd(), `dist`);
// exp: publicPath = '/wiki/' projectPath = '/activity/wiki/'

assert(publicPath, 'publicPath 填写项目发布地址的路径');
assert(projectPath, 'projectPath 填写项目打包输出的路径');
/**
 * 将分享图复制到输出目录
 */
class CopyShareImg {
  apply(compiler) {
    compiler.plugin('done', (compilation, callback) => {
      console.log('开始将分享图复制到输出目录');
      const shareExists = existsSync(
        resolve(__dirname, './src/assets/img/share')
      );
      if (!shareExists) {
        return console.log('分享源图目录不存在', './src/assets/img/share/');
      }
      shell.cp(
        '-R',
        resolve(__dirname, './src/assets/img/share'),
        resolve(outputPath)
      );
      console.log(`分享图已复制到${resolve(outputPath, './share')}`);
      return callback && callback;
    });
  }
}
module.exports = {
  publicPath,
  projectPath,
  CopyShareImg,
  outputPath,
};
