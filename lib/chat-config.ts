/** Single place to tune the chatbot's model and limits. */

/** Claude Haiku 5.5. No date suffix: the ID is complete as-is. */
export const CHAT_MODEL = 'claude-haiku-5-5';

/**
 * Answers are short, but thinking tokens count against this too, so it is not
 * set tight. Caps the worst-case cost of one reply at well under a cent.
 */
export const MAX_OUTPUT_TOKENS = 4096;

export const MAX_USER_MESSAGE_CHARS = 1000;
export const MAX_MESSAGES = 24;
export const MAX_PAYLOAD_CHARS = 100_000;

/** Per visitor address: 15 messages a minute. */
export const RATE_LIMIT_MAX = 15;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export const MAX_LEAD_NAME_CHARS = 120;
export const MAX_LEAD_CONTACT_CHARS = 200;

/** Lead emails get a far tighter budget than questions: 3 an hour per address. */
export const LEAD_RATE_LIMIT_MAX = 3;
export const LEAD_RATE_LIMIT_WINDOW_MS = 60 * 60_000;
