import * as React from 'react'
import * as PropTypes from 'prop-types'
import { ReactLocalization } from 'fluent-react/compat'
import { Editor } from 'slate'
import { EditorProps, Plugin } from 'slate-react'

import LocalizationLoader from '../../components/LocalizationLoader'
import Toolbox from '../../components/Toolbox'

const UIPlugin: Plugin | any = {
  renderEditor(props: EditorProps, editor: Editor, next: () => any) {
    return <Ui editor={editor} {...props}>
      {next()}
    </Ui>
  }
}

export default UIPlugin

type Props = EditorProps & {
  editor: Editor,
}

class Ui extends React.Component<Props> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  render() {
    const { children, value, editor } = this.props
    const { l10n } = this.context

    return (
        <LocalizationLoader locale={value.data.get('language')}>
          <>
            {children}
            <MixedLocalization l10n={l10n}>
              <Toolbox editor={editor} value={editor.value} />
            </MixedLocalization>
          </>
        </LocalizationLoader>
    )
  }
}

type MixedLocalizationProps = {
  l10n: ReactLocalization,
}

class MixedLocalization extends React.Component<MixedLocalizationProps> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  static childContextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
    documentL10n: PropTypes.instanceOf(ReactLocalization),
  }

  getChildContext() {
    return {
      l10n: this.props.l10n,
      documentL10n: this.context.l10n,
    }
  }

  render() {
    return this.props.children
  }
}
