import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('admin_user')
export class AdminUser {
  @PrimaryColumn({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string | null;

  @Column({ type: 'timestamp' })
  lastSignInDate: Date;
}
