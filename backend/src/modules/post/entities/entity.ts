import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  ConnectWhere,
  GetEntityDTO,
  MainResponse,
  PaginationResponse,
  createZodSchema,
} from 'src/@shared/graphql/types'
import { z } from 'zod'
import { createDTODBType, moduleMetadata, updateDTODBType } from '../moduleMetadata'

@ObjectType(moduleMetadata.name + 'Entity')
export class MainEntity {
  @Field(() => ID)
  id: number
  static idZod = z.number().int().positive()

  @Field(() => String)
  title: string
  static titleZod = z.string().min(1)

  @Field(() => String, { nullable: true })
  content?: string
  static contentZod = z.string().optional()

  @Field(() => Boolean)
  published: boolean
  static publishedZod = z.boolean()

  @Field(() => ID)
  authorId: number
  static authorIdZod = z.number().int().positive()

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
  title: string
  static titleZod = MainEntity.titleZod

  @Field(() => String, { nullable: true })
  content?: string
  static contentZod = MainEntity.contentZod

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  published?: boolean
  static publishedZod = MainEntity.publishedZod.optional().default(false)

  @Field(() => [ID], { nullable: true })
  postCategories?: number[]
  static postCategoriesZod = z.array(z.number().int().positive()).optional()

  @Field(() => ConnectWhere)
  author: Prisma.UserCreateNestedOneWithoutPostsInput
  static authorZod = ConnectWhere.zodSchema()

  static zodSchema = createZodSchema.bind(CreateDTO)
}

@InputType('Update' + moduleMetadata.name + 'DTO')
export class UpdateDTO implements updateDTODBType {
  @Field(() => ID)
  id: number
  static idZod = MainEntity.idZod

  @Field(() => String, { nullable: true })
  title?: string | Prisma.StringFieldUpdateOperationsInput
  static titleZod = MainEntity.titleZod.optional()

  @Field(() => String, { nullable: true })
  content?: string | Prisma.NullableStringFieldUpdateOperationsInput
  static contentZod = MainEntity.contentZod

  @Field(() => [ID], { nullable: true })
  postCategories?: number[]
  static postCategoriesZod = z.array(z.number().int().positive()).optional()

  @Field(() => Boolean, { nullable: true })
  published?: boolean | Prisma.BoolFieldUpdateOperationsInput
  static publishedZod = MainEntity.publishedZod.optional()

  @Field(() => ConnectWhere, { nullable: true })
  author?: Prisma.UserUpdateOneRequiredWithoutPostsNestedInput
  static authorZod = ConnectWhere.zodSchema().optional()

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
