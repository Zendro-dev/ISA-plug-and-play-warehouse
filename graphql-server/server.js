var express = require("express");
var path = require("path");
var graphqlHTTP = require("express-graphql");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const globals = require("./config/globals");
const execute = require("./utils/custom-graphql-execute");
const getRoles = require("./utils/roles");
const helper = require("./utils/helper");
const nodejq = require("node-jq");
const { JSONPath } = require("jsonpath-plus");
const errors = require("./utils/errors");
const { formatError, graphql } = require("graphql");
const models = require("./models/index.js");
const adapters = require("./models/adapters/index.js");
const { initializeStorageHandlers } = require("./utils/helper.js");

var acl = null;
let resolvers = require("./resolvers/index");
let simpleExport = require("./utils/simple-export");

var cors = require("cors");

const { graphqlUploadExpress } = require('graphql-upload');

const helpObj = {
  oauth2_service_url: globals.OAUTH2_TOKEN_URI,
  client_id: "zendro_graphql-server",
  grant_type: "password",
  authenticate_curl_template: `curl -X POST --url ${globals.OAUTH2_TOKEN_URI} -d 'Content-Type: application/x-www-form-urlencoded' -d grant_type=password -d client_id=zendro_graphql-server -d username=<username> -d password=<password>`,
  execute_graphql_query_curl_template: `curl --url <graphql-server>/graphql -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <access_token>' -d '{"query": "{ ...<your query> }" }'`,
  execute_meta_query_curl_template: `curl --url <graphql-server>/graphql -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <access_token>' -H 'jq: <expr>' -d '{"query": "{ ... <your query>}" }'`,
  info: "1. authenticate with OAuth using e.g authenticate_curl_template to get an access_token, 2. query away including the access tokens in the request header. - Note the curl examples can be translated to any programming language. Just send the respective HTTP Requests.",
};

/* Server */
const APP_PORT = globals.PORT;
const app = express();

app.use((req, res, next) => {
  // Website you wish to allow to connect
  if (globals.REQUIRE_SIGN_IN) {
    res.setHeader("Access-Control-Allow-Origin", globals.ALLOW_ORIGIN);
  }
  next();
});

/* Temporary solution:  acl rules set */
if (process.argv.length > 2 && process.argv[2] == "acl") {
  let node_acl = require("acl");
  let { aclRules } = require("./acl_rules");
  acl = new node_acl(new node_acl.memoryBackend());

  /* set authorization rules from file acl_rules.js */
  acl.allow(aclRules);
  console.log("Authorization rules set!");
} else {
  console.log(
    "Server started without Authorization-Check. Start with command " +
      "line argument 'acl', if Rule Based Authorization is wanted."
  );
}

/* Schema */
console.log("Merging Schema");
let Schema = helper.mergeSchemaSetScalarTypes(
  path.join(__dirname, "./schemas")
);

/* Parse urlencoded bodies and JSON by bodyParser middlewares*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: globals.POST_REQUEST_MAX_BODY_SIZE }));

app.use(express.json());
app.post("/getRolesForOAuth2Token", (req, res) => {
  const token = req.body.token;
  const roles = getRoles(token);
  res.json({ token: token, roles: roles });
}),
  app.get("/help", (req, res) => {
    res.json(helpObj);
  });

app.use("/export", cors(), async (req, res) => {
  //set checker for using in the local method simpleExport
  res["responseSent"] = false;

  //set MAX_TIME_OUT
  res.setTimeout(globals.EXPORT_TIME_OUT * 1000, function () {
    res.end("TIMEOUT EXCEEDS");
  });

  res.on("finish", () => {
    res["responseSent"] = true;
  });

  let context = {
    request: req,
    acl: acl,
    benignErrors: [],
    recordsLimit: globals.LIMIT_RECORDS,
  };

  let body_info = req.query;

  try {
    await simpleExport(context, body_info, res);
    res.end();
  } catch (err) {
    if (!res.responseSent) {
      res.status(500).send(err);
    } else {
      console.error("ERROR IN EXPORT AFTER SENDING THE RESPONSE: " + err);
    }
  }
});

// app.use(fileUpload());
/*request is passed as context by default  */
app.use(
  "/graphql",
  cors(),
  graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  graphqlHTTP((req) => ({
    schema: Schema,
    rootValue: resolvers,
    pretty: true,
    graphiql: true,
    context: {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: globals.LIMIT_RECORDS,
    },
    customExecuteFn: execute.execute,
    customFormatErrorFn: function (error) {
      errors.customErrorLog(error); // Will log the error either compact (defualt) or verbose dependent on the env variable "ERROR_LOG"
      let extensions = errors.formatGraphQLErrorExtensions(error);
      return {
        message: error.message,
        locations: error.locations ? error.locations : "",
        // Either use the extensions of a remote error, or
        // the local originalError.errors generated by for example validation Errors (AJV):
        extensions: extensions,
        path: error.path,
      };
    },
  }))
);

let metaQueryCorsOptions = {
  allowedHeaders: ["Content-Type", "Authorization", "jq", "jsonPath"],
};
app.options("/meta_query", cors(metaQueryCorsOptions));
app.post("/meta_query", cors(), async (req, res, next) => {
  try {
    let context = {
      request: req,
      acl: acl,
      benignErrors: [],
      recordsLimit: globals.LIMIT_RECORDS,
    };

    if (req != null) {
      const query = req.body.query;
      const jq = req.headers.jq;
      const jsonPath = req.headers.jsonpath;
      const variables = req.body.variables;

      helper.eitherJqOrJsonpath(jq, jsonPath);

      const graphQlResponse = await graphql(
        Schema,
        query,
        resolvers,
        context,
        variables
      );

      let output = graphQlResponse.data;
      const resolversHaveData = output
        ? Object.values(output).some((val) => val)
        : null;

      if (resolversHaveData) {
        if (helper.isNotUndefinedAndNotNull(jq)) {
          // jq
          output = await nodejq.run(jq, graphQlResponse.data, {
            input: "json",
            output: "json",
          });
        } else {
          // JSONPath
          output = JSONPath({
            path: jsonPath,
            json: graphQlResponse.data,
            wrap: false,
          });
        }
      }

      res.json({ data: output, errors: graphQlResponse.errors });

      next();
    }
  } catch (error) {
    res.json({ data: null, errors: [formatError(error)] });
  }
});
/**
 * uncaughtException handler needed to prevent node from crashing upon receiving a malformed jq filter.
 */
process.on("uncaughtException", (err) => {
  console.log("!!uncaughtException:", err);
});

// Error handling
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // Send the error rather than to show it on the console
    res.status(401).send(err);
  } else {
    next(err);
  }
});

var server = app.listen(APP_PORT, async () => {
  await initializeStorageHandlers(models);
  await initializeStorageHandlers(adapters, "adapter");
  console.log(`App listening on port ${APP_PORT}`);
});

module.exports = server;
