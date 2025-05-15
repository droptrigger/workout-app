import * as Localization from 'expo-localization';
import { I18n }from 'i18n-js';

const i18n = new I18n({en, ru})

import en from './en';
import ru from './ru';

i18n.locale = Localization.locale ?? 'en';
i18n.enableFallback = true;

export default i18n;