#!/bin/sh

if [[ "$NODE_ENV" == "production" ]]; then
    echo "RUN PRODUCTION"
    npm run start
else
    echo "RUN DEVELOPMENT"
    /home/node/app/node_modules/.bin/tsc-watch -p /home/node/app/src/backend/tsconfig.json --onFirstSuccess "/home/node/app/node_modules/.bin/pm2-runtime --raw pm2-dev.yml" --onSuccess "echo Recompiled backend"
fi
