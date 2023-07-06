import { TypeormEntityBase } from '@libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';

@Entity('product')
export class ProductOrmEntity extends TypeormEntityBase {
  constructor(props?: ProductOrmEntity) {
    super(props);
  }

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

}
