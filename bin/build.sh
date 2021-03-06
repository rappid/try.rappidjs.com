#!/bin/bash -x

# stop if we have some error
set -e

WORKSPACE=`pwd`
DEPENDENCIES="${WORKSPACE}/dependencies"
REPOSITORY=/local/repository/try.rappidjs.com
BRANCH=${GIT_BRANCH};

if [ -z BRANCH ]; then
    # branch not set from jenkins, get it from the git commandline
    BRANCH=`git status | grep "On branch" | cut -d' '  -f 4`
fi

rm -rf public public-build server
git reset --hard HEAD
git pull origin dev;

# install dependencies
npm install > /dev/null

echo "Dependencies: ${DEPENDENCIES}"

rm -rf ${DEPENDENCIES}
mkdir ${DEPENDENCIES}

cd ${DEPENDENCIES}

git clone git://github.com/rappid/rAppid.js.git
cd rAppid.js
git checkout dev

npm install --production

cd ${DEPENDENCIES}

git clone https://github.com/rappid/rappidjs-piwik.git

cd ${WORKSPACE}/public

ln -s ${DEPENDENCIES}/rAppid.js/js
ln -s ${DEPENDENCIES}/rappidjs-piwik/piwik

cd ${WORKSPACE}/server
ln -s ${DEPENDENCIES}/rAppid.js/js
ln -s ${DEPENDENCIES}/rAppid.js/srv
ln -s ../public/try

cd ${WORKSPACE}

sass --scss public/try/css/try.scss public/try/css/try.css

RAPPIDJS="${DEPENDENCIES}/rAppid.js/bin/rappidjs"
chmod +x ${RAPPIDJS}

VERSION="`$RAPPIDJS version`-$BUILD_NUMBER";
REPO=${REPOSITORY}/${VERSION};

echo "VERSION: $VERSION"

${RAPPIDJS} build --version ${VERSION}

cd public-build/
cp index.html ${VERSION}/

mkdir -p ${REPO};
tar -czf ${REPO}/client.tar.gz index.html ${VERSION}

rm -f ${REPOSITORY}/latest
ln -s ${REPO} ${REPOSITORY}/latest

cd ${WORKSPACE}
rm -rf tmp
mkdir tmp

cp -r -L server tmp
cp -r ${DEPENDENCIES}/rAppid.js tmp
cp -r public/ tmp/
cp index.js tmp
mv node_modules/ tmp/

cp public/config.json tmp/server/
cp package.json tmp
${RAPPIDJS} version --version ${VERSION} tmp/package.json

cd tmp/public
rm -f js
ln -s ../rAppid.js/js

cd ${WORKSPACE}/tmp/server
rm -rf js srv
ln -s ../rAppid.js/js
ln -s ../rAppid.js/srv

cd ${WORKSPACE}

tar -czf ${REPO}/server.tar.gz -C ${WORKSPACE}/tmp .


echo ${VERSION} > /local/version/try.rappidjs.com.version

if [ ${USER} == "jenkins" ]; then
    sudo /local/www/try.rappidjs.com/bin/update beta ${VERSION}
fi
