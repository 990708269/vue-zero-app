@echo off
chcp 65001 >nul
echo ========================================
echo          正在打包 dist 目录
echo          输出文件：website.tar.gz
echo ========================================
echo.

:: 打包当前目录下的 dist 为 website.tar.gz
tar -czvf "website.tar.gz" "./dist"

echo.
echo ========================================
echo                打包完成！
echo ========================================
pause