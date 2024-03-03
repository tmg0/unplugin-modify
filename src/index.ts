import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'

export interface ModifyPatterns {
  from: string | RegExp
  to: string
}

export interface UnpluginModifyOptions {
  include: FilterPattern
  exclude: FilterPattern
  patterns: ModifyPatterns[]
}

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]
const isString = (x: any): x is string => typeof x === 'string'

export default createUnplugin<Partial<UnpluginModifyOptions> | ModifyPatterns[]>((options = {}) => {
  if (Array.isArray(options))
    options = { patterns: options }

  if (!options.patterns)
    options.patterns = []

  const filter = createFilter(
    toArray(options.include as string[] || []).length
      ? options.include
      : defaultIncludes,
    options.exclude || defaultExcludes,
  )

  return {
    name: 'modify',
    enforce: 'post',
    transformInclude(id) {
      return filter(id)
    },
    transform(code) {
      if (Array.isArray(options))
        return

      const s = new MagicString(code)

      options.patterns?.forEach(({ from, to }) => {
        if (isString(from))
          from = new RegExp(from, 'g')
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
