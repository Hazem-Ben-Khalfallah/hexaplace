import { ObjectLiteral } from '@libs/types/object-literal.type';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class TypeormEntityBase {
  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryColumn({ update: false })
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
  })
  metadata?: ObjectLiteral;
}
