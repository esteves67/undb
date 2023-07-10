/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, type MinField } from '@undb/core'
import { ReferenceField } from '../../entity/field.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingForeignTableFactory } from '../undelying-foreign-table.factory.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingCurrencyColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingMinColumn,
  UnderlyingUrlColumn,
} from '../underlying-column.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class MinColumnTypeModifier extends BaseColumnTypeModifier<MinField> {
  private readonly column = new UnderlyingMinColumn(this.field.id.value, this.tableId)

  private castMinColumn(column: IUnderlyingColumn) {
    this.addQueries(this.knex.schema.alterTable(this.tableId, (tb) => column.build(tb, this.knex, false)).toQuery())
    this.addJobs(async () => {
      const referenceFieldId = this.field.referenceFieldId
      const referenceField = await this.em.findOne(ReferenceField, referenceFieldId.value)
      if (!referenceField) return

      const field = referenceField.toDomain()
      const foreignTableId = referenceField.foreignTable?.id ?? this.tableId

      const ft = UnderlyingForeignTableFactory.create(this.tableId, field)

      const nestQuery = this.knex
        .queryBuilder()
        .select(INTERNAL_COLUMN_ID_NAME, this.field.aggregateFieldId.value)
        .from(foreignTableId)
        .as('ft')
        .groupBy(INTERNAL_COLUMN_ID_NAME)

      const subQuery = this.knex
        .queryBuilder()
        .select(`${ft.fromId} as id`, this.knex.raw(`min(${this.field.aggregateFieldId.value}) as value`))
        .from(ft.name)
        .leftJoin(nestQuery, ft.toId, 'ft.id')
        .groupBy(ft.fromId)
        .toQuery()

      const query = `
      UPDATE ${this.tableId}
      SET ${column.name} = tt.value
      FROM (${subQuery}) as tt
      WHERE tt.id = ${this.tableId}.${INTERNAL_COLUMN_ID_NAME}
      `

      await this.em.execute(query)
    })
  }

  string(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)
    this.castMinColumn(newColumn)
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.castMinColumn(newColumn)
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  email(): void {
    const newColumn = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  url(): void {
    const newColumn = new UnderlyingUrlColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  json(): void {
    const newColumn = new UnderlyingJsonColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  date(): void {
    const newColumn = new UnderlyingDateColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  select(): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castMinColumn(newColumn)
  }
  reference(): void {
    this.dropColumn(this.column)
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.castMinColumn(newColumn)
  }
  currency(): void {
    const newColumn = new UnderlyingCurrencyColumn(this.field.id.value, this.tableId)
    this.castMinColumn(newColumn)
  }
  attachment(): void {
    this.dropColumn(this.column)
  }
  collaborator(): void {
    this.castToCollaborator(this.column)
  }
  count(): void {
    this.dropColumn(this.column)
  }
  min(): void {
    throw new Error('Method not implemented.')
  }
  average(): void {
    this.dropColumn(this.column)
  }
  lookup(): void {
    this.dropColumn(this.column)
  }
  sum(): void {
    this.dropColumn(this.column)
  }

  ['multi-select'](): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
