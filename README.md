# G&V Clean Break Scheduler (gv-scheduler)

Client management and scheduling software for internal use by G&V Clean Break LLC. Also serves as submission for Oregon Tech's software senior project.

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Run the json database for client storage
```bash
npm install -g json-server
json-server --watch data/db.json
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
