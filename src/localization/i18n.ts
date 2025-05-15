import * as Localization from 'expo-localization';
import { I18n }from 'i18n-js';

import en from './en';
import ru from './ru';
import ch from './ch';

const i18n = new I18n({en, ru, ch})

i18n.locale = 'ch';
i18n.enableFallback = true;

export default i18n;