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

    this.notifyClient.on('notification', ({ channel, payload }) => {
      this.memoryNotifier.notify(channel, payload);
    });
  }

  channel(key) {
    return this.memoryNotifier.channel(key);
  }

  notify(channel, message) {
    let command = `NOTIFY ${escapeIdentifier(channel)}`;

    if (message) {
      command += `, ${escapeLiteral(message)}`;
    }

    return this.notifyClient.query(command);
  }
}
