/**
 * Credits: @link https://svelte.dev/playground/de39de663ef2445b8fe17b79c500013b
 */
import { derived, writable } from 'svelte/store';
import translations from '$lib/assets/translations';

/**
 * @typedef {Record<string, Record<string, string>>} Translations
 */

/** @type {Translations} */
const typedTranslations = translations;

export const locale = writable('vi');

/** @type {string[]} */
export const locales = Object.keys(typedTranslations);

/**
 * @param {string} locale
 * @param {string} key
 * @param {Record<string, unknown>} vars
 * @returns {string}
 */
function translate(locale, key, vars = {}) {
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	const dict = typedTranslations[locale];
	if (!dict) throw new Error(`no locale "${locale}" found`);

	let text = dict[key];
	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	for (const k in vars) {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, String(vars[k]));
	}

	return text;
}

/**
 * @typedef {(key: string, vars?: Record<string, unknown>) => string} Translator
 */

/**
 * @type {import("svelte/store").Readable<Translator>}
 */
export const t = derived(locale, ($locale) => {
	/** @type {Translator} */
	const translator = (key, vars = {}) => {
		return translate($locale, key, vars);
	};

	return translator;
});
