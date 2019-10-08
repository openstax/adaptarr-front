export default function mimeToRegExp(pattern: string): RegExp {
  const pattern2exp = (pattern: string) => pattern.replace('*', '.*')

  return RegExp(
    pattern
      .split(',')
      .map(pattern2exp)
      .join('|'))
}
