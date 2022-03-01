# ISA Plug & Play Zendro Data Warehouse

The [ISA Model](https://isa-tools.org/format/specification.html) provides a flexible standard for scientific research data. As it is based on the scientific method, it is very versatile and can be applied to almost any research project. The ongoing [reproducibility crisis](https://en.wikipedia.org/wiki/Replication_crisis) has long been recognized and one of the major causes is missing meta-data for published scientific results. This is where the ISA Model can help scientists to fill the gap. 

While research projects are typically well equipped to carry out the research, modern studies often integrate and produce highly diverse and voluminous data, both in terms of type and format as well as size. To manage such data in an adequate manner and ensure availability of scientific results, a fully featured data-warehouse is required. Ideally, such a resource should have both a graphical, point and click, user interface (GUI) as well as an application programming interface (API). The former allows scientists to manage and explore data, while the latter enables data analysts to perform exhaustive data searches and directly include data in analysis scripts without the need to download large data files. 
Furthermore, modern data-warehouses should offer the means to make hosted data Findable, Accessible, Interoperable, and Reusable (FAIR). These requirements imply that data-warehouses should no longer be a simple file-server on the web, with short readme files explaining how data was produced. Rather, a modern data-warehouse would benefit from embedding a suitable domain metadata model to ensure that both data and metadata are tracked at the same time. 
Hence, the idea to develop a Zendro Database which would take advantage of the ISA Model and offer the service to the community.
This is all the more important as resources, in terms of work time, experts, and funding, for developing such a software tools are often hard to come by. By working with with ISA, Zendro filled a capability gap in the ISA ecosystem and our teams now present a *ready to use, no programming required plug&play ISA Model data warehouse*.

This repository holds a `Plug & Play` [Zendro](https://zendro-dev.github.io/) instance created for the latest [ISA data model definitions](https://github.com/ISA-tools/isa-api/tree/develop/isatools/resources/schemas/isa_model_version_1_0_schemas/core). It is also customized to enable:
* file attachments via a [MinIO](https://min.io/) fileserver 
* as well as special handling of images through an [imgproxy](https://github.com/imgproxy/imgproxy) server. 

>This therefore enables the user to both *administer scientific meta-data* and *host the research result data itself* **in the same warehouse**.

## Prerequisites

The plug&play ISA Model warehouse based on Zendro uses Docker. Please make sure the following requirements are met:

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/)

## Set up

Download or clone the repository.

```bash=
git clone https://github.com/Zendro-dev/ISA-plug-and-play-warehouse
```

## Configuration

Configuration can be done via the `.env` files, which can be found in each of the separate sub-repositories (`graphql-server`, `single-page-app` and `graphiql-auth`).

There are `.env.example` files included that can be used by simply removing the `.example` extension. They should work out of the box as is.

```bash=
cd graphql-server
mv .env.example .env
```

```bash=
cd single-page-app # perform similarly from graphiql-auth directory
mv .env.production.example .env.production
mv .env.development.example .env.development
```



### Database configuration (advanced)

Currently a default PostgreSQL database is used.
Support exists for a great variety of storage technologies.
In case you want Zendro to talk to databases other than the default (PostgreSQL), that can be configured in `config/data_models_storage_config.json`.
See [the Zendro manual](https://zendro-dev.github.io/) for more details.

## Start up

Build and start the docker containers via:

```bash
docker-compose -f docker-compose-prod.yml up -d --force-recreate --remove-orphans 
```
This will fetch all the necessary docker images, install them, and then start-up the containers.
The containers will be available at:

| service|location |
|:---|:---|
|keycloak|http://10.5.0.11:8081|
|graphql-server|http://localhost:3000/graphql|
|graphiql|http://localhost:7000|
|single-page-app|http://localhost:8080|
|minio|http://localhost:9000|
|imgproxy |http://localhost:8082|


## Shut down

Stop the docker containers via this docker command
```bash
docker-compose -f docker-compose-prod.yml down
```

In case you want to also delete the local docker volumes with your data, run the following command
```bash
docker-compose -f docker-compose-prod.yml down -v
```

## Creating the Minio Buckets

By default, this setup uses 2 separate MinIO `buckets` (which are something like directories in which the respective files are stored) to hold images in one bucket, and data files in the other one.
The names of the buckets can be controlled via `environment variables`.
The currently defaults are:
```
IMG_BUCKET_NAME = "images";
FILES_BUCKET_NAME = "files";
```

Those need to be created manually in the `MinIO admin interface` at

```
http://localhost:9000
```

You can login to the minio client via:

```
username: minio
password: miniominio
```

_**Note:**_ This step can probably be automated in the future.

## Keycloak admin console (advanced)

In case keycloak needs manual configuration tweaks (like adding different identity providers) , the `keycloak admin console` is reachable at:
```
http://10.5.0.11:8081
```
You can login via:
```
username: admin
password: admin
```

## Access the graphql server from the console

To access the graphql-server from the console, e.g. via `curl` or `wget` commands simply
```
curl http://localhost:3000/help
```
To get information on how to get an access_token and how to use it to access the server with simple http requests via `curl`. This is of course directly applicable to any other script like e.g `python`, `ruby`, `perl`, `R`, etc.

## Plots
In the Sandbox, an example of how to supply a simple plot to the single-page-app (SPA). To make the plot work, a table is included in the repository in `data`, that can be added as a `data` record for example through the single-page-app interface.
- Click on data at the left hand menu
- Add new record by clicking the `+` icon
- Add the record and attach the file `data/20220127_Analysis_Tomato_both_cpm_merged.csv`

After adding the records, clicking on the `Plots` Menu in the Topbar should render a bar plot of Gene-expression counts for a specific Tomato genes under different conditions.

The data used is published and accessible at

>Reimer JJ, Thiele B, Biermann RT, Junker-Frohn LV, Wiese-Klinkenberg A, Usadel B, et al. Tomato leaves under stress: a comparison of stress response to mild abiotic stress between a cultivated and a wild tomato species. Plant Mol Biol. 2021;107: 177–206.
>[doi:10.1007/s11103-021-01194-0](https://doi.org/10.1007/s11103-021-01194-0)

## Manual customization
Each sub-repository is fully customizable by simply changing the code and restarting the services with docker-compose.

See also documentation on how to customize the single-page-app [here](https://github.com/Zendro-dev/single-page-app#customization) and for more detailed documentation on nextjs [here](https://nextjs.org/docs/getting-started).
