import { RLSFactory, type IRLSRepository } from '@undb/authz'
import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateRLSCommand } from './create-rls.command.js'

type ICreateRLSCommandHandler = ICommandHandler<CreateRLSCommand, void>

export class CreateRLSCommandHandler implements ICreateRLSCommandHandler {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly repo: IRLSRepository,
  ) {}

  async execute(command: CreateRLSCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const view = table.mustGetView(command.viewId)

    const rls = RLSFactory.from(table, view, command.policy)

    await this.repo.insert(rls)
  }
}
