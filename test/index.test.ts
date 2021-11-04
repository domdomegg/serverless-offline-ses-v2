import server from 'aws-ses-v2-local';
import type { Server } from 'http';
import type Serverless from 'serverless';
import Plugin from '../src/index';

jest.mock('aws-ses-v2-local');

const mockServer = server as jest.MockedFunction<typeof server>;

test('serverless-offline-ses-v2', async () => {
  // given... a configuration and a mock of aws-ses-v2-local
  const serverlessMock = {
    service: {
      custom: {
        'serverless-offline-ses-v2': {
          port: 1111,
        },
        'some-other-plugin-that-should-not-interfere': {
          port: 2222,
        },
      },
    },
    cli: {
      log: jest.fn(),
    },
  } as unknown as Serverless;
  let s: Server | undefined;
  mockServer.mockImplementation((config) => {
    s = {
      address: jest.fn().mockReturnValue({ port: config?.port ?? '8000', family: 'IPv4', address: '127.0.0.1' }),
      close: jest.fn().mockImplementation((cb) => cb()),
    } as unknown as Server;
    return s;
  });

  // when... we create a plugin
  const plugin = new Plugin(serverlessMock);

  // then... we provide init and end hooks
  expect(plugin.hooks).toHaveProperty('before:offline:start:init', expect.any(Function));
  expect(plugin.hooks).toHaveProperty('before:offline:start:end', expect.any(Function));
  expect(server).not.toHaveBeenCalled();

  // when... we call the init hook
  await plugin.hooks['before:offline:start:init']();

  // then... we have a server set up with our config, it is not closed, and we correctly log the address
  expect(server).toHaveBeenCalledTimes(1);
  expect(server).toHaveBeenCalledWith(serverlessMock.service.custom['serverless-offline-ses-v2']);
  expect(s?.close).not.toHaveBeenCalled();
  expect(serverlessMock.cli.log).toHaveBeenCalledWith('serverless-offline-ses-v2: listening on http://localhost:1111');

  // when... we call the end hook
  await plugin.hooks['before:offline:start:end']();

  // then... the server is closed, and we have correct logging
  expect(s?.close).toHaveBeenCalledTimes(1);
  expect(serverlessMock.cli.log).toHaveBeenCalledWith('serverless-offline-ses-v2: stopped');
});
