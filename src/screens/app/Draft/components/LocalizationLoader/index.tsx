import * as React from 'react'
import * as PropTypes from 'prop-types'
import { FluentBundle } from 'fluent/compat'
import { negotiateLanguages } from 'fluent-langneg/compat';
import { LocalizationProvider, ReactLocalization } from 'fluent-react/compat'

import { MANIFEST } from 'src/l10n'

import Load from 'src/components/Load'

type Props = {
  locale: string,
  bundles: FluentBundle[],
  languages: string[],
  children: React.ReactNode,
}

async function loader(
  { locale }: { locale: string },
): Promise<{ bundles: FluentBundle[], languages: string[] }> {
  const manifest = await MANIFEST

  const languages = negotiateLanguages(
    [locale],
    manifest.available.application,
    { defaultLocale: manifest.default },
  )

  const bundles = await Promise.all(languages.map(async language => {
    const rsp = await fetch(`/locale/${language}/document.ftl`)
    const bundle = new FluentBundle(language)
    bundle.addMessages(await rsp.text())
    return bundle
  }))

  return { bundles, languages }
}

class LocalizationLoader extends React.Component<Props> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  static childContextTypes = {
    uiL10n: PropTypes.instanceOf(ReactLocalization),
  }

  getChildContext() {
    return { uiL10n: this.context.l10n }
  }

  render() {
    const { children, bundles } = this.props

    return <LocalizationProvider bundles={bundles.values()}>
      {children}
    </LocalizationProvider>
  }
}

export default Load(loader, ['locale'])<{}>(LocalizationLoader)
