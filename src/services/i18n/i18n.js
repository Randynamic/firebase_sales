import Cookies from "js-cookie";

import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from "../../store/constants";
import * as moment from "moment";

/**
 * @description Get system-wide available languages
 */
export const availableLanguages = () => AVAILABLE_LANGUAGES;

/**
 * @description Get locally stored locale data
 * @param {string <en-US|nl-NL|...>} language
 */
export const getLocalI18n = async language => {
  let localI18n = await Cookies.getJSON(`${process.env.COOKIE_I18N}_${language}`);
  if (localI18n) return localI18n;
  return null;
};

export const defaultDateTimeFormats = () => {
  return {
    formats: {
      datetime: {
        standard: "YYYY-MM-DD HH:mm:ss",
        long: "MMMM Do YYYY HH:mm:ss",
        medium: "YYYY-MM-DD HH:mm",
        short: "YY-MM-DD HH:mm"
      },
      time: {
        standard: "HH:mm:ss",
        long: "HH:mm:ss",
        medium: "HH:mm",
        short: "H:m"
      },
      date: {
        standard: "YYYY-MM-DD",
        long: "MMMM Do YYYY",
        medium: "YYYY-MM-DD",
        short: "YY-MM-DD"
      }
    }
  };
};

/**
 * @description Set locale data locally to prevent constantly remote fetching
 * @param {localeObject} activeLanguage and data
 */
export const setLocalI18n = async ({ activeLanguage, ...localeData }) => {
  Cookies.set(`${process.env.COOKIE_I18N}_${activeLanguage}`, localeData, {
    expires: +process.env.COOKIE_I18N_TTL,
    domain: process.env.COOKIE_I18N_DOMAIN
  });
};

/**
 * @description Set local language expiring after process.env.COOKIE_I18N_TTL_ACTIVE_LANG
 * @param {string} language
 */
export const setLocale = language => {
  Cookies.set(process.env.COOKIE_I18N_ACTIVE, language, {
    expires: +process.env.COOKIE_I18N_TTL_ACTIVE_LANG,
    domain: process.env.COOKIE_I18N_DOMAIN
  });
};

/**
 * @description Get stored locale or return default language
 */
export const getLocale = () => {
  let activeI18n = Cookies.getJSON(process.env.COOKIE_I18N_ACTIVE);
  if (availableLanguages().find(availableLanguage => availableLanguage === activeI18n)) {
    return activeI18n;
  }
  return DEFAULT_LANGUAGE;
};

export const defaultLocale = getLocale();

/**
 *
 * @param {object} localeData Content of locale .json file
 * @param {string} language en-US, nl-NL ...
 * @param {boolean} saveLocally Store data yes or no
 */
const responseLocaleData = ({ labels, datetime }, language, saveLocally) => {
  moment.locale(language);
  const response = {
    activeLanguage: language,
    labels,
    datetime: {
      moment,
      formats: datetime && datetime.formats ? datetime.formats : {},
      ...defaultDateTimeFormats()
    }
  };
  if (saveLocally) setLocalI18n(response);
  setLocale(language);
  return {
    ...response,
    _: key => {
      return labels[key] || `{{${key}}}`;
    }
  };
};

/**
 *
 * @param {string} language
 * @param {number} i Prevent infinite loop
 */
export const getI18nData = async (language = defaultLocale, i = 0) => {
  const localLocaleData = await getLocalI18n(language);
  if (localLocaleData) {
    return responseLocaleData(localLocaleData, language, false);
  }
  if (availableLanguages().find(availableLanguage => availableLanguage === language)) {
    return await fetch(`./dist/assets/locales/${language}.json`)
      .then(result => result.json())
      .then(data => responseLocaleData(data, language, true))
      .catch(e => e);
  }
  if (i < 3) {
    return getI18nData(DEFAULT_LANGUAGE, i++);
  }
  throw "Error retrieving language data!";
};
