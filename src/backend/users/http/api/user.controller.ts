import {
  Get,
  JsonController,
  Patch,
  QueryParam,
  Req,
  Res,
} from 'routing-controllers'
import { User, UserRepository } from '../..'

import { Authorized } from 'routing-controllers'
import { InjectRepository } from 'typeorm-typedi-extensions'

export interface UserFilter {
  limit: number
  offset: number
}

@JsonController()
export class UserController {
  @InjectRepository(User)
  private readonly users: UserRepository

  @Get('/api/v0/me')
  @Authorized()
  async me(@Res() res) {
    return res.locals.user
  }

  @Get('/api/v0/users')
  @Authorized(['admin'])
  async getAll(
    @QueryParam('filter', { required: false, parse: true }) filter: UserFilter
  ) {
    return this.users.find({
      relations: ['tag', 'meta', 'roles'],
      order: { id: 'DESC' },
      take: filter ? filter.limit : undefined,
      skip: filter ? filter.offset : undefined,
    })
  }

  @Get('/api/v0/users/:id')
  @Authorized(['admin'])
  async getOne(@Req() req) {
    return this.users.findOneOrFail(req.params.id)
  }

  @Patch('/api/v0/users/:id/lock')
  @Authorized(['admin'])
  async lock(@Req() req) {
    const { id } = await this.users.findOneOrFail(req.params.id)
    return this.users.update(id, { locked: true })
  }

  @Get('/api/v0/names/:name')
  async name(@Req() req, @Res() res) {
    const user = await this.users.findOne({ name: req.params.name })
    if (!user) {
      return res.status(404);
    }
    return { name: 'That name is taken' }
  }
}
