import 'jest-mock-extended';
import { ApiType } from '../src/services/dto/translate.dto';
import translateService from '../src/services/translate.service';

jest.mock('@google-cloud/translate', () => ({
  v2: {
    Translate: jest.fn().mockImplementation(() => ({
      translate: jest.fn().mockResolvedValue(['Translation']),
    })),
  },
}));
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: [[['Translation']]] }),
}));

describe('Translate Service', () => {
  it('Translate Strings PAID', async () => {
    const resp = await translateService.translate(['Hi'], ['en'], 'B2C', ApiType.PAID);
    expect(resp).toMatchObject({ Hi: { en: 'Translation' } });
  });

  it('Translate Strings FREE', async () => {
    const resp = await translateService.translate(['Hi'], ['en'], 'B2C', ApiType.FREE);
    expect(resp).toMatchObject({ Hi: { en: 'Translation' } });
  });
});
