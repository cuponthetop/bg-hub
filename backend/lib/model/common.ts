export type LocaleID = number;

export class LocaleItem {
  constructor(
    public localeID: LocaleID,
    public ko: string,
    public en: string,
  ) { }
}
