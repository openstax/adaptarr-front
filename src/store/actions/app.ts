import { SET_LOCALE, SET_AVAILABLE_LOCALES } from 'src/store/constants'

export interface SetLocale {
    type: SET_LOCALE,
    data: string[],
}

export interface SetAvailableLocales {
    type: SET_AVAILABLE_LOCALES,
    data: string[],
}

export type AppAction = SetLocale | SetAvailableLocales

export const setLocale = (locale: string[]): SetLocale => ({
    type: SET_LOCALE,
    data: locale,
})

export const setAvailableLocales = (locales: string[]): SetAvailableLocales => ({
    type: SET_AVAILABLE_LOCALES,
    data: locales,
})
