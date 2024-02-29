import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'

export interface ReplaceTarget {
  from: string | RegExp
  to: string
}

export interface UnpluginReplaceOptions {
  include: FilterPattern
  exclude: FilterPattern
  targets: ReplaceTarget[]
}

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

export default createUnplugin<Partial<UnpluginReplaceOptions> | ReplaceTarget[]>((options = {}) => {
  if (Array.isArray(options))
    options = { targets: options }

  if (!options.targets)
    options.targets = []

  const filter = createFilter(
    toArray(options.include as string[] || []).length
      ? options.include
      : defaultIncludes,
    options.exclude || defaultExcludes,
  )

  return {
    name: 'replace',
    enforce: 'post',
    transformInclude(id) {
      return filter(id)
    },
    transform(code) {
      if (Array.isArray(options))
        return

      const s = new MagicString(code)

      options.targets?.forEach(({ from, to }) => {
        s.replace(from, to)
      })

      if (!s.hasChanged())
        return

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
  }
})
