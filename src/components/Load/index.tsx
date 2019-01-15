import * as React from 'react'

import Spinner from 'src/components/Spinner'

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
 * @param Handler  component responsible for displaying errors
 * @param Progress component responsible for displaying progress indicator
 */
export default <Args extends {}, Value extends {}> (
  loader: Loader<Args, Value>,
  Handler: Handler = DefaultHandler,
  Progress: React.ComponentType = Spinner,
) => <Props extends {}> (
  Component: React.ComponentType<Props & Value>,
) => class Load extends React.Component<Args & Props> {
  static displayName = `Load(${Component.displayName || Component.name})`

  state: {
    value?: Value
    error?: Error
  } = {}

  async componentDidMount() {
    try {
      const value = await loader(this.props)
      this.setState({ value })
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { value, error } = this.state

    if (error) return <Handler error={error} />

    if (value) return <Component {...this.props} {...value} />

    return <Progress />
  }
}

function DefaultHandler({ error }: { error: Error }) {
  return <div className="load-error">
    {error.toString()}
  </div>
}
