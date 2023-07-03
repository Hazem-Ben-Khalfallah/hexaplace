import { Result } from '@libs/ddd/domain/utils/result.util';
import { routesV1 } from '@modules/asset/asset.routes';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { GetAssetQuery } from '@modules/asset/queries/get-asset/get-asset.query';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssetHttpResponse } from '@modules/asset/queries/get-asset/asset.response.dto';

@ApiTags('Asset')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class GetAssetHttpController {
  constructor(private readonly queryBys: QueryBus) {}

  @Get(routesV1.asset.resourceById)
  @ApiOperation({ summary: 'get asset by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AssetHttpResponse,
  })
  async getAssetById(@Param('id') id: string): Promise<AssetHttpResponse> {
    const query = new GetAssetQuery({ id });
    const result: Result<AssetEntity> = await this.queryBys.execute(query);

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the asset */
    return new AssetHttpResponse(result.unwrap());
  }
}
