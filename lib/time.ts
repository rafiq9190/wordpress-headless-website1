import { cacheLife } from "next/cache";

/**
 * The current year, read inside a cache scope.
 *
 * Under `cacheComponents`, reading the clock during render marks the whole
 * route dynamic and Next errors unless it sits behind a cache or a Suspense
 * boundary. A footer copyright line is not worth making the layout dynamic, so
 * the value is cached for a day instead.
 */
export async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
