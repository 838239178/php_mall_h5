FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

VOLUME "/var/www/html"

EXPOSE 80