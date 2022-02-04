FROM node:16-alpine
ENV NODE_ENV=production

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
EXPOSE 4000
CMD [ "yarn", "run", "start" ]