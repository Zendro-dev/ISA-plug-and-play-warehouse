# create a volume for the environment files
docker run -d -it --rm --name copycat -v zendro_context:/opt/zendro_context node:14-stretch-slim

docker cp $(pwd)/zendro_context/env copycat:/opt/zendro_context
docker cp $(pwd)/zendro_context/migration_state copycat:/opt/zendro_context

docker stop copycat

echo "==== Created zendro_context docker volume ===="

# Create images required to run the migration:
docker-compose -f docker-compose-prod.yml \
    up --no-start --force-recreate --remove-orphans \
    --build zendro_graphql_server

echo "==== Build zendro_graphql_server image ===="

# Run the migration, which sets up keycloak for your system and copy the migration state to zendro_context volumne:
docker-compose -f docker-compose-prod.yml \
  run --rm zendro_graphql_server bash -c \
  'node -e "require(\"./utils/migration\").up()" && cp zendro_migration* ../zendro_context/migration_state'

echo "==== Ran zendro migration and copied migration log files to zendro_context volume ===="

# Start all Zendro services:
docker-compose -f docker-compose-prod.yml \
    up -d --remove-orphans

# Inform the user:
echo "==== Access Zendro's GUI at http://localhost:8080 ===="
