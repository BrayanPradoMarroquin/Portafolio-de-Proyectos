import { IUserRepository, CreateUserDTO } from '../../core/interfaces/user.interface';
import { User } from '../../core/entities/user.entity';
import { UserRole } from '../../core/enums/role.enum';
import { MySQLConnection } from '../database/mysql.connection';

export class MySQLUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, name, email, password, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt
    ];
    
    await MySQLConnection.executeQuery(query, params);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users 
      WHERE email = ?
      LIMIT 1
    `;
    
    const rows = await MySQLConnection.executeQuery<any>(query, [email]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return new User(
      row.id,
      row.name,
      row.email,
      row.password,
      row.role as UserRole,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users 
      WHERE id = ?
      LIMIT 1
    `;
    
    const rows = await MySQLConnection.executeQuery<any>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return new User(
      row.id,
      row.name,
      row.email,
      row.password,
      row.role as UserRole,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    const rows = await MySQLConnection.executeQuery<any>(query);
    
    return rows.map(row => new User(
      row.id,
      row.name,
      row.email,
      row.password,
      row.role as UserRole,
      new Date(row.created_at),
      new Date(row.updated_at)
    ));
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      return null;
    }
    
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      params.push(updates.name);
    }
    
    if (updates.email !== undefined) {
      fields.push('email = ?');
      params.push(updates.email);
    }
    
    if (updates.password !== undefined) {
      fields.push('password = ?');
      params.push(updates.password);
    }
    
    if (updates.role !== undefined) {
      fields.push('role = ?');
      params.push(updates.role);
    }
    
    fields.push('updated_at = ?');
    params.push(new Date());
    
    params.push(id);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    await MySQLConnection.executeQuery(query, params);
    
    // Devolver usuario actualizado
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM users WHERE id = ?`;
    
    try {
      const result = await MySQLConnection.executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM users`;
    const result = await MySQLConnection.executeScalar<{ count: number }>(query);
    return result?.count || 0;
  }
}