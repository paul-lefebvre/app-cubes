import I18n from 'react-native-i18n';
//import DeviceInfo from 'react-native-device-info';

import fr from './locales/fr';

I18n.localeCurrencyMapping = {
  fr: 'EUR',
  es: 'EUR',
  it: 'EUR',
  en: 'GBP',
  com: 'EUR',
  de: 'EUR',
};

I18n.defaultLocale = 'fr';

/* A VOIR APRES TRANSLATION DE L'APP
function getDeviceLocale() {
  const locale = DeviceInfo.getDeviceLocale();
  if (locale === 'en-US') {
    return 'com';
  }
  if (locale) {
    if (locale === 'com') {
      return locale;
    }
    return locale.substr(0, 2);
  }
  return I18n.defaultLocale;
}
*/

I18n.defaultCurrency = 'EUR';
I18n.locale = 'fr';
I18n.fallbacks = true;

I18n.hasTranslation = key => {
  const keys = Object.keys(fr);
  return keys.indexOf(key) !== -1;
};

I18n.getCurrentCurrency = () => {
  const locale = I18n.currentLocale();
  if (I18n.localeCurrencyMapping[locale]) {
    return I18n.localeCurrencyMapping[locale];
  }
  return I18n.defaultCurrency;
};

I18n.getDYLocale = () => {
  if (I18n.locale === 'com') {
    return 'en_US';
  } else if (I18n.locale === 'en') {
    return 'en_GB';
  } else if (I18n.locale === 'es') {
    return 'es_ES';
  } else if (I18n.locale === 'it') {
    return 'it_IT';
  } else {
    return 'fr_FR';
  }
};

I18n.translations = {
  fr: {
    ...fr,
  },
};

export {I18n as default};
