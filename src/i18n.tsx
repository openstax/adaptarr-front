import * as React from 'react'
import { negotiateLanguages } from 'fluent-langneg/compat';
import { FluentBundle } from 'fluent/compat';
import { LocalizationProvider } from 'fluent-react/compat';
import { connect } from 'react-redux'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { setAvailableLocales } from 'src/store/actions/app'

import Load from 'src/components/Load'

export const MANIFEST = fetch('/locale/manifest.json')
  .then(rsp => rsp.json())
  .then(manifest => {
    console.log('locale manifest:', manifest)
    store.dispatch(setAvailableLocales(manifest.available.application))
    return manifest
  })

const mapStateToProps = ({ app }: State) => ({ locale: app.locale })

async function loader(
  { locale }: { locale: string[] },
): Promise<{ bundles: FluentBundle[] }> {
  const manifest = await MANIFEST

  const languages = negotiateLanguages(
    locale,
    manifest.available.application,
    { defaultLocale: manifest.default },
  )

  console.log('negotiated languages:', languages)

  const bundles = await Promise.all(languages.map(async language => {
    const rsp = await fetch(`/locale/${language}/ui.ftl`)
    const bundle = new FluentBundle(language)
    bundle.addMessages(await rsp.text())
    return bundle
  }))

  return { bundles }
}

type Props = {
  bundles: FluentBundle[],
}

class LocalizationLoader extends React.Component<Props> {
  render() {
    const { bundles, children } = this.props

    return <LocalizationProvider bundles={bundles.values()}>
      {children}
    </LocalizationProvider>
  }
}

export default connect(mapStateToProps)(Load(loader, ['locale'])<{}>(LocalizationLoader))
