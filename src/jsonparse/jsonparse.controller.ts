import { Controller, Get, Query } from '@nestjs/common';
import { JsonparseService } from './jsonparse.service';

@Controller('jsonparse')
export class JsonparseController {
    constructor(  private readonly jsonparseService: JsonparseService,
    ){};
    // Endpoint to calculate Jsonparse synchronously
  @Get('sync')
  calculateSync(): number {
    return this.jsonparseService.parseJsonSync();
  }

  @Get('async')
  calculateAsync() {
    return this.jsonparseService.getJSONListInBatches();
  }
}
