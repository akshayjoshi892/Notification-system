import { createClient } from 'redis';

export class RedisService {
  private publisher: any;
  private subscriber: any;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.publisher = createClient({ url: redisUrl });
    this.subscriber = createClient({ url: redisUrl });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.publisher.on('error', (err: any) => {
      console.error('Redis Publisher Error:', err);
    });

    this.subscriber.on('error', (err: any) => {
      console.error('Redis Subscriber Error:', err);
    });

    this.publisher.on('connect', () => {
      console.log('Redis Publisher Connected');
    });

    this.subscriber.on('connect', () => {
      console.log('Redis Subscriber Connected');
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.publisher.connect();
      await this.subscriber.connect();
      this.isConnected = true;
      console.log('Redis service connected successfully');
    }
  }

  async publish(channel: string, message: any): Promise<void> {
    try {
      const stringifiedMessage = typeof message === 'string' ? message : JSON.stringify(message);
      await this.publisher.publish(channel, stringifiedMessage);
    } catch (error) {
      console.error('Error publishing to Redis:', error);
      throw error;
    }
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    try {
      await this.subscriber.subscribe(channel, callback);
      console.log(`Subscribed to Redis channel: ${channel}`);
    } catch (error) {
      console.error('Error subscribing to Redis channel:', error);
      throw error;
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
      console.log(`Unsubscribed from Redis channel: ${channel}`);
    } catch (error) {
      console.error('Error unsubscribing from Redis channel:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.publisher.quit();
      await this.subscriber.quit();
      this.isConnected = false;
      console.log('Redis service disconnected');
    }
  }
}

export const redisService = new RedisService();