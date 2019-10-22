import * as React from 'react'
import { negotiateLanguages } from 'fluent-langneg/compat'
import { FluentBundle } from 'fluent/compat'
import { LocalizationProvider } from 'fluent-react/compat'
import { connect } from 'react-redux'

import store from 'src/store'
import User from 'src/api/user'
import { State } from 'src/store/reducers'
import { setAvailableLocales, setLocale } from 'src/store/actions/app'

import Load from 'src/components/Load'

export const MANIFEST = fetch('/locale/manifest.json')
  .then(rsp => rsp.json())
  .then(manifest => {
    store.dispatch(setAvailableLocales(manifest.available.application))
    return manifest
  })

const mapStateToProps = ({ app }: State) => ({ locale: app.locale })

async function loader(
  { locale }: { locale: string[]},
): Promise<{ bundles: FluentBundle[] }> {
  const user = await User.me()
  if (user && user.language !== locale[0]) {
    store.dispatch(setLocale([user.language]))
  }

  const manifest = await MANIFEST

  const languages = negotiateLanguages(
    locale,
    manifest.available.application,
    { defaultLocale: manifest.default },
  ).filter(lang => lang)

  const bundles = await Promise.all(languages.map(async language => {
    const rsp = await fetch(`/locale/${language}/ui.ftl`)
    const bundle = new FluentBundle(language)
    bundle.addMessages(await rsp.text())
    return bundle
  }))

  return { bundles }
}

interface LocalizationLoaderProps {
  bundles: FluentBundle[]
  children: React.ReactNode
}

const LocalizationLoader = (
  { bundles, children }: LocalizationLoaderProps
) => <LocalizationProvider bundles={bundles.values()}>
  {children}
</LocalizationProvider>

export default connect(mapStateToProps)(Load(loader, ['locale'])<{}>(LocalizationLoader))
