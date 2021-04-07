echo "Setting root ownership"

# chown -R 1000:1000 $PWD

echo "Setting bitnami storage ownership"

chown -R 1001:0 $PWD/storage/bitnami

echo "Setting cloudflare credentials permissions"

chmod 600 $PWD/storage/cloudflare.ini

echo "Setting google cloud credentials permissions"

chmod 600 $PWD/storage/lightning-jackpot-ef531a8d2f7a.json

echo "Setting lnd credentials permissions"

chmod 600 $PWD/storage/tls.cert
chmod 600 $PWD/storage/admin.macaroon

echo "Generate CA"

# MASTER_IP=localhost

# openssl genrsa -out $PWD/storage/shared/ca.key 2048

# openssl req -x509 -new -nodes -key $PWD/storage/shared/ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out $PWD/storage/shared/ca.crt

# openssl genrsa -out $PWD/storage/shared/server.key 2048

# openssl req -new -key $PWD/storage/shared/server.key -out $PWD/storage/shared/server.csr -config $PWD/storage/shared/csr.conf

# openssl x509 -req -in $PWD/storage/shared/server.csr -CA $PWD/storage/shared/ca.crt -CAkey $PWD/storage/shared/ca.key \
# -CAcreateserial -out $PWD/storage/shared/server.crt -days 10000 \
# -extensions v3_ext -extfile $PWD/storage/shared/csr.conf

# openssl x509  -noout -text -in $PWD/storage/shared/server.crt
