# Use example env-files:
cp graphiql-auth/.env.development.example graphiql-auth/.env.development
cp graphiql-auth/.env.production.example graphiql-auth/.env.production
cp graphql-server/.env.example graphql-server/.env
cp single-page-app/.env.development.example single-page-app/.env.development
cp single-page-app/.env.production.example single-page-app/.env.production

# create a volume for the environment files
docker run -d -it --rm --name copycat -v env-files:/opt/env-files node:14-stretch-slim

docker cp $(pwd)/graphql-server/.env copycat:/opt/env-files/.env.graphql
docker cp $(pwd)/graphiql-auth/.env.development copycat:/opt/env-files/.env.development.graphiql
docker cp $(pwd)/graphiql-auth/.env.production copycat:/opt/env-files/.env.production.graphiql
docker cp $(pwd)/single-page-app/.env.development copycat:/opt/env-files/.env.development.spa
docker cp $(pwd)/single-page-app/.env.production copycat:/opt/env-files/.env.production.spa

docker stop copycat



# -v $(pwd)/graphql-server/.env:/opt/env-files/.env \
#   -v $(pwd)/graphiql-auth/.env.development:/opt/env-files/.env.development.spa \
#   -v $(pwd)/graphiql-auth/.env.production:/opt/env-files/.env.production.spa \
#   -v $(pwd)/single-page-app/.env.development:/opt/env-files/.env.development.spa \
#   -v $(pwd)/single-page-app/.env.production:/opt/env-files/.env.production.spa \


# Create images required to run the migration:
docker-compose -f docker-compose-prod.yml \
    up --no-start --force-recreate --remove-orphans \
    --build zendro_graphql_server

# Run the migration, which sets up keycloak for your system:
# docker-compose -f docker-compose-prod.yml \
#   run --rm \
#   -v $(pwd)/graphql-server/.env:/usr/graphql-server/.env \
#   -v $(pwd)/graphiql-auth/.env.development:/usr/graphiql-auth/.env.development \
#   -v $(pwd)/graphiql-auth/.env.production:/usr/graphiql-auth/.env.production \
#   -v $(pwd)/single-page-app/.env.development:/usr/single-page-app/.env.development \
#   -v $(pwd)/single-page-app/.env.production:/usr/single-page-app/.env.production \
#   zendro_graphql_server node -e 'require("./utils/migration").up()'
docker-compose -f docker-compose-prod.yml \
  run --rm zendro_graphql_server node -e 'require("./utils/migration").up()'

# Stop the containers:
docker-compose -f docker-compose-prod.yml down

# The above migration changed the .env file to now contain information about
# the Keycloak OAuth2 service. We thus need to copy it into the graphql-server
# image:
# docker build . \
#   -f ./contexts/Dockerfile.graphql_server_with_env \
#   -t isa-plug-and-play-warehouse_zendro_graphql_server:latest

# Start all Zendro services:
docker-compose -f docker-compose-prod.yml \
    up -d --remove-orphans

# Inform the user:
echo "Access Zendro's GUI at http://localhost:8080"
