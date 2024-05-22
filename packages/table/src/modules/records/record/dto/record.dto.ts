import { z } from "@undb/zod"
import { fieldName } from "../../../schema"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const recordDTO = z.object({
  id: recordId,
  values: recordValues,
})

export type IRecordDTO = z.infer<typeof recordDTO>

export const recordReadableDTO = z.record(fieldName, z.any())

export type IRecordReadableDTO = z.infer<typeof recordReadableDTO>
