FROM nginx:alpine
COPY ./configs/prod/nginx.conf /etc/nginx/conf.d/default.conf
