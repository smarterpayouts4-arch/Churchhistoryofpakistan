/**
 * Keyboard settings for admin text boxes, so phones and computers help the
 * owner type: the device's own spell checker (red underline, tap for
 * suggestions), autocorrect, and a capital letter at the start of each
 * sentence. These work the same on iPhone, iPad, Android and desktop
 * browsers, with no extra service.
 *
 * Spread one of these on an <input> or <textarea>: <textarea {...PROSE} />.
 */

/** Captions, descriptions and other sentences. */
export const PROSE = {
  spellCheck: true,
  autoCorrect: "on",
  autoCapitalize: "sentences",
  autoComplete: "off",
  lang: "en",
} as const;

/** Single-line text such as a title or heading (the keyboard shows "Done"). */
export const LINE = { ...PROSE, enterKeyHint: "done" } as const;

/** People's names: capital on each word, but no autocorrect changing names. */
export const NAME = {
  spellCheck: false,
  autoCorrect: "off",
  autoCapitalize: "words",
  lang: "en",
} as const;

/** Web addresses and file paths: no spell check, no autocorrect, no capitals. */
export const URL_FIELD = {
  spellCheck: false,
  autoCorrect: "off",
  autoCapitalize: "none",
  autoComplete: "off",
  inputMode: "url",
} as const;
