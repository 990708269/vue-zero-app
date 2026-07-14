@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
:: ==============================================
:: 前端打包 + Docker镜像构建脚本（修复版本递增）
:: ==============================================
echo.
echo ==============================================
echo          Vue前端打包&镜像构建工具【修复版】
echo ==============================================
echo.

:: ====================== 配置常量 ======================
set "IMAGE_NAME=vue-zero-web"
set "BASE_TAR_NAME=nginx-alpine.tar"
set "TAR_PREFIX=%IMAGE_NAME%-v"
set /a IMAGE_VER=1
:: =====================================================

:: 0. 判断是否存在nginx-alpine.tar
echo [0/6] 检测离线基础镜像包 %BASE_TAR_NAME% ...
if exist "%BASE_TAR_NAME%" (
    echo ✅ 当前目录已存在 %BASE_TAR_NAME%
) else (
    echo ⚠️  当前目录未找到 %BASE_TAR_NAME%，离线环境需手动导入
)
echo.

:: 1. 先遍历所有旧tar包，找出最大版本号（核心修复：先算版本，再删文件）
echo [1/6] 扫描历史版本包，自动计算新版本号...
:: 遍历所有匹配的tar提取数字
for /f "delims=" %%f in ('dir /b "%TAR_PREFIX%*.tar" 2^>nul') do (
    set "filename=%%f"
    :: 截取v后面的数字部分
    set "ver_str=!filename:%TAR_PREFIX%=!"
    set "ver_num=!ver_str:.tar=!"
    set /a curr_ver=!ver_num!
    if !curr_ver! geq !IMAGE_VER! (
        set /a IMAGE_VER=!curr_ver! + 1
    )
)
set "FULL_TAG=%IMAGE_NAME%:v!IMAGE_VER!.0"
set "OUT_TAR=%TAR_PREFIX%!IMAGE_VER!.0.tar"
echo ✅ 本次构建新版本：!FULL_TAG!  输出包名：!OUT_TAR!
echo.

:: 2. 删除全部旧的tar包
echo [2/6] 清理所有历史旧镜像tar包...
for /f "delims=" %%f in ('dir /b "%TAR_PREFIX%*.tar" 2^>nul') do (
    echo  删除旧包：%%f
    del /f /q "%%f"
)
echo ✅ 旧包清理完成
echo.

:: 3. npm打包
echo [3/6] 执行 npm run build 打包前端...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 前端打包失败，请检查代码/依赖！
    pause
    exit /b 1
)
echo ✅ 前端打包完成，dist目录已生成
echo.

:: 4. 校验本地nginx:alpine基础镜像
echo [4/6] 校验本地nginx:alpine基础镜像...
docker images --filter=reference="nginx:alpine" -q > tmp_check_img.txt
set /p IMG_EXIST=<tmp_check_img.txt
del /f /q tmp_check_img.txt
if "%IMG_EXIST%"=="" (
    echo ❌ 本地缺失 nginx:alpine 基础镜像，无法联网拉取！
    echo 离线导入命令：docker load -i %BASE_TAR_NAME%
    echo.
    pause
    exit /b 1
)
echo ✅ 基础镜像校验通过
echo.

:: 5. 构建新版本镜像
echo [5/6] 开始构建镜像 !FULL_TAG! ...
docker build --no-cache -t !FULL_TAG! .
if %errorlevel% neq 0 (
    echo ❌ Docker镜像构建失败，请检查Dockerfile！
    pause
    exit /b 1
)
echo ✅ 镜像构建成功：!FULL_TAG!
echo.

:: 6. 导出全新tar包
echo [6/6] 导出离线镜像包 !OUT_TAR! ...
docker save -o !OUT_TAR! !FULL_TAG!
if %errorlevel% neq 0 (
    echo ⚠️ 镜像导出失败，跳过导出步骤
) else (
    echo ✅ 离线镜像包已生成：!OUT_TAR!
)
echo.
echo ==============================================
echo            全部任务执行完毕！
echo 本次输出离线包：!OUT_TAR!
echo ==============================================
pause
endlocal