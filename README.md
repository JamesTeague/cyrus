Cyrus
---
![GitHub package.json version](https://img.shields.io/github/package-json/v/JamesTeague/cyrus) ![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg) ![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) ![GitHub](https://img.shields.io/github/license/JamesTeague/typescript-template)

Pubsub library for Postgres.

### Install
```
npm install cyrus-rx
```

### Usage
#### Options
- appName (required): string
    - name of the application (used for logging)
- user (optional): string
    - option for Postgres Pool Connection
- password (optional): string
    - option for Postgres Pool Connection
- host (optional): string
    - option for Postgres Pool Connection
- port (optional): number
    - option for Postgres Pool Connection
- database (optional): string
    - option for Postgres Pool Connection


```javascript
import cyrus from 'cyrus-rx';

const notifier = cyrus({ appName: 'cyrus-example' });

// It needs to be connected before used
const connectedSuccessfully = await notifier.connect();

if (connectedSuccessfully) {
  // Create an observable to with a channel to listen to
  // Rx.Observable
  const observable$ = notifier.on('example-channel');

  // Sends this to postgres
  // The observable will emit this message.
  notifier.notify('example-channel', 'example-message');
}

// disconnect from the database by ending the pool
notifier.disconnect()
```
