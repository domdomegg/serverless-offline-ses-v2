# serverless-offline-ses-v2

Serverless plugin to run [aws-ses-v2-local](https://github.com/domdomegg/aws-ses-v2-local)

Supports the AWS SES API v1 and v2, and Serverless Framework v2 and v3

## Install

```
npm install --save-dev serverless-offline-ses-v2
```

## Usage

### Serverless configuration

Add it to your list of plugins, and optinally custom config

serverless.yaml:

```yaml
plugins:
  - serverless-offline
  - serverless-offline-ses-v2

custom:
  serverless-offline-ses-v2:
    port: 8005
```

serverless.js / serverless.ts:

```ts
export default {
  plugins: [
    "serverless-offline",
    "serverless-offline-ses-v2",
  ],
  custom: {
    'serverless-offline-ses-v2': {
      port: 8005,
    }
  }
}
```

### Running serverless-offline

Use `serverless offline start` instead of `serverless offline`, if you aren't already. This is necessary for serverless-offline to fire off `init` and `end` lifecycle hooks so that we can start and stop the aws-ses-v2-local server correctly.
