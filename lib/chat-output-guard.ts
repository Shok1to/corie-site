/**
 * A deterministic backstop under the "no personalised advice" rule, scanned
 * over the answer as it streams.
 *
 * The bar for a pattern here: there must be no correct answer that contains
 * it. A false positive cuts a good answer off mid-sentence, so anything that a
 * right answer could say in a qualifying clause stays in the prompt rules
 * instead. That is why "guaranteed" is NOT guarded: "no return is guaranteed"
 * and "an annuity pays a guaranteed income" are both correct answers.
 */
export type GuardPattern = 'directive-advice';

/** The assistant telling this visitor what to do with their own money. */
const DIRECTIVE_ADVICE: readonly RegExp[] = [
  /\byou should (?:definitely |really |probably )?(?:buy|sell|invest in|put (?:your|the) money (?:in|into)|max out|cash out|withdraw|open an?|contribute)\b/i,
  /\bI(?:'d| would)? (?:recommend|suggest|advise) (?:that )?you (?:buy|sell|invest|put|max|cash|withdraw|open|contribute)\b/i,
  /\bmy (?:advice|recommendation) (?:is|would be)\b/i,
  /\b(?:the )?best (?:option|choice|account|investment) for you is\b/i,
];

/** Returns the pattern that tripped, or null. Cheap, and never throws. */
export function scanAnswer(answer: string): GuardPattern | null {
  for (const pattern of DIRECTIVE_ADVICE) {
    if (pattern.test(answer)) return 'directive-advice';
  }
  return null;
}

/** What the visitor sees. Neutral, and it still offers a way forward. */
export const GUARD_MESSAGE =
  "Sorry, that is one I can't help with here. Corie can talk it through with you in a complimentary discovery consultation: use the booking form on this page or email corie@delcarmen.ca.";
