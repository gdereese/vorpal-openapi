# vorpal-openapi

[![Build Status](https://travis-ci.org/gdereese/vorpal-openapi.svg?branch=master)](https://travis-ci.org/gdereese/vorpal-openapi)
[![SonarCloud Quality](https://sonarcloud.io/api/project_badges/measure?project=abogado&metric=alert_status)](https://sonarcloud.io/dashboard?id=abogado)
[![npm version](https://badge.fury.io/js/vorpal-openapi.svg)](https://badge.fury.io/js/vorpal-openapi)

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

## Compatibility

This package has been tested on the following versions of Node.js:

* 6.x
* 8.x
* 9.x

## Installatio using NPM

### Install as a local dependency

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

You can also run in non-interactive mode by passing a known command and parameters after the spec path/URL:

```
vorpal-openapi path/or/url pet get-pet-by-id 1
```

If you invoke a command in this way, the CLI will return the command results then exit.

### Vorpal extension

A CLI can also be created by utilizing the vorpal plugin provided in this package. You will need to construct the CLI options and load the spec file yourself, then pass them to extension.

This example demonstrates how to use [axios](https://github.com/axios/axios) to retrieve a Swagger spec by URL and construct a CLI:

```javascript
const axios = require(('axios'););
const vorpal = require(('vorpal'););

const VorpalOpenApiExtension = require(('vorpal-openapi'););

axios.get('http://url/to/swagger.json').then(function(response) {
  const options = {
    spec: response.data
  };

  vorpal()
    .use(VorpalOpenApiExtension, options)
    .show();
});
```

## Further Reading

* [API Operations](https://github.com/gdereese/vorpal-openapi/wiki/API-Operations)
* [Global Commands](https://github.com/gdereese/vorpal-openapi/wiki/Global-Commands)
* [Extension Options](https://github.com/gdereese/vorpal-openapi/wiki/Extension-Options)
