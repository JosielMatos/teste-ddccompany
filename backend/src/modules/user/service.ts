import { Injectable } from '@nestjs/common'
import { ZodValidationError } from 'src/@shared/graphql/errors'
import { ExecutionDTOType, MethodType } from 'src/@shared/types/auth'
import { buildPrismaWhere, checkPermission } from 'src/@shared/utils'
import { PrismaService } from 'src/infra/database/prisma.service'
import { CreateDTO, DeleteDTO, EntityResponse, GetDTO, UpdateDTO } from './entities/entity'
import { moduleMetadata } from './moduleMetadata'

@Injectable()
export class Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: ExecutionDTOType<any, any>): Promise<EntityResponse> {
    let DTO = data
    for (const rule of Object.values(this[data.method].rules)) {
      DTO = await (rule as any)(DTO)
      if (DTO.error) {
        return DTO.error
      }
    }

    const result = await this[data.method].execution(DTO)

    return result
  }

  create: MethodType<ExecutionDTOType<CreateDTO, 'create'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-criar-user'] })).permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(CreateDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      uniqueEmail: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findFirst({
          where: {
            email: data.datap.email,
          },
        })
        if (result) {
          data.error = {
            error: {
              errors: [
                {
                  message: 'Email já existe',
                  path: ['email'],
                  code: 'custom',
                },
              ],
            },
          }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<CreateDTO, 'create'>) => {
      const result = await this.prisma[moduleMetadata.tb].create({
        data: data.datap as any,
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }

  get: MethodType<ExecutionDTOType<GetDTO, 'get'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        if ((await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-ler-user'] })).permitted) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(GetDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
    },
    execution: async (data: ExecutionDTOType<GetDTO, 'get'>) => {
      const where = buildPrismaWhere(data.datap.andWhere)
      const take = data.datap.take || 10
      const skip = data.datap.skip || 0

      const [items, count] = await Promise.all([
        this.prisma[moduleMetadata.tb].findMany({
          where,
          take,
          skip,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            posts: true,
            profile: true,
          },
        }),
        this.prisma[moduleMetadata.tb].count({ where }),
      ])

      return {
        data: {
          count,
          items,
        },
      }
    },
  }

  update: MethodType<ExecutionDTOType<UpdateDTO, 'update'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-atualizar-user'] }))
            .permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(UpdateDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      checkExists: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findUnique({
          where: { id: data.datap.id },
        })
        if (!result) {
          data.error = { error: { notFound: 'User não encontrado' } }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<UpdateDTO, 'update'>) => {
      const { id, ...updateData } = data.datap
      const result = await this.prisma[moduleMetadata.tb].update({
        where: { id },
        data: updateData as any,
        include: {
          posts: true,
          profile: true,
        },
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }

  delete: MethodType<ExecutionDTOType<DeleteDTO, 'delete'>, EntityResponse> = {
    rules: {
      perm: async (data) => {
        if (
          (await checkPermission({ prisma: this.prisma, token: data.tokenData, data: ['api-deletar-user'] })).permitted
        ) {
          return data
        }
        data.error = { error: { forbidden: 'Sem permissão para o recurso' } }
        return data
      },
      validateDTOData: async (data) => {
        const validatedData = ZodValidationError.validate(DeleteDTO.zodSchema(), data.datap)
        if ('errors' in validatedData) {
          data.error = { error: { errors: validatedData.errors } }
        }
        data.datap = validatedData as any
        return data
      },
      checkExists: async (data) => {
        const result = await this.prisma[moduleMetadata.tb].findUnique({
          where: { id: data.datap.id },
        })
        if (!result) {
          data.error = { error: { notFound: 'User não encontrado' } }
        }
        return data
      },
    },
    execution: async (data: ExecutionDTOType<DeleteDTO, 'delete'>) => {
      const result = await this.prisma[moduleMetadata.tb].delete({
        where: { id: data.datap.id },
      })

      return {
        data: {
          count: 1,
          items: [result],
        },
      }
    },
  }
}
