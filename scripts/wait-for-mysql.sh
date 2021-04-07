#!/bin/bash

set -eo pipefail

cmd="$@"

ready=false

master=mysql-master
slave=mysql-slave

host="$slave"
user="${MYSQL_USER:-user}"
password="${MYSQL_PASSWORD:-secret}"

replicaUser="${MYSQL_REPLICATION_USER:-replicator}"
replicaPassword="${MYSQL_REPLICATION_PASSWORD:-secret}"

rootPassword="${MYSQL_ROOT_PASSWORD:-secret}"

arguments=(
	--host=$host
	--user="$user"
	--password="$password"
	--silent
)

until [ "$ready" = true ]; do
  if command -v mysqladmin &> /dev/null; then
    echo "1"
    if mysqladmin "${arguments[@]}" ping > /dev/null; then
      echo "2"
      ready=true
    fi
  else
    if select="$(echo 'SELECT 1' | mysql "${arguments[@]}")" && [ "$select" = '1' ]; then
      echo "3"
      ready=true
    fi
  fi
  >&2 echo "Mysql is not ready - sleeping"
  sleep 1
done

check_slave_health () {
  echo Checking replication health:
  status=$(mysql --host="$host" --user=root --password="$rootPassword" -e "SHOW SLAVE STATUS\G")
  echo "$status" | egrep 'Slave_(IO|SQL)_Running:|Seconds_Behind_Master:|Last_.*_Error:' | grep -v "Error: $"
  if ! echo "$status" | grep -qs "Slave_IO_Running: Yes"    ||
     ! echo "$status" | grep -qs "Slave_SQL_Running: Yes"   ||
     ! echo "$status" | grep -qs "Seconds_Behind_Master: 0" ; then
	echo "WARNING: Replication is not healthy."
    return 1
  fi
  return 0
}

echo "Waiting for slave ready"
while ! check_slave_health; do
  sleep 1
done
echo "Slave is ready, safe to launch application."

>&2 echo "Mysql is up - executing command"
exec $cmd

# set -e

# cmd="$@"

# INITILIZED=/home/node/app/.mysql_initialized

# until [ ! -f "$INITILIZED" ]; do
#   >&2 echo "Mysql is unavailable - sleeping"
#   sleep 1
# done
