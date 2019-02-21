import { negotiateLanguages } from 'fluent-langneg/compat';
import { FluentBundle } from 'fluent/compat';

// XXX: Temporarily until we implement loading resources.
const MESSAGES_ALL = {
  'fr': 'hello = Salut le monde !',
  'en-US': 'hello = Hello, world!',
  'pl': 'hello = Witaj świecie!'
};

export function* generateBundles(userLocales: ReadonlyArray<string>) {
  // Choose locales that are best for the user.
  const currentLocales = negotiateLanguages(
    userLocales,
    ['fr', 'en-US', 'pl'],
    { defaultLocale: 'en-US' }
  );

  for (const locale of currentLocales) {
    const bundle = new FluentBundle(locale);
    bundle.addMessages(MESSAGES_ALL[locale]);
    yield bundle;
  }
}

// XXX: Temporarily for type checking while we remove the rest of i18next.
export default {
  t(...args: any[]) { return 'TEST' },
}
