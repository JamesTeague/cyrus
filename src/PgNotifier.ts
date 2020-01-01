import pg from 'pg';
import MemoryNotifier from './MemoryNotifier';

const { escapeIdentifier, escapeLiteral } = pg.Client.prototype;

export default class PgNotifier {
  private notifyClient: pg.PoolClient;
  private memoryNotifier: MemoryNotifier;

  constructor(client: pg.PoolClient) {
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
