import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database.config';

export class MySQLConnection {
  private static pool: mysql.Pool;

  static initialize(): void {
    this.pool = mysql.createPool({
      ...databaseConfig,
      timezone: '+00:00',
      dateStrings: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true
    });

    console.log('✅ MySQL connection pool created');
  }

  static async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.pool) {
      this.initialize();
    }
    
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (error) {
      console.error('❌ Error getting MySQL connection:', error);
      throw error;
    }
  }

  static async executeQuery<T = any>(
    query: string, 
    params: any[] = []
  ): Promise<T[]> {
    const connection = await this.getConnection();
    
    try {
      const [rows] = await connection.execute(query, params);
      return rows as T[];
    } catch (error) {
      console.error('❌ Query error:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async executeScalar<T = any>(
    query: string, 
    params: any[] = []
  ): Promise<T | null> {
    const results = await this.executeQuery<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('✅ MySQL connection pool closed');
    }
  }
}