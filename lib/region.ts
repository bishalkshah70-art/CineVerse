import { cookies } from "next/headers";
import { defaultLanguage, defaultRegion } from "./tmdb/client";

export const REGION_COOKIE = "cv-region";
export const LANG_COOKIE = "cv-lang";

export async function getViewerContext() {
  const jar = await cookies();
  const region = (jar.get(REGION_COOKIE)?.value || defaultRegion()).toUpperCase();
  const language = jar.get(LANG_COOKIE)?.value || defaultLanguage();
  return { region, language };
}
