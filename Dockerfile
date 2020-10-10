#############
### build ###
#############

# base image
FROM node:12.18.2 as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY src/favicon.ico /app/src/favicon.ico
COPY src/assets /app/src/assets
COPY src/assets/font /app/src/assets/font

RUN npm install
RUN npm install -g @angular/cli@9.1.10

# add app
COPY . /app

# generate build
RUN ng build --prod --output-path=dist

############
### prod ###
############

# base image
FROM nginx

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod 644 /usr/share/nginx/html/* 

# expose port 80
EXPOSE 8443
EXPOSE 8080

# run nginx
CMD ["nginx", "-g", "daemon off;"]
