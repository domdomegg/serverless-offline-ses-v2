import server, { Config } from 'aws-ses-v2-local';
import type Serverless from 'serverless';
import type { Server } from 'http';

class ServerlessOfflineSesV2Plugin {
  readonly hooks: Record<string, () => Promise<unknown>>;

  private readonly config: Config;

  private readonly servers: Server[] = [];

  constructor(private serverless: Serverless) {
    this.config = this.serverless.service?.custom?.['serverless-offline-ses-v2'] ?? {};

    this.hooks = {
      'before:offline:start:init': this.start,
      'before:offline:start:end': this.stop,
    };

    return this;
  }

  private start = async () => {
    const s = await server(this.config);
    this.servers.push(s);
    let address = s.address();
    if (address === null) {
      address = 'unknown';
    } else if (typeof address !== 'string') {
      if (address.address === '127.0.0.1' || address.address === '::') {
        address = `http://localhost:${address.port}`;
      } else if (address.family === 'IPv4') {
        address = `http://${address.address}:${address.port}`;
      } else if (address.family === 'IPv6') {
        address = `http://[${address.address}]:${address.port}`;
      } else {
        address = `${address.address}:${address.port}`;
      }
    }

    this.serverless.cli.log(`serverless-offline-ses-v2: listening on ${address}`);
  }

  private stop = async () => {
    await Promise.allSettled(this.servers.map((s) => new Promise<void>((resolve, reject) => s.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }))));

    this.serverless.cli.log('serverless-offline-ses-v2: stopped');
  }
}

// NB: export default (as opposed to export =) does not work here with Serverless
export = ServerlessOfflineSesV2Plugin;
