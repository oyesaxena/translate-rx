import { ApiType } from '../../services/dto/translate.dto';

export interface Header {
  'api-type'?: ApiType;
  source: string;
}

export interface TranslateRequest {
  languages: string[];
  strings: string[];
}

export interface TransliterateRequest {
  languages: string[];
  name: string;
}
