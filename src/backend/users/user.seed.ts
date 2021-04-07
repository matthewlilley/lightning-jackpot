import { Factory, Seeder, times } from 'typeorm-seeding'

import { Connection } from 'typeorm'
import { Role } from '../roles'
import { Tag } from '../tags'
import { User } from '.'
import { Profile } from '../profiles'

export class CreateUsers implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    try {
      // const connection = await factory.getConnection()
      const em = connection.createEntityManager()
      const adminRole = await em.findOne(Role, { name: 'admin' })
      const adminTag = await em.findOne(Tag, { text: 'ADMIN' })
      const matthew = {
        id: 1,
        name: 'S.H.O.D.A.N',
        email: 'hello@matthewlilley.com',
        roles: [adminRole],
        metadata: [
          { key: 'registration-ip', value: '1337' },
          { key: 'registration-country-code', value: 'GB' },
          { key: 'last-ip', value: '1337' },
        ],
        tag: adminTag,
      }
      await factory(User)(matthew).seed()
      await factory(Profile)({ providerId: '101058209616722115581', provider: 'google', userId: 1 }).seed()
      await factory(Profile)({ providerId: '445375691', provider: 'twitter', userId: 1 }).seed()
      await factory(Profile)({ providerId: '2274770305979698', provider: 'facebook', userId: 1 }).seed()

      // const ola = {
      //   id: 2,
      //   name: 'CleanUpGuy',
      //   email: 'hello@olastenberg.com',
      //   roles: [adminRole],
      //   metadata: [
      //     { key: 'registration-ip', value: '1337' },
      //     { key: 'registration-country-code', value: 'SE' },
      //     { key: 'last-ip', value: '1337' },
      //   ],
      //   tag: adminTag,
      // }  
      // await factory(User)(ola).seed()
    } catch (error) {
      console.error('Creating Users Error', error)
    }
    // console.log('Creating Users');
    // try {
    //   await connection.getRepository(User).findOneOrFail(1);
    // } catch {
    //   const adminRole = await connection
    //     .getRepository(Role)
    //     .findOneOrFail({ name: 'admin' });
    //   const adminTag = await connection
    //     .getRepository(Tag)
    //     .findOneOrFail({ text: 'ADMIN' });
    //   const matthew = {
    //     id: 1,
    //     name: 'S.H.O.D.A.N',
    //     email: 'hello@matthewlilley.com',
    //     roles: [adminRole],
    //     metadata: [],
    //     tag: adminTag,
    //   };
    //   const ola = {
    //     id: 2,
    //     name: 'CleanUpGuy',
    //     email: 'hello@olastenberg.com',
    //     roles: [adminRole],
    //     metadata: [],
    //     tag: adminTag,
    //   };
    //   if (process.env.NODE_ENV !== 'production') {
    //     const users = connection.getRepository(User);
    //     const userRole = await connection
    //       .getRepository(Role)
    //       .findOneOrFail({ name: 'user' });
    //     const observerTag = await connection
    //       .getRepository(Tag)
    //       .findOneOrFail({ text: 'OBSERVER' });
    //     await factory(User)({
    //       ...matthew,
    //       balance: 10000000,
    //     }).seed();
    //     await factory(User)({
    //       ...ola,
    //       balance: 10000000,
    //     }).seed();
    //     await times(100, async n => {
    //       const user = await factory(User)().make();
    //       const { id } = await users.save(
    //         users.create({
    //           ...user,
    //           roles: [userRole],
    //           tag: observerTag,
    //         }),
    //       );
    //       console.log('id', id);
    //       await users.update(id, { createdAt: user.createdAt });
    //     });
    //   } else {
    //     await factory(User)(matthew).seed();
    //     await factory(User)(ola).seed();
    //   }
    // }
  }
}
