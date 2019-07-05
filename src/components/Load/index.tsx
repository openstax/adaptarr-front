import * as React from 'react'
import * as Sentry from '@sentry/browser'
import { Localized } from 'fluent-react/compat'

import Spinner from 'src/components/Spinner'

import './index.css'

/**
 * Function responsible for loading content.
 *
 * @param props props passed to {@link Load}.
 *
 * @return object to be merged into `props` before they are passed to the
 * component proper.
 */
type Loader<P, T> = (props: P) => Promise<T>;

/**
 * Component responsible for displaying error messages.
 */
type Handler = React.ComponentType<{ error: Error }>;

/**
 * A higher order component providing error-handling and displaying logic for
 * fetching data.
 *
 * @param loader   function responsible for loading props
 * @param propsToCompare   array of props to compare inside componentDidUpdate
 * @param l10nId   Id of translated loading message
 * @param Handler  component responsible for displaying errors
 * @param Progress component responsible for displaying progress indicator
 */
export default <Args extends {}, Value extends {}> (
  loader: Loader<Args, Value>,
  propsToCompare: string[] = [],
  l10nId?: string,
  Handler: Handler = DefaultHandler,
  Progress: React.ComponentType<{l10nId?: string}> = Spinner,
) => <Props extends {}> (
  Component: React.ComponentType<Props & Value>,
) => class Load extends React.Component<Args & Props> {
  static displayName = `Load(${Component.displayName || Component.name})`

  state: {
    value?: Value
    error?: Error
  } = {}

  async fetchData() {
    try {
      const value = await loader(this.props)
      this.setState({ value })
    } catch (error) {
      this.setState({ error })
      Sentry.captureException(error)
    }
  }

  componentDidUpdate(prevProps: { [key: string]: any }) {
    const update = propsToCompare.some(name => {
      if (prevProps[name] !== this.props[name]) {
        return true
      }
      return false
    })

    if (update) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const { value, error } = this.state

    if (error) return <Handler error={error} />

    if (value) return <Component {...this.props} {...value} />

    return <Progress l10nId={l10nId} />
  }
}

function DefaultHandler({ error }: { error: Error }) {
  return (
    <div className="load-error">
      <Localized id="load-error-message" p={<p/>}>
        <div className="load-error__message"></div>
      </Localized>
      <div className="load-error__content">
        {error.toString()}
      </div>
    </div>
  )
}
