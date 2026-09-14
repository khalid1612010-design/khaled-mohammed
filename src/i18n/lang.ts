import "server-only";
import { cookies } from "next/headers";
import { STRINGS, type Lang } from "./strings";

export const LANG_COOKIE = "lang";

/** Server-side: read the chosen language from the cookie. */
export async function getLang(): Promise<{ lang: Lang; ar: boolean; s: typeof STRINGS["en"] }> {
  const store = await cookies();
  const v = store.get(LANG_COOKIE)?.value;
  const lang: Lang = v === "ar" ? "ar" : "en";
  return { lang, ar: lang === "ar", s: STRINGS[lang] };
}
