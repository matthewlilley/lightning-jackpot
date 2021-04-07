// import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { User } from '../../src/server/database/entities';

// import typeOrmTestConfig from '../../ormconfig-test.json'
const APP_URL = process.env.APP_URL
  ? String(process.env.APP_URL)
  : 'http://localhost:1337';

describe('Lightning Jackpot', () => {
  const user = new User();
  user.email = 'hello@matthewlilley.com';

  beforeAll(async () => {
    jest.setTimeout(15000);
    await page.goto(APP_URL);
  });

  test('Can insert to db', async () => {
    const options: ConnectionOptions = {
      name: 'mysql-test',
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'test',
      password: 'test',
      database: 'lightningjackpot-test',
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: ['src/database/entities/**/*.ts'],
    };
    createConnection(options).then(
      async connection => {
        const userRepository = connection.getRepository(User);
        const savedUser = await userRepository.save(user);
        await expect(savedUser.email).toEqual(user.email);
        await connection.close();
      },
      error => console.log(error),
    );
  }, 7000);

  it('should display "Lightning Jackpot" text on page', async () => {
    await expect(page).toMatch('Lightning Jackpot');
  });

  // it('should have __NEXT_DATA__', async () => {
  //   const nextData = await page.evaluate(() => __NEXT_DATA__);
  //   expect(nextData).toBeTruthy();
  // });

  describe('Login', () => {
    test('users can login', async () => {
      const loginButton = await page.waitForXPath(
        '//*[@id="__next"]/div/div[1]/div/div/div/button',
      );
      await loginButton.click();
      await page.waitForSelector('body > div.ReactModalPortal');
      await page.type('input[name=email]', user.email);
      await page.click('button[type=submit]');
      await page.waitForResponse(`${APP_URL}/api/v0/auth`);
      await expect(page).toMatch(
        "We've sent you an email, click on the link provided to login.",
      );
    }, 60000);
  });
});
