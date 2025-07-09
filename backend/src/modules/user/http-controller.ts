import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/@shared/guards/jwtAuth.guard'
import { CreateDTO, DeleteDTO, EntityResponse, GetDTO, UpdateDTO } from './entities/entity'
import { Service } from './service'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class HttpController {
  constructor(private readonly service: Service) {}

  @Post()
  async create(@Req() req: any, @Body() data: CreateDTO): Promise<EntityResponse> {
    return await this.service.execute({
      datap: data,
      method: 'create',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
  }

  @Get()
  async getAll(@Req() req: any, @Query() query: any): Promise<EntityResponse> {
    const data: GetDTO = {
      skip: query.skip ? parseInt(query.skip) : undefined,
      take: query.take ? parseInt(query.take) : undefined,
      andWhere: query.andWhere ? JSON.parse(query.andWhere) : undefined,
      orWhere: query.orWhere ? JSON.parse(query.orWhere) : undefined,
      andWhereNot: query.andWhereNot ? JSON.parse(query.andWhereNot) : undefined,
      orWhereNot: query.orWhereNot ? JSON.parse(query.orWhereNot) : undefined,
      orderBy: query.orderBy ? JSON.parse(query.orderBy) : undefined,
    }

    return await this.service.execute({
      datap: data,
      method: 'get',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string): Promise<EntityResponse> {
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      return { error: { badRequest: 'Invalid ID format' } }
    }

    const data: GetDTO = {
      andWhere: [{ field: 'id', fieldType: 'valueInt', valueInt: numericId }],
      take: 1,
    }

    return await this.service.execute({
      datap: data,
      method: 'get',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() data: Omit<UpdateDTO, 'id'>): Promise<EntityResponse> {
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      return { error: { badRequest: 'Invalid ID format' } }
    }

    const updateData: UpdateDTO = { ...data, id: numericId }

    return await this.service.execute({
      datap: updateData,
      method: 'update',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string): Promise<EntityResponse> {
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      return { error: { badRequest: 'Invalid ID format' } }
    }

    const data: DeleteDTO = { id: numericId }

    return await this.service.execute({
      datap: data,
      method: 'delete',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
  }
}
