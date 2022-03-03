# To Do rename env-files

docker-compose -f docker-compose-prod.yml \
    up --no-start --force-recreate --remove-orphans \
    --build zendro_graphql_server
    

docker-compose -f docker-compose-prod.yml \
  run zendro_graphql_server node -e 'require("./utils/migration").up()'

docker-compose -f docker-compose-prod.yml \
    up -d --build --force-recreate --remove-orphans
