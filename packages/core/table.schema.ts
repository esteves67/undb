import { z } from 'zod'
import { createTableCommandInput } from './commands'
import { querySchemaSchema } from './field'
import type { IQueryTable } from './table'
import { createViewInput_internal, queryViews } from './view'

export const createTableInput_internal = createTableCommandInput.merge(
  z.object({ views: z.array(createViewInput_internal).optional() }),
)

export type ICreateTableInput_internal = z.infer<typeof createTableInput_internal>

export const queryTable: z.ZodType<IQueryTable> = z.object({
  id: z.string(),
  name: z.string(),
  schema: querySchemaSchema,
  views: queryViews,
})
