// Helpers
export * from './helpers/env/envParser';
export * from './helpers/stream/streamChainer';
export * from './helpers/stream/streamHelper';
// Interfaces
export * from './interfaces/Docker';
export * from './interfaces/Env';
export * from './interfaces/File';
export * from './interfaces/Npm';
export * from './interfaces/Script';
export * from './lib/Cron/Cron';
export * from './lib/Logger/interfaces';
export * from './lib/Logger/Logger';
export * from './lib/Process/Process';
// Utils
export * from './utils/docker';
export * from './utils/file';
export * from './utils/hash';
export * from './utils/npm';
export * from './utils/script';
export * from './utils/stream';
export * from './utils/time';
export * from './utils/uuid';

import { Script } from './lib/Script/Script';

(async () => {
  const script = new Script({ absolutePath: '/tmp', scriptName: 'testing2', override: true });
  await script.generateScript();
})();
