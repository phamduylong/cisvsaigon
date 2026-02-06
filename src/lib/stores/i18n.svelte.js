// i18n.js
import translations from '$lib/assets/translations';

/** @typedef {Record<string, Record<string, string>>} Translations */
const typedTranslations = translations;

/** @type {'vi' | 'en'} */
let locale = $state('vi');

/**
 * Get current user preferred locale
 * @returns {'vi' | 'en'}
 */
export function getLocale() {
	return locale;
}

/**
 * Set preferred locale for user
 * @param {'vi' | 'en'} value
 */
export function setLocale(value) {
	locale = value;
}

export const locales = Object.keys(typedTranslations);

/**
 * Get translated string
 * @param {string} key
 * @param {Record<string, unknown>} vars
 */
export function t(key, vars = {}) {
	if (!key) throw new Error('no key provided to t()');

	const dict = typedTranslations[locale];
	if (!dict) throw new Error(`no locale "${locale}" found`);

	let text = dict[key];
	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	for (const k in vars) {
		text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(vars[k]));
	}

	return text;
}
