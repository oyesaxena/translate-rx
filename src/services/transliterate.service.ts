import unidecode from 'unidecode';
import translateService from './translate.service';
import { ApiType } from './dto/translate.dto';
import { capitalize, unescape } from 'lodash';

export class TransliterationService {
  async transliterate(name: string, languages: string[], source: string, apiType?: ApiType) {
    const translations = await translateService.translate(
      [this.getGoogleTranslateText(name)],
      languages,
      source,
      apiType,
    );
    return this.cleanTranslations(name, translations[this.getGoogleTranslateText(name)]);
  }

  private getGoogleTranslateText(localName: string) {
    return `my name is: ${localName}`;
  }

  private cleanTranslations(name: string, translations: Record<string, string>) {
    Object.keys(translations).forEach((key) => {
      if (key === 'en') {
        translations[key] = this.localEnTransliteration(
          name,
          capitalize(translations?.[key]?.split?.(':')?.[1]?.trim?.()),
        );
      } else {
        translations[key] = capitalize(translations?.[key]?.split?.(':')?.[1]?.trim?.());
      }
    });
    return translations;
  }

  private localEnTransliteration(str: string, googleTranslatedName: string) {
    const arrayOfUnicode = str.split(' ');
    let unicodeString = '';
    arrayOfUnicode.forEach((character) => {
      unicodeString += '%u' + ('0000' + character).slice(-4);
    });
    let localString = unescape(unicodeString);
    localString = localString.includes('%u') ? str : localString;
    const decodedName = unidecode(localString);
    if (
      decodedName &&
      Array.from(decodedName)[0]?.toLowerCase() !==
        Array.from(googleTranslatedName)[0]?.toLowerCase()
    ) {
      return decodedName;
    }

    return googleTranslatedName === localString ? unicodeString : googleTranslatedName;
  }
}

const transliterationService = new TransliterationService();
export default transliterationService;
