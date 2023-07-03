import { TypeormEntityBase } from '@libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';

@Entity('asset')
export class AssetOrmEntity extends TypeormEntityBase {
  constructor(props?: AssetOrmEntity) {
    super(props);
  }

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

}
