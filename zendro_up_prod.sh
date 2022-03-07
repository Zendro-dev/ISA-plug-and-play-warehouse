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
docker-compose -f docker-compose-prod.yml \
  run --rm \
  -v $(pwd)/graphql-server/.env:/usr/graphql-server/.env \
  -v $(pwd)/graphiql-auth/.env.development:/usr/graphiql-auth/.env.development \
  -v $(pwd)/graphiql-auth/.env.production:/usr/graphiql-auth/.env.production \
  -v $(pwd)/single-page-app/.env.development:/usr/single-page-app/.env.development \
  -v $(pwd)/single-page-app/.env.production:/usr/single-page-app/.env.production \
  zendro_graphql_server node -e 'require("./utils/migration").up()'

# Stop the containers:
docker-compose -f docker-compose-prod.yml down

# The above migration changed the .env file to now contain information about
# the Keycloak OAuth2 service. We thus need to copy it into the graphql-server
# image:
docker build . \
  -f ./contexts/Dockerfile.graphql_server_with_env \
  -t isa-plug-and-play-warehouse_zendro_graphql_server:latest

# Start all Zendro services:
docker-compose -f docker-compose-prod.yml \
    up -d --build --force-recreate --remove-orphans

# Inform the user:
echo "Access Zendro's GUI at http://localhost:8080"
