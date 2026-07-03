import { Token } from '../../core/entities/token.entity';
import { MySQLConnection } from '../database/mysql.connection';

export interface ITokenRepository {
  create(token: Token): Promise<Token>;
  findByJti(jti: string): Promise<Token | null>;
  findByToken(token: string): Promise<Token | null>;
  blacklistToken(jti: string): Promise<void>;
  isTokenBlacklisted(jti: string): Promise<boolean>;
  deleteExpiredTokens(): Promise<void>;
}

export class MySQLTokenRepository implements ITokenRepository {
  async create(token: Token): Promise<Token> {
    const query = `
      INSERT INTO tokens (id, jti, token, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      token.jti,
      token.jti,
      token.token,
      token.userId,
      token.expiresAt,
      token.createdAt
    ];
    
    await MySQLConnection.executeQuery(query, params);
    return token;
  }

  async findByJti(jti: string): Promise<Token | null> {
    const query = `
      SELECT jti, token, expires_at, user_id, is_blacklisted, created_at
      FROM tokens 
      WHERE jti = ?
      LIMIT 1
    `;
    
    const rows = await MySQLConnection.executeQuery<any>(query, [jti]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return new Token(
      row.jti,
      row.token,
      new Date(row.expires_at),
      row.user_id,
      new Date(row.created_at)
    );
  }

  async findByToken(token: string): Promise<Token | null> {
    const query = `
      SELECT jti, token, expires_at, user_id, is_blacklisted, created_at
      FROM tokens 
      WHERE token = ?
      LIMIT 1
    `;
    
    const rows = await MySQLConnection.executeQuery<any>(query, [token]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return new Token(
      row.jti,
      row.token,
      new Date(row.expires_at),
      row.user_id,
      new Date(row.created_at)
    );
  }

  async blacklistToken(jti: string): Promise<void> {
    const query = `
      UPDATE tokens 
      SET is_blacklisted = TRUE 
      WHERE jti = ?
    `;
    
    await MySQLConnection.executeQuery(query, [jti]);
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count 
      FROM tokens 
      WHERE jti = ? AND is_blacklisted = TRUE
    `;
    
    const result = await MySQLConnection.executeScalar<{ count: number }>(
      query, 
      [jti]
    );
    
    return (result?.count || 0) > 0;
  }

  async deleteExpiredTokens(): Promise<void> {
    const query = `
      DELETE FROM tokens 
      WHERE expires_at < NOW() OR is_blacklisted = TRUE
    `;
    
    await MySQLConnection.executeQuery(query);
  }
}