#!/usr/bin/env bash

export PROTRACTOR_CONFIG_JS="protractorEE-env.config.js"
export NODE_ENV=inmemory
export TEST_PLATFORM="${TARGET_PLATFORM}"
#export CAT_LOGFILE="true"

echo "Running the E2E tests in a pod as user ${USERNAME} on console URL: ${TARGET_URL} with platform ${TEST_PLATFORM}"


cd ee_tests

/usr/bin/Xvfb :99 -screen 0 1024x768x24 &
export PATH=node_modules/protractor/bin:$PATH
npm install
webdriver-manager update --standalone true --versions.chrome 2.29

./local_run_EE_tests.sh  ${USERNAME} ${PASSWORD} ${TARGET_URL}

