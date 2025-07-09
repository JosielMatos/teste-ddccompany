import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { GetEntityDTO, MainResponse, PaginationResponse, createZodSchema } from 'src/@shared/graphql/types'
import { z } from 'zod'
import { createDTODBType, moduleMetadata, updateDTODBType } from '../moduleMetadata'

@ObjectType(moduleMetadata.name + 'Entity')
export class MainEntity {
  @Field(() => ID)
  id: number
  static idZod = z.number().int().positive()

  @Field(() => String)
  email: string
  static emailZod = z.string().email()

  @Field(() => String, { nullable: true })
  name?: string
  static nameZod = z.string().min(1).optional()

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType(moduleMetadata.name + 'Pagination')
export class EntityPagination extends PaginationResponse {
  @Field(() => [MainEntity])
  items: MainEntity[]
}

@InputType('Get' + moduleMetadata.name + 'sDTO')
export class GetDTO extends GetEntityDTO {}

@InputType('Create' + moduleMetadata.name + 'DTO')
export class CreateDTO implements createDTODBType {
  @Field(() => String)
  email: string
  static emailZod = MainEntity.emailZod

  @Field(() => String, { nullable: true })
  name?: string
  static nameZod = MainEntity.nameZod

  static zodSchema = createZodSchema.bind(CreateDTO)
}

@InputType('Update' + moduleMetadata.name + 'DTO')
export class UpdateDTO implements updateDTODBType {
  @Field(() => ID)
  id: number
  static idZod = MainEntity.idZod

  @Field(() => String, { nullable: true })
  email?: string | Prisma.StringFieldUpdateOperationsInput
  static emailZod = MainEntity.emailZod.optional()

  @Field(() => String, { nullable: true })
  name?: string | Prisma.NullableStringFieldUpdateOperationsInput
  static nameZod = MainEntity.nameZod

  static zodSchema = createZodSchema.bind(UpdateDTO)
}

@InputType('Delete' + moduleMetadata.name + 'DTO')
export class DeleteDTO {
  @Field(() => ID)
  id: number
  static idZod = MainEntity.idZod

  static zodSchema = createZodSchema.bind(DeleteDTO)
}

@ObjectType(moduleMetadata.name + 'Response')
export class EntityResponse extends MainResponse {
  @Field(() => EntityPagination, { nullable: true })
  data?: EntityPagination
}
