FROM node:10.13

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*


WORKDIR /var/lib/adaptarr-front

# Install JS packages
COPY ./package.json \
  ./package-lock.json \
  ./

RUN npm install

# HACK: This builds the cnx-designer package.
# Instead, it should already be built or built using postinstall hook.
# RUN cd ./node_modules/cnx-designer && ls -al
RUN cd ./node_modules/cnx-designer && npm install && npm run-script build && npm run-script build:style
RUN cd ./node_modules/slate-counters && npm install && npm run-script build

COPY ./tsconfig.json \
  ./tsconfig.prod.json \
  ./tsconfig.test.json \
  ./tslint.yaml \
  ./

COPY ./config ./config
COPY ./scripts ./scripts
COPY ./public ./public
COPY ./src ./src

EXPOSE 80
ENTRYPOINT ["npm", "start"]
