#!/bin/bash
123
set -e;
if [ -n "${POSTGRES_USER:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
	psql -v ON_ERROR_STOP=1 --username "$DB_USERNAME"  <<-EOSQL
		CREATE DATABASE ${POSTGRES_DB};
        GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};
    EOSQL
else
	echo "SETUP INFO: No Environment variables given!"
fi