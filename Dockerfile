FROM nginx:alpine
# 1. 清空自带conf，杜绝默认站点跳到/etc/nginx/html
RUN rm -rf /etc/nginx/conf.d/*
# 2. 提前清空nginx默认html里的自带文件（50x.html等）
RUN rm -rf /usr/share/nginx/html/*
# 复制你的配置
COPY ./public/nginx.conf /etc/nginx/conf.d/default.conf
# 平铺dist内部内容，html下直接vue-zero-app
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]