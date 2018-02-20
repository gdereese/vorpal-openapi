# vorpal-openapi

[![Build Status](https://travis-ci.org/gdereese/vorpal-openapi.svg?branch=master)](https://travis-ci.org/gdereese/vorpal-openapi)

[Vorpal](https://github.com/dthree/vorpal) extension that creates a CLI for invoking API endpoints defined with an OpenAPI/Swagger specification.

## Summary

vorpal-openapi provides simple access to the operations exposed in an HTTP API. It uses the [OpenAPI/Swagger specification](https://github.com/OAI/OpenAPI-Specification) document that describes the API to generate a CLI with easily discoverable and usable commands.

This utility can be invoked [from the command-line](README.md#Command-line) to build the CLI dynamically from any OpenAPI/Swagger spec document. Alternatively, this package can be consumed in another package [as a Vorpal extension](README.md#Vorpal-extension) to provide a CLI for a specific API.

## Features

* Generates a CLI from any OpenAPI/Swagger 2.0 specification file or URL
* Exposes each operation as a fully-documented command
  * Provides command options for setting each defined parameter
  * Enforces required parameters
  * Specify content type for request/response body
  * Optionally groups commands by tag or path
  * Help option for showing command usage
* Provides global commands for other functions
  * Display API information (version, contact info, terms of service)
  * Setting values for basic or header authorization (if required)

## Installation

### Install locally

```
npm install vorpal-openapi
```

### Install globally

```
npm install vorpal-openapi -g
```

## Usage

### Command-line

To initiate a CLI from the spec document of an API, just pass the path or URL to it on the command line:

```
vorpal-openapi path/to/spec
```

```
vorpal-openapi http://url/to/spec
```

### Vorpal extension

A CLI can also be created by utilizing the vorpal plugin provided in this package. You will need to construct the CLI options and load the spec file yourself, then pass them to extension.

This example demonstrates how to use [axios](https://github.com/axios/axios) to retrieve a Swagger spec by URL and construct a CLI:

```javascript
const axios = require('axios');
const vorpal = require('vorpal');

const VorpalOpenApiExtension = require('vorpal-openapi');

axios.get('http://url/to/swagger.json').then(function(response) {
  const options = {
    spec: response.data
  };

  vorpal()
    .use(VorpalOpenApiExtension, options)
    .show();
});
```

## Commands

### API Operations

Each API operation defined in the specification is given its own distinct command in the CLI. The `operationId` property value is used as the name of the command.

#### Operation Grouping

If the `operations.groupBy` option is set to something other than `none`, the operations are grouped as follows:

Example spec:

```javascript
{
  ...
  "paths": {
    "/widget": {
      "post": {
        "operationId": "addWidget",
        "tags": ["admin"]
        ...
      },
      "get": {
        "operationId": "getWidgets",
        "tags": ["reporting"]
        ...
      }
    },
    "/whizbang": {
      "update": {
        "operationId": "updateWhizbang",
        "tags": ["admin"]
      }
    }
  }
  ...
}
```

| `operations.groupBy` | Generated Commands                                                            |
| :------------------- | :---------------------------------------------------------------------------- |
| `none`               | `add-widget`<br />`get-widgets`<br />`update-whizbang`                        |
| `path`               | `widget add-widget`<br />`widget get-widgets`<br />`whizbang update-whizbang` |
| `tag`                | `admin add-widget`<br />`admin update-whizbang`<br />`widget get-widgets`     |

When operations are grouped, you can type `help <group-name>` to get a listing of all commands in that group.

#### Parameters

Each parameter defined in the operation's `parameters` object is mapped to an operation parameter in the CLI. They are handled as they are defined in the spec; parameters where `required = true` are required for the command to be executed, all others are optional.

If the operation has a body parameter, the `body` parameter on the command is used to set the body content.

#### Options

Each API operation command has the following options to configure additional aspects of the request made by the command:

| Option                    | Description                                                                                                                                                 |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--request-content-type`  | Indicates the content type of the request body. Available options are taken from those listed in the operation spec's `consumes` object.                    |
| `--response-content-type` | Indicates the desired content type of the response to be returned. Available options are taken from those listed in the operation spec's `produces` object. |

### Global Commands

The following commands are added to the CLI by default:

| Command     | Description                                                                                                                                                                                                                                                                                      |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `about`     | Displays information about the API. This command displays various bits from the `info` object of the spec to the user such as the `version`, `contact` and `termsOfService` properties.                                                                                                          |
| `authorize` | Sets the value(s) required to fulfill a given authorization scheme accepted/required by the API. An `authorize` sub-command is created for each scheme defined in the spec's `securityDefinitions` object. You can type `help authorize` at the CLI prompt to list the schemes available to use. |
| `exit`      | Exits the current CLI session and returns to the host command prompt.                                                                                                                                                                                                                            |
| `help`      | Lists each command available in the CLI with a brief description of each. The usage pattern, including required and optional parameters, is also specified for each command.                                                                                                                     |

## Options

When utilizing this package as a vorpal extension, an options object can be passed in the `vorpal.use()` function call for customizing the look and behavior of the generated CLI. The schemas for the options object is as follows:

### `options`

| Property     |   Type   | Description                                                                                                                     |
| :----------- | :------: | :------------------------------------------------------------------------------------------------------------------------------ |
| `operations` | `object` | Options for how operations defined in the OpenAPI/Swagger spec are handled. See [operations](README.md#operations) for details. |
| `spec`       | `object` | **(required)** OpenAPI/Swagger specification object.                                                                            |

### `operations`

| Property  |   Type   | Description                                                                                                                                                |
| :-------- | :------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `groupBy` | `string` | Indicates how operations defined in the spec will be grouped. `none` = no grouping, `path` = group by first path segment, `tag` = group by operation tags. |
