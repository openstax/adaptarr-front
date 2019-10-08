type Format = 'iso' | 'i18n'

const getCurrentLng = (format: Format = 'i18n') => {
  const currentLng: string | null = localStorage.getItem('i18nextLng')
  const defaultLng= { iso: 'en', i18n: 'en-US' }

  if (!currentLng) return defaultLng[format]

  switch (format) {
  case 'iso':
    return currentLng.split('-')[0]

  default:
    return currentLng
  }
}

export default getCurrentLng
