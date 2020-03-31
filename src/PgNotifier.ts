import { Client, PoolClient } from 'pg';
import MemoryNotifier from './MemoryNotifier';

const { escapeIdentifier, escapeLiteral } = Client.prototype;

export default class PgNotifier {
  private notifyClient: PoolClient;
  private memoryNotifier: MemoryNotifier;

  constructor(client: PoolClient) {
    // Keep one connection open for notifications
    this.notifyClient = client;

    const onListen = key =>
      this.notifyClient.query('LISTEN ' + escapeIdentifier(key));
    const onUnlisten = key =>
      this.notifyClient.query('UNLISTEN ' + escapeIdentifier(key));

    this.memoryNotifier = new MemoryNotifier(onListen, onUnlisten);

    this.notifyClient.on('notification', event => {
      this.memoryNotifier.notify(event.channel, event.payload);
    });
  }

  channel(key) {
    return this.memoryNotifier.channel(key);
  }

  notify(channel, message) {
    let cmd = `NOTIFY ${escapeIdentifier(channel)}`;

    if (message) {
      cmd += `, ${escapeLiteral(message)}`;
    }

    return this.notifyClient.query(cmd);
  }
}
