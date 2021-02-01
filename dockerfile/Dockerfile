ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}hkube/base-node:v1.2.0
LABEL maintainer="reggev.am@gmail.com"
RUN mkdir /hkube
COPY . /hkube/datasource-cleaner
RUN cd /hkube/datasource-cleaner
WORKDIR /hkube/datasource-cleaner
CMD ["node", "app.js"]
