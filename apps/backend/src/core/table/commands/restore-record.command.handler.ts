import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { RestoreRecordCommandHandler as DomainHandler, RestoreRecordCommand } from '@undb/cqrs'
import { NestRLSQueryService } from '../../../authz/rls/rls-query.service.js'
import { InjectRecordRepository } from '../adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(RestoreRecordCommand)
export class RestoreRecordCommandHandler extends DomainHandler implements ICommandHandler<RestoreRecordCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: NestRLSQueryService,
  ) {
    super(tableRepo, recordRepo, rls)
  }
}
