export * from './Logger'

export const nameToSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-')
}
