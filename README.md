# ISA Plug & Play Zendro Data Warehouse

The ISA Model provides a flexible standard for scientific research data. As it is based on the scientific method it is very versatile and can be applied to almost any research project. The ongoing [reprodicibility crisis](https://en.wikipedia.org/wiki/Replication_crisis) has long been recognized and one of the mayor causes is missing meta-data for published scientific results. This is where the ISA Model shines and helps scientists to fill the gap. 

While research projects are typically well equipped to carry out the research modern studies often integrate and produce highly diverse and voluminous data, both in terms of type and format as well as size. To administer this data in an adecuate way and ensure scientific results are reproducible, a fully featured data-warehouse is required. Ideally such a warehouse has both a graphical, point and click, user interface (GUI) as well as a application programming interface (API). The former allows scientists to administer the data and also explore it, while the latter enables data analysts to perform exhaustive data searches and directly include data in anaylis scripts without the need to download large data files. Additionally, data-warehouses need to offer access functions that make the stored data findable, accessible, interoperable, and reusable (FAIR). These requirements imply that a data-warehouse no longer is a simple file-server in the web with short readme files explainng the data and how it was produced. Rather, programming a data-warehouse, especially when adhering to standards like the ISA Model becomes a suizable software development job itself. Resources, in terms of work time, experts, and funding, for such a task a often hard to come by. To fill this gap we present a ready to use, no programming required plug&play ISA Model data warehouse.

This repository holds a Plug & Play [Zendro](https://zendro-dev.github.io/) instance created for the latest [ISA](https://isa-specs.readthedocs.io/en/latest/isamodel.html) data model definitions. It is also customized to enable file attachments via a [minio](https://min.io/) fileserver as well as special handling of images through an [imgproxy](https://github.com/imgproxy/imgproxy) server. This particulary enables the user not only to administer scientific meta-data, but also host the research result data itself in the same warehouse.

## Prerequisites

The plug&play ISA Model warehouse based on Zendro uses Docker. Please make sure, the following requirements are met:

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/)

## Set up

Download or clone the repository.

```
git clone https://github.com/Zendro-dev/ISA-plug-and-play-warehouse
```

## Configuration

Configuration can be done via the `.env` files in the separate sub-repositories (`graphql-server`, `single-page-app` and `graphiql-auth`).

There are `.env.example` files included that can be used by simply removing the `.example` extension. They should work out of the box as is.

### Database configuration (Advanced)

In case you want Zendro to talk to other databases that can be configured in `config/data_models_storage_config.json`. Currently a default PostgreSQL database is used. Support exists for a great variety of storage technologies. See [the Zendro manual](https://zendro-dev.github.io/) for more details.

## Start up

Build and start the docker containers via:

```
docker-compose -f docker-compose-prod.yml up -d --force-recreate --remove-orphans 

```
This will fetch all the necessary docker images and install them as well as starting up the containers. The containers will be avaialable at:

```
graphql-server: http://localhost:3000/graphql
graphiql: http://localhost:7070
single-page-app: http://localhost:8080
keycloak: http://10.5.0.11:8081
minio: http://localhost:9000
imgproxy: http://localhost:8082
```

## Shut down
Stop the docker containers via
```
docker-compose -f docker-compose-prod.yml down
```
In case you want to also delete the local docker volumes with your data run
```
docker-compose -f docker-compose-prod.yml down -v
```

## Creating the Minio Buckets

By default this setup uses 2 separate minio buckets (something like directories in which the respective files are stored) to hold image and other data. The names of the buckets can be controlled via environment variables. The defaults are:
```
IMG_BUCKET_NAME = "images";
FILES_BUCKET_NAME = "files";
```

Those need to be created manually in the minio admin surface at

```
http://localhost:9000
```

You can login to the minio client via:

```
username: minio
password: miniominio
```

_**Note:**_ This step can probably be automated in the future.

## Keycloak admin console (Advanced)

In case there is some manual configuration needed (like adding different identity providers) for keycloak, the admin console is reachable at:
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
to get information on how to get an access_token and how to use it to access the server with simple http requests via `curl`. This is of course directly applicable to any other script like e.g `python`, `ruby`, `perl`, `R`, etc.

## Plots
In the Sandbox an example of how to supply a simple plot to the SPA. To make the plot work a table is include in the repository in `data`, that can be added as a `data` record for example through the single-page-app interface.
- click on data at the left hand menu
- Add new record by clicking the `+` icon
- Add the record and attach the file `data/20220127_Analysis_Tomato_both_cpm_merged.csv`

After adding the record clicking on the `Plots` Menu in the Topbar should render a bar plot of Gene-expression counts for a specific Tomato genes under different conditions.

The data used is published and accessible at
```
Reimer JJ, Thiele B, Biermann RT, Junker-Frohn LV, Wiese-Klinkenberg A, Usadel B, et al. Tomato leaves under stress: a comparison of stress response to mild abiotic stress between a cultivated and a wild tomato species. Plant Mol Biol. 2021;107: 177–206.
```
## Manual customization
Every sub-repoistory is fully customizable by simply changing the code and restarting the docker-compose.

See also documentation on how to customize the single-page-app [here](https://github.com/Zendro-dev/single-page-app#customization) and for more detailed documentation on nextjs [here](https://nextjs.org/docs/getting-started).
