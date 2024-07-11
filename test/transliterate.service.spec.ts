import 'jest-mock-extended';
import { ApiType } from '../src/services/dto/translate.dto';
import transliterationService from '../src/services/transliterate.service';

jest.mock('@google-cloud/translate', () => ({
  v2: {
    Translate: jest.fn().mockImplementation(() => ({
      translate: jest.fn().mockResolvedValue(['my name is: kumar']),
    })),
  },
}));
jest.mock('axios', () => ({
  get: jest
    .fn()
    .mockResolvedValueOnce({ data: [[['my name is: Nitesh']]] })
    .mockResolvedValueOnce({ data: [[['my name is: nitesh']]] }),
}));

describe('Transliterate Service', () => {
  it('Translate Name PAID to EN not google match', async () => {
    const resp = await transliterationService.transliterate('Nitesh', ['en'], 'B2C', ApiType.PAID);
    expect(resp).toMatchObject({ en: 'Nitesh' });
  });
  it('Translate Name PAID to EN', async () => {
    const resp = await transliterationService.transliterate('Nitesh', ['en'], 'B2C', ApiType.PAID);
    expect(resp).toMatchObject({ en: 'Nitesh' });
  });
  it('Translate Name PAID to Other', async () => {
    const resp = await transliterationService.transliterate('Nitesh', ['hi'], 'B2C', ApiType.PAID);
    expect(resp).toMatchObject({ hi: 'Kumar' });
  });

  it('Translate Name FREE', async () => {
    const resp = await transliterationService.transliterate('Nitesh', ['en'], 'B2C', ApiType.FREE);
    expect(resp).toMatchObject({ en: '%utesh' });
  });
});
