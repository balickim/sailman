import { TranslationQuery } from 'next-translate';
import useTranslation from 'next-translate/useTranslation';

export default function useTranslationWrapper(defaultNs?: string) {
  const { t } = useTranslation(defaultNs);

  function tw(
    i18nKey: string | TemplateStringsArray,
    query?: TranslationQuery,
    options?: {
      returnObjects?: boolean;
      fallback?: string | string[];
      default?: string;
      form?: number;
    },
  ): string {
    if (options.form !== undefined || options.form !== null) {
      const split = t(i18nKey, query, options).split('|||');
      if (split[options.form]) {
        return split[options.form];
      } else {
        return split[0];
      }
    } else {
      return t(i18nKey, query, options);
    }
  }

  return { tw };
}
