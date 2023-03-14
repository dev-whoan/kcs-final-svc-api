FROM node:16-alpine

LABEL email="dev.whoan@gmail.com"
LABEL name="Eugene Minwhoan Kim"
LABEL version="0.0.1"
LABEL description="TripDiary User"

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`

RUN npm ci --verbose

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine As build

WORKDIR /app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Run the build command which creates the production bundle
RUN npm run build

RUN npm ci --only=production --verbose && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /user

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules /user/node_modules
COPY --chown=node:node --from=build /app/dist /user/dist

# Start the server using the production build
CMD [ "node", "/user/dist/main.js" ]
