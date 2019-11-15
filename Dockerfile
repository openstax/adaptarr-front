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


COPY ./tsconfig.json \
  ./tsconfig.prod.json \
  ./tsconfig.test.json \
  ./tslint.yaml \
  ./

COPY ./src ./src
COPY ./scripts ./scripts
COPY ./public ./public
COPY ./config ./config

EXPOSE 80
ENTRYPOINT ["npm", "start"]
