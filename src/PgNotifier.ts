import pg from 'pg';
import Pool from 'pg-pool';
import MemoryNotifier from './MemoryNotifier';

const {escapeIdentifier, escapeLiteral} = pg.Client.prototype;

export default class PgNotifier {
  private pool: Pool<pg.Client>;
  private notifyClient: Promise<pg.PoolClient>;
  private memoryNotifier: MemoryNotifier;

  constructor(pool: Pool<pg.Client>) {
    this.pool = pool;

    // Keep one connection open for notifications
    this.notifyClient = this.pool.connect();

    const onListen = (key) => this.notifyClient
      .then((client) => client.query('LISTEN ' + escapeIdentifier(key)));
    const onUnlisten = (key) => this.notifyClient
      .then((client) => client.query('UNLISTEN ' + escapeIdentifier(key)));

    this.memoryNotifier = new MemoryNotifier(onListen, onUnlisten);

    this.notifyClient.then((client) => {
      client.on('notification', (event) => {
        this.memoryNotifier.notify(event.channel, event.payload);
      });
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

    return this.pool.query(cmd);
  }
}
