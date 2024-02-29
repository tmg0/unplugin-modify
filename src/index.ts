import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'

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
  }
})
