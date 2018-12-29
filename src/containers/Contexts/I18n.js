import React from "react";

import { availableLanguages, defaultLocale } from "../../services/i18n/i18n";

export { defaultLocale, getI18nData } from "../../services/i18n/i18n";

export const I18nContext = React.createContext({
  availableLanguages: availableLanguages(),
  activeLanguage: defaultLocale,
  data: {}, // language labels
  moment: {} // date time locale
});
