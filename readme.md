Intro
=====

The app is written in Svelte, a UI framework that compiles the markup, code, and style into a single JavaScript file.  This can then be served from a static HTTP server.

After cloning this repo, `cd` to it and install the dependencies:

```
npm i
```

Development
===========

/dev contains a basic Express application that renders the app (the frontend component) using svelte-view-engine.  svelte-view-engine provides auto-rebuilding and live reloads.  This is a separate server from the API, and is not required in production.

Starting the dev server:

```
cd dev
pm2 start pm2.config.js
```

Once the server is running, go to http://localhost:3110.  You can now change the code, and the page will reload automatically.  Note that you must still run the build script to update the production version before deploying it.

Building
========

To build the app:

```
./scripts/build.js
```

This writes the transpiled and minified component to static/js/App.js.

Deployment
==========

Run the API:

```
pm2 start pm2.config.js
```

Serve /static using any web server:

```
cd static
python -mSimpleHTTPServer
```
