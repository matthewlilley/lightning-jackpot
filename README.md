# Lightning Jackpot

Lightning Jackpot is a provably fair gaming platform.

Built with love by @MatthewLilley & @OlaStenberg

## Build

<!-- https://github.com/docker/compose/pull/6865 -->

## Production

docker pull node:lts-alpine

DOCKER_BUILDKIT=1 docker build --force-rm -t lightning-jackpot_app:production --build-arg APP_ENV=production . && \
docker-compose up -d --force-recreate --scale redis-sentinel=3 --scale redis-slave=3 --scale mysql-slave=3 && \
docker-compose logs -f --tail=50 app

## Development

DOCKER_BUILDKIT=1 docker build --force-rm -t lightning-jackpot_app:development --build-arg APP_ENV=development . && \
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate --scale redis-sentinel=1 \
--scale redis-slave=1 --scale mysql-slave=2 && docker-compose logs -f --tail=50 app

### Tunnel

sudo ssh -i ~/.ssh/id_rsa -L 443:localhost:443 root@R610

### Restart

docker-compose restart app && docker-compose logs -f --tail=50 app

### Shell access

docker-compose exec app sh

## Lets Encrypt

bash -i scripts/letsencrypt.sh

## Permissions

App:

chown -R 1000:1000 /root/lightning-jackpot

Bitnami:

chown -R 1001:0 storage/bitnami

Cloudflare:

chmod 600 storage/cloudflare.ini

Google Cloud:

chmod 600 storage/lightning-jackpot-ef531a8d2f7a.json

LND:

chmod 600 storage/tls.cert
chmod 600 storage/admin.macaroon

### Individually bring up services attached (useful for debugging)

docker-compose up --scale redis-sentinel=3 --scale redis-slave=3 redis-sentinel redis-master redis-slave

docker-compose up --scale mysql-slave=3 mysql-master mysql-slave

### SSL

Generate ssh key for local development (you can add this to windows as a trusted root CA for HTTPS in development)

https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/

https://success.outsystems.com/Support/Enterprise_Customers/Installation/Install_a_trusted_root_CA__or_self-signed_certificate

openssl req -x509 -out ./storage/certbot/conf/live/lightningjackpot.com/fullchain.pem \
 -keyout ./storage/certbot/conf/live/lightningjackpot.com/privkey.pem \
 -newkey rsa:2048 -nodes -sha256 \
 -subj '/CN=localhost' -extensions EXT -config <( \
 printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

### Seeds

docker-compose exec app npm run seed

#### Individual

docker-compose exec app npm run seed --run CreateGames

docker-compose exec app npm run seed --run CreateJackpots

docker-compose exec app npm run seed --run CreateInstances

docker-compose exec app npm run seed --run CreateUsers

etc...

#### Linting

npm run lint:frontend

npm run lint:backend

#### Tests

npm test (runs all below)

npm run test

npm run test:integration

npm run test:e2e

#### Validation

https://github.com/typestack/class-validator#validation-decorators

## Packages Open Sourced

- Discord Emoji Button (Published)
- Lightning RPC (Published)
- Provably Fair (Unpublished - Almost Ready)
- React Wheel (Unpublished - Almost Ready)
