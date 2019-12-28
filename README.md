Cyrus
---
![GitHub package.json version](https://img.shields.io/github/package-json/v/JamesTeague/typescript-template) ![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg) ![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) ![GitHub](https://img.shields.io/github/license/JamesTeague/typescript-template)

Pubsub library for Postgres.

### Install
```
npm install @penguinhouse/cyrus
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
import cyrus from '@penguinhouse/cyrus';

const notifier = cyrus({ appName: 'cyrus-example' });

// Create an observable to with a channel to listen to
const observable = notifier.on('example-channel'); // Rx.Observable

notifier.notify('example-channel', 'example-message'); // Sends this to postgres
// The message will show up in the observable. 

```
