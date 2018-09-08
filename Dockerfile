
# build: docker build -t angular-blog .
# run: docker run --name angular-blog -d -p 80:80 angular-blog

FROM node:8.9.4-alpine as builder

WORKDIR /ng-app

COPY . .

RUN npm install cnpm -g --registry=https://registry.npm.taobao.org \
	&& cnpm i\
	&& npm run prod\
	&& npm uninstall -g cnpm

FROM nginx:1.13.9-alpine

COPY ./config/nginx-custom.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
