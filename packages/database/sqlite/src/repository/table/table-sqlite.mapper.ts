import type { ICreateViewsSchema, IQueryTable, IQueryView, Table } from '@undb/core'
import { TableFactory, TableSchema } from '@undb/core'
import type { Result } from 'oxide.ts'
import type { Table as TableEntity } from '../../entity/index.js'

export class TableSqliteMapper {
  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      emoji: entity.emoji,
      schema: entity.fields.getItems().map((field) => field.toQuery()),
      viewsOrder: entity.viewsOrder,
      views: entity.views.getItems().map(
        (view) =>
          ({
            id: view.id,
            name: view.name,
            displayType: view.displayType,
            showSystemFields: view.showSystemFields,
            filter: view.filter,
            fieldOptions: view.fieldOptions,
            fieldsOrder: view.fieldsOrder,
            kanban: view.kanban,
            tree: view.tree,
            calendar: view.calendar,
            sorts: view.sorts,
            pinnedFields: view.pinnedFields,
            rowHeight: view.rowHeight,
            dashboard: {
              widges: view.widges.isInitialized() ? view.widges.getItems().map((widge) => widge.toQuery()) : [],
            },
          } as IQueryView),
      ),
    }
  }

  static entityToDomain(entity: TableEntity): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: [],
      emoji: entity.emoji,
      views: entity.views.getItems().map((view) => ({
        id: view.id,
        name: view.name,
        displayType: view.displayType,
        showSystemFields: view.showSystemFields,
        filter: view.filter,
        fieldOptions: view.fieldOptions,
        fieldsOrder: view.fieldsOrder,
        kanban: view.kanban,
        tree: view.tree,
        calendar: view.calendar,
        sorts: view.sorts,
        pinnedFields: view.pinnedFields,
        rowHeight: view.rowHeight,
        dashboard: {
          widges: view.widges.isInitialized() ? view.widges.getItems().map((widge) => widge.toQuery()) : [],
        },
      })) as ICreateViewsSchema,
      viewsOrder: entity.viewsOrder,
    }).map((table) => {
      table.schema = new TableSchema(entity.fields.getItems().map((field) => field.toDomain()))
      return table
    })
  }
}
