import { z } from "@undb/zod"
import { autoIncrementFieldDTO } from "../variants/autoincrement-field"
import { createdAtFieldDTO } from "../variants/created-at-field"
import { idFieldDTO } from "../variants/id-field/id-field.vo"
import { createNumberFieldDTO, numberFieldDTO } from "../variants/number-field/number-field.vo"
import { createStringFieldDTO, stringFieldDTO } from "../variants/string-field/string-field.vo"
import { updatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"

export const fieldDTO = z.union([
  stringFieldDTO,
  numberFieldDTO,
  idFieldDTO,
  createdAtFieldDTO,
  autoIncrementFieldDTO,
  updatedAtFieldDTO,
])

export type IFieldDTO = z.infer<typeof fieldDTO>

export const inferCreateFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ id: true, name: true }),
  createNumberFieldDTO.omit({ id: true, name: true }),
])

export type IInferCreateFieldDTO = z.infer<typeof inferCreateFieldDTO>
