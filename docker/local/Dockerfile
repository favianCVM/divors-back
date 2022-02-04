FROM node:16-alpine as development
ENV NODE_ENV=development

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies

COPY package.json .

RUN rm -rf node_modules
RUN yarn cache clean --force

RUN yarn global add nodemon

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Exports
EXPOSE 3333
CMD [ "yarn", "run", "dev" ]