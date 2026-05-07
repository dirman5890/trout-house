import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './sanity/env';

export default defineCliConfig({
  api: { projectId, dataset },
  // The Studio is embedded in the Next.js app at /studio — there's no separate
  // hosted Studio. So `sanity dev` and `sanity start` aren't expected.
  autoUpdates: true,
});
