import { EntityRepository, Repository } from 'typeorm'
import { Instance } from './instance.entity'

@EntityRepository(Instance)
export class InstanceRepository extends Repository<Instance> {}
