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
  run zendro_graphql_server node -e 'require("./utils/migration").up()'

# Start all Zendro services:
docker-compose -f docker-compose-prod.yml \
    up -d --build --force-recreate --remove-orphans

# Inform the user:
echo "Access Zendro's GUI at http://localhost:8080"
