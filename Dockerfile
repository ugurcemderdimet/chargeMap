FROM node:10 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json .

RUN npm install
COPY . /app
RUN react-scripts build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80