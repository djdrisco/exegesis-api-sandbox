FROM centos:centos7

# This image provides a Node.JS environment you can use to run your Node.JS
# applications.

# Description: centos7 and nodejs docker image


ENV SUMMARY="Platform for building and running Node.js $NODEJS_VERSION applications" \
    DESCRIPTION="Node.js $NODEJS_VERSION available as container is a base platform for \
building and running various Node.js $NODEJS_VERSION applications and frameworks. \
Node.js is a platform built on Chrome's JavaScript runtime for easily building \
fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model \
that makes it lightweight and efficient, perfect for data-intensive real-time applications \
that run across distributed devices."

#ENV PORT=8000

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="$DESCRIPTION" \
      io.k8s.display-name="Node.js $NODEJS_VERSION" \
      com.redhat.dev-mode="DEV_MODE:false" \
      com.redhat.deployments-dir="${APP_ROOT}/src" \
      com.redhat.dev-mode.port="DEBUG_PORT:5858"\
      com.redhat.component="rh-$NAME$NODEJS_VERSION-container" \
      name="centos/$NAME-$NODEJS_VERSION-centos7" \
      version="$NODEJS_VERSION" \
      maintainer="SoftwareCollections.org <sclorg@redhat.com>" \
      help="For more information visit https://github.com/djdrisco/kubernetes-centos7-node"

# # Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

#use nvm
#ENV NODE_VERSION=8.9.3

#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash \
#  && source ~/.bash_profile \
#  && nvm install $NODE_VERSION  \
#  && nvm alias default $NODE_VERSION \
#  && nvm use $NODE_VERSION


#ENV NVM_DIR=~/.nvm
#ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
#ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#newest
# ------------------------------------------------------------------------------
# Install the environment
# ------------------------------------------------------------------------------

# Update the repos and install Extra Packages for Enterprise Linux (EPEL)
# It is a group that maintains the latest packages to their repository.
# It also contains the extra packages required for Red Hat Enterprise Linux (RHEL) & CentOS
#
# Install as a separate step from the application dependencies
RUN yum update -y && yum install -y epel-release

# Downgrade to node 8
RUN rpm -Uvh --oldpackage https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm

# Install dependencies for the application
RUN yum install -y \
    nodejs

RUN yum install -y make && yum install -y gcc

RUN yum install -y gcc-c++



# Copy local code to the container image.
COPY . .

RUN npm install --only=production
RUN npm rebuild bcrypt --build-from-source

RUN echo $PATH

#RUN find / -name "node" && echo "======"
#TODO switch to non-root user
EXPOSE 3000
CMD [ "node", "index.js" ]
#CMD ["sh","-c", "npm --version"]
#CMD ["sh","-c", "~/.nvm/versions/node/v8.9.3/bin/node index.js"]