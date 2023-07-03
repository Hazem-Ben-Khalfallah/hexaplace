import { Result } from '@libs/ddd/domain/utils/result.util';
import { routesV1 } from '@modules/asset/asset.routes';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';
import { GetAssetsHttpRequest } from '@modules/asset/queries/get-assets/get-assets.request.dto';
import { AssetHttpResponse } from '@modules/asset/queries/get-assets/get-assets.response.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Asset')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class GetAssetsHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.asset.root)
  @ApiOperation({ summary: 'List assets' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AssetHttpResponse,
  })
  async getAssets(
    @Query() request: GetAssetsHttpRequest,
  ): Promise<AssetHttpResponse[]> {
    const query = new GetAssetsQuery(request);
    const result: Result<AssetEntity[]> = await this.queryBus.execute(query);

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the asset */
    return result.unwrap().map((asset) => new AssetHttpResponse(asset));
  }
}
