# Use example env-files:
cp graphiql-auth/.env.development.example graphiql-auth/.env.development
cp graphiql-auth/.env.production.example graphiql-auth/.env.production
cp graphql-server/.env.example graphql-server/.env
cp single-page-app/.env.development.example single-page-app/.env.development
cp single-page-app/.env.production.example single-page-app/.env.production

# Create images required to run the migration:
docker-compose -f docker-compose-prod.yml \
    up --no-start --force-recreate --remove-orphans \
    --build zendro_graphql_server

# Run the migration, which sets up keycloak for your system:
# TODO:
# - add a --rm to the below run
# - remove the volume statements from docker-compose-prod.yml
# - use mount here for all env files
# - after the command finishes: docker cp ./graphql-server/.env to /usr/graphql-server/.env
docker-compose -f docker-compose-prod.yml \
  run --rm zendro_graphql_server \
  -v ./graphql-server/.env:/usr/graphql-server/.env \
  -v ./graphiql-auth/.env.development:/usr/graphiql-auth/.env.development \
  -v ./graphiql-auth/.env.production:/usr/graphiql-auth/.env.production \
  -v ./single-page-app/.env.development:/usr/single-page-app/.env.development \
  -v ./single-page-app/.env.production:/usr/single-page-app/.env.production \
  node -e 'require("./utils/migration").up()'

# The above migration changed the .env file to now contain information about
# the Keycloak OAuth2 service. We thus need to copy it into the graphql-server
# image:
docker cp ./graphql-server/.env zendro_graphql_server:/usr/graphql-server/.env

# Start all Zendro services:
docker-compose -f docker-compose-prod.yml \
    up -d --build --force-recreate --remove-orphans

# Inform the user:
echo "Access Zendro's GUI at http://localhost:8080"
