备份gulpfile.js
package1.配置好功能：
（1）、编译less，添加浏览器兼容写法，并压缩（gulp-less、less-plugin-autoprefix、gulp-clean-css）
（2）、压缩js（gulp-uglify、gulp-rename）
（3）、把html文件放入dist中（gulp的src()和dest()）
（4）、生成sprite图（gulp.spritesmith）
（5）、把图片放入dist中（gulp的src()和dest()）
（6）、页面自动刷新（browser-sync）
（7）、删除dist（del）

运行主要指令：
gulp sprite   #生成sprite图
gulp          #运行各种task，运行程序

//////////////////////////////////////////////////////////////////////////////////////////
package2.配置好功能：
（1）、package1中的基本配置
（2）、使用gulp-wiredep，实现把bower安装的插件引入到项目中。（注意大多数插件都要配置bower.json中overrides的main！！！）
