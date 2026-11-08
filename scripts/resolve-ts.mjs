/**
 * 讓 node --experimental-strip-types 能解析程式裡沒有副檔名的相對匯入。
 * 只給 scripts/check-rules.ts 用，不影響 Next.js。
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      return nextResolve(specifier, context);
    }
  }
  return nextResolve(specifier, context);
}
