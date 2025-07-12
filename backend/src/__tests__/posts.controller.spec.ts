import { HttpController } from '../modules/post/http-controller'
import { Service } from '../modules/post/service'
import { EntityResponse } from '../modules/post/entities/entity'

describe('PostsController', () => {
  let controller: HttpController
  let service: jest.Mocked<Service>

  beforeEach(() => {
    service = {
      execute: jest.fn(),
    } as any
    controller = new HttpController(service)
  })

  it('should call service.execute with parsed query params', async () => {
    const req = { tokenData: { userId: 1 } }
    const query = {
      skip: '10',
      take: '5',
      andWhere: JSON.stringify([{ field: 'title', value: 'test' }]),
      orWhere: JSON.stringify([{ field: 'author', value: 'a@b.com' }]),
      andWhereNot: JSON.stringify([{ field: 'published', value: false }]),
      orWhereNot: JSON.stringify([{ field: 'category', value: 'draft' }]),
      orderBy: JSON.stringify([{ field: 'id', direction: 'DESC' }]),
    }
    const expectedData = {
      skip: 10,
      take: 5,
      andWhere: [{ field: 'title', value: 'test' }],
      orWhere: [{ field: 'author', value: 'a@b.com' }],
      andWhereNot: [{ field: 'published', value: false }],
      orWhereNot: [{ field: 'category', value: 'draft' }],
      orderBy: [{ field: 'id', direction: 'DESC' }],
    }
    const fakeResponse: EntityResponse = { data: { items: [], count: 0 }, error: undefined }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.getAll(req, query)

    expect(service.execute).toHaveBeenCalledWith({
      datap: expectedData,
      method: 'get',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should handle missing query params', async () => {
    const req = { tokenData: { userId: 2 } }
    const query = {}
    const expectedData = {
      skip: undefined,
      take: undefined,
      andWhere: undefined,
      orWhere: undefined,
      andWhereNot: undefined,
      orWhereNot: undefined,
      orderBy: undefined,
    }
    const fakeResponse: EntityResponse = { data: { items: [{} as any], count: 1 }, error: undefined }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.getAll(req, query)

    expect(service.execute).toHaveBeenCalledWith({
      datap: expectedData,
      method: 'get',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should throw if JSON.parse fails', async () => {
    const req = { tokenData: {} }
    const query = {
      andWhere: 'not-a-json',
    }
    await expect(controller.getAll(req, query)).rejects.toThrow()
  })

  it('should call service.execute on create', async () => {
    const req = { tokenData: { userId: 1 } }
    const data = { title: 'Test Post', content: 'Post content', authorId: 1, author: {} as any }
    const fakeResponse: EntityResponse = {
      data: {
        items: [
          { id: 1, title: 'Test Post', createdAt: new Date(), updatedAt: new Date(), published: true, authorId: 1 },
        ],
        count: 1,
      },
      error: undefined,
    }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.create(req, data)

    expect(service.execute).toHaveBeenCalledWith({
      datap: data,
      method: 'create',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should call service.execute on getById with valid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = '42'
    const fakeResponse: EntityResponse = {
      data: {
        items: [
          { id: 42, title: 'Post 42', createdAt: new Date(), updatedAt: new Date(), published: true, authorId: 1 },
        ],
        count: 1,
      },
      error: undefined,
    }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.getById(req, id)

    expect(service.execute).toHaveBeenCalledWith({
      datap: {
        andWhere: [{ field: 'id', fieldType: 'valueInt', valueInt: 42 }],
        take: 1,
      },
      method: 'get',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should return error on getById with invalid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = 'not-a-number'

    const result = await controller.getById(req, id)

    expect(result).toEqual({ error: { badRequest: 'Invalid ID format' } })
  })

  it('should call service.execute on update with valid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = '10'
    const data = { title: 'Updated Post', content: 'Updated content' }
    const fakeResponse: EntityResponse = {
      data: {
        items: [
          { id: 10, title: 'Updated Post', createdAt: new Date(), updatedAt: new Date(), published: true, authorId: 1 },
        ],
        count: 1,
      },
      error: undefined,
    }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.update(req, id, data)

    expect(service.execute).toHaveBeenCalledWith({
      datap: { ...data, id: 10 },
      method: 'update',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should return error on update with invalid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = 'abc'
    const data = { title: 'Updated Post', content: 'Updated content' }

    const result = await controller.update(req, id, data)

    expect(result).toEqual({ error: { badRequest: 'Invalid ID format' } })
  })

  it('should call service.execute on delete with valid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = '5'
    const fakeResponse: EntityResponse = { data: { items: [], count: 0 }, error: undefined }
    service.execute.mockResolvedValue(fakeResponse)

    const result = await controller.delete(req, id)

    expect(service.execute).toHaveBeenCalledWith({
      datap: { id: 5 },
      method: 'delete',
      tokenData: req.tokenData,
      customData: {},
      error: undefined,
    })
    expect(result).toBe(fakeResponse)
  })

  it('should return error on delete with invalid id', async () => {
    const req = { tokenData: { userId: 1 } }
    const id = 'invalid'

    const result = await controller.delete(req, id)

    expect(result).toEqual({ error: { badRequest: 'Invalid ID format' } })
  })
})
