FROM node:12.13-alpine3.9

ARG WORKDIR=/usr/src/app

RUN apk update && apk add bash

WORKDIR ${WORKDIR}

USER node
