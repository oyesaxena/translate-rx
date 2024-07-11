import axios from 'axios';
import { v2 } from '@google-cloud/translate';
import { ApiType } from './dto/translate.dto';
import { accounts } from '../configuration/environment';
import logger from '../util/Logger';

class TranslateService {
  private instances: Record<string, v2.Translate> = {};

  constructor() {
    accounts.forEach((account) => {
      this.instances[account.name] = new v2.Translate({
        credentials: account.service_acount,
      });
    });
  }

  translate = async (strings: string[], languages: string[], source: string, apiType?: ApiType) => {
    const promises = strings.map(async (string) => {
      const data = await this.translateTextService(string, languages, source, apiType);
      return Promise.resolve([string, data]);
    });
    const data = await Promise.allSettled(promises);

    const results: object[] = data?.map?.((trans) => ({
      [trans['value'][0]]: trans?.['value']?.[1],
    }));
    return results.reduce((res, curr) => ({ ...res, ...curr }), {});
  };

  private translateTextService = async (
    text: string,
    languages: string[],
    source: string,
    apiType?: ApiType,
  ) => {
    const promises = languages.map(async (lang) => {
      const t = await this.translateText(text, lang, source, apiType);
      return Promise.resolve([lang, t]);
    });

    const data = await Promise.allSettled(promises);

    const results: object[] = data?.map?.((trans) => ({
      [trans['value']?.[0]]: trans?.['value']?.[1],
    }));

    return results.reduce((res, curr) => ({ ...res, ...curr }), {});
  };

  private translateOpenAPI = async (text: string, language: string): Promise<string> => {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      language +
      '&dt=t&q=' +
      encodeURI(text);

    const data = await axios.get(url);

    return data?.data?.[0]?.[0]?.[0];
  };

  private async translateText(
    text: string,
    target: string,
    source: string,
    apiType?: ApiType,
  ): Promise<string> {
    if (apiType === ApiType.PAID) {
      try {
        const [translations] = await this.instances[source].translate(text, target);
        if (!translations) {
          throw new Error('Empty Translation');
        }
        return translations;
      } catch (e) {
        logger.error(
          e,
          `Google Translate Failure.\nText: ${text} \n Target: ${target} \n Source: ${source}`,
        );
        throw new Error(e);
      }
    }

    return this.translateOpenAPI(text, target);
  }
}

const translateService = new TranslateService();
export default translateService;
