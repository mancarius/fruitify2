FROM nginx:alpine
COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf
