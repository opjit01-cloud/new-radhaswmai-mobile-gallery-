import { onRequest as catchallHandler } from '../[[catchall]].js';

export async function onRequest(context) {
  context.params = context.params || {};
  context.params.catchall = ['admin', 'verify'];
  return catchallHandler(context);
}
