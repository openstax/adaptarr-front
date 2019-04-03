### Localization file for the user interface.



## Screens - book view
##
## Detailed structure of a book with the ability to edit it.

# View title.
#
# Variables:
# - $title (string): book's title
book-view-title = { $title }

# Alternative title for while book is still loading.
book-view-title-loading = Ładowanie

book-add-group = Grupa

book-remove-group = Grupa

book-change-group-title = Edytuj

book-add-module = Moduł

book-remove-module = Moduł

book-assign-user = Przypisz użytkownika

book-assign-different-user = Przypisz innego użytkownika

book-unassign-user = Cofnij przypisanie

# Alert displayed when book could not be downloaded.
#
# Variables:
# - $title (string): book's title
# - $details (string): description of the error
book-fetch-error =
  Nie udało się pobrać danych dla: { $title }. Szczegóły: { $details }



## Screens - book view - module removal dialog

book-remove-module-title = Jesteś pewien, że chcesz usunąć ten moduł?

book-remove-module-confirm = Usuń

book-remove-module-cancel = Anuluj

# Alert displayed when a module was removed.
#
# Variables:
# - $title (string): module's title
book-remove-module-alert-success = Moduł { $title } został usunięty.



## Screens - book view - user assignment dialog

book-assign-user-title = Wybierz użytkownika z listy, aby go przypisać.

# Alert displayed when a user was assigned to a module.
#
# Variables:
# - $user (string): user's name
# - $module (string): module's title
book-assign-user-alert-success = { $user } został/a przypisany do { $module }.

book-assign-user-alert-error = Błędny użytkownik lub moduł.

# Alert displayed when a user was unassigned from a module.
#
# Variables:
# - $module (string): module's title
book-unassign-user-alert-success = Użytkownik został usunięty z { $module }



## Screens - book view - “Edit book” dialog

book-edit-dialog-title = Edytuj książkę.

# Placeholder text for title field.
book-edit-title =
  .placeholder = Tytuł książki

book-edit-submit =
  .value = Potwierdź

book-edit-alert-success = Książka została zaktualizowana.



## Screens - book view - reordering parts

book-part-moving-locked = Przenoszenie modułów jest zablokowane.

book-part-moving-unlocked = Teraz możesz przenosić moduły.

# Alert displayed when a module or a group was moved to a different location.
#
# Variables:
# - $item (string): title of the module or thee group that was moved
# - $target (string): title of the group into which it was moved
book-part-moving-alert-success = { $item } został przeniesiony do { $target }.



## Screens - book view - add group dialog

book-add-group-dialog-title = Podaj nazwę rozdziału.

book-add-group-title =
  .placeholder = Tytuł

book-add-group-confirm =
  .value = Potwierdź

book-add-group-cancel = Anuluj

book-add-group-alert-success = Nowa grupa została dodana.



## Screens - book view - remove group dialog

book-remove-group-dialog-title = Usunąć tę grupę wraz ze wszystkimi modułami?

book-remove-group-confirm = Usuń

book-remove-group-cancel = Anuluj

# Alert displayed when a group was removed.
#
# Variables:
# - $title (string): group's title
book-remove-group-alert-success = Grupa { $title } została usunięta.



## Screens - book view - change group title dialog

book-group-change-title-dialog-title = Zmień nazwę rozdziału.

# Placeholder text for group title
book-group-change-title-value =
  .placeholder = Nowy tytuł

book-group-change-title-confirm =
  .value = Potwierdź

book-group-change-title-cancel = Anuluj

# Alert displayed when group's title was changed.
#
# Variables:
# - $from (string): old title
# - $to (string): new title
book-group-change-title-alert-success =
  Nazwa grupy została zmieniona z { $from } na { $to }.



## Screens book view - add module to a group

book-group-add-module-dialog-title = Wybierz moduł lub utwórz nowy.

# Alert displayed when module was added to a group.
#
# Variables:
# - $title (string): module's title
book-group-add-module-alert-success = { $title } został dodany do grupy.



## Screens - list of books

book-list-view-title = Książki

book-list-empty = Nie znaleziono żadnych książek.



## Screens - list of books - book deletion dialog

# Dialog's title.
#
# Variables:
# - $title (string): title of the book to be deleted
book-delete-title = Na pewno chcesz usunąć { $title }?

book-delete-confirm = Potwierdź

book-delete-cancel = Anuluj

# Alert displayed when a book was deleted.
book-delete-alert-success = Książka została usunięta.



## Screens - list of books - adding book dialog

book-list-add-book-dialog-title = Dodaj nową książkę.

# Placeholder text for book title.
book-list-add-book-title =
  .placeholder = Tytuł książki

book-list-add-book-confirm =
  .value = Potwierdź

# Alert displayed when a book was created.
book-list-add-book-alert-success = Książka została dodana.



## Screens - dashboard

dashboard-view-title = Panel główny

dashboard-section-assigned = Przypisane do Ciebie:

dashboard-assigned-view-draft = Zobacz szkic

dashboard-assigned-new-draft = Nowy szkic

dashboard-assigned-view-module = Zobacz moduł

dashboard-assigned-empty = Żaden moduł nie jest do Ciebie przypisany.

dashboard-assigned-section-not-assigned = Nie przypisano do żadnej książki

dashboard-section-drafts = Twoje szkice:

dashboard-drafts-section-not-assigned = Nie przypisano do żadnej książki

dashboard-drafts-view = Zobacz szkic

dashboard-drafts-delete = Usuń

dashboard-drafts-empty = Nie posiadasz żadnych szkiców.

# Alert displayed when draft of a module was created.
dashboard-create-draft-alert-success = Szkic został utworzony.



## Screens - dashboard - draft deletion dialog

dashboard-delete-draft-dialog-title = Jesteś pewien, że chcesz usunąć szkic { $title }?

dashboard-delete-draft-confirm = Usuń

dashboard-delete-draft-cancel = Anuluj

# Alert displayed when a draft was deleted.
dashboard-delete-draft-alert-success = Szkic został usunięty.



## Screens - invitations

invitation-view-title = Zaproś nowego użytkownika

# Placeholder text for email address
invitation-email =
  .placeholder = Adres e-mail

invitation-email-validation-invalid = To nie jest poprawny adres e-mail.

invitation-send =
  .value = Wyślij zaproszenie

# Alert displayed when an invitation was sent to a user.
#
# Variables:
# - $email (string): email address to which the invitation was sent.
invitation-send-alert-success = Zaproszenie wysłane do { $email }



## Screens - module view
##
## Preview of a module. Can be displayed either standalone or as part of book
## view.

# View title.
#
# Variables:
# - $title (string): module's title
module-view-title = { $title }

module-go-to = Przejdź do modułu

module-assignee = Przypisany:

module-create-draft = Nowy szkic

module-open-draft = Zobacz szkic

# Alert displayed when draft of a module was created.
module-create-draft-alert-success = Szkic został utworzony.



## Screens - notification centre

notification-centre-view-title = Powiadomienia

notification-centre-empty = Nie masz żadnych powiadomień.



## Screens - user's profile

# Title displayed when viewing user's own profile.
user-profile-view-title-your = Twój profil

# Title displayed when viewing another user's profile.
#
# Variables:
# - $name (string): user's name
user-profile-view-title-named = Profil { $name }

user-profile-section-team = Twój zespół

user-profile-section-bio = Bio:

user-profile-section-contact = Kontakt

# Placeholder text for team search box.
user-profile-team-list-search =
  .placeholder = Szukaj użytkownika



## Screens - user's profile - update dialog

user-profile-update-avatar-title = Wgraj swoje zdjęcie.

user-profile-update-name-title = Zaktualizuj swoją nazwę.

# Placeholder text for name input.
user-profile-update-name =
  .placeholder = Imię

user-profile-update-confirm = Potwierdź

# Message displayed below name input when it has fewer than three characters.
user-profile-name-validation-error = Imię musi mieć minimum 3 znaki.



## Screens - resources

resources-view-title = Zasoby



## Screens - settings

settings-view-title = Ustawienia

settings-section-language = Zmień język

settings-section-password = Zmień hasło

# Placeholder text for old password input
settings-value-old-password =
  .placeholder = Stare hasło

# Placeholder text for new password input
settings-value-new-password =
  .placeholder = Nowe hasło

# Placeholder text for new password repetition
settings-value-new-password-repeat =
  .placeholder = Powtórz nowe hasło

# Message displayed below new password when it has invalid length.
settings-validation-password-bad-length = Hasło musi mieć od 6 do 12 znaków.

# Message displayed below new password repetition when it doesn't match
# new password.
settings-validation-password-no-match = Hasła muszą być takie same.

settings-password-change =
  .value = Potwierdź

# Alert displayed when password was changed.
settings-change-password-alert-success = Hasło zostało zmienione.

# Alert displayed when password could not be changed.
settings-change-password-alert-error = Hasło nie zostało zmienione.



## Screens - settings - language change dialog

settings-language-dialog-title = Jesteś pewien, że chcesz zmienić język?

settings-language-dialog-confirm = Potwierdź

settings-language-dialog-cancel = Anuluj



## Reusable components - navigation and side menu
##
## This component is displayed at all times and provides easy access to primary
## screens.

navigation-title = Menu

navigation-dashboard = Panel główny

navigation-notifications = Powiadomienia

navigation-notifications-show-all = Pokaż wszystkie

navigation-books = Książki

navigation-resources = Zasoby

navigation-profile = Twój profil

navigation-settings = Ustawienia

navigation-logout = Wyloguj

navigation-invite = Zaproszenia



## Reusable components - list of assets

# Button for adding new assets (files).
asset-list-add-media = Dodaj



## Reusable components - notifications

# Text of a notification.
#
# Variables:
# - $kind (string): what kind of notification is this. Possible values are
#   'assigned'.
#
# Variables ($kind = assigned):
# - $actor (string): name of the user who assigned $module to recipient
# - $module (string): title of the module which was assigned
#
# Fragments ($kind = assigned):
# - <actor> ... </actor>: link to actor's profile
# - <module> ... </module>: link to the assigned module
notification = { $kind ->
  [assigned]
    <actor>{ $actor }</actor> przypisał/a Cię do <module>{ $module }</module>
 *[notavalidkind] Nieznana akcja
}



## Reusable components - file upload

file-upload-select-files = Upuść pliki lub kliknij, aby dodać (opcjonalnie).

file-upload-remove-all = Usuń wszystkie pliki



## Reusable components - list of modules

# Placeholder text for search box
module-list-search-box =
  .placeholder = Szukaj modułu



## Reusable components - list of modules - new module dialog

# Placeholder text for module's title
module-list-add-module-title =
  .placeholder = Tytuł

module-list-add-module-submit =
  .value = Dodaj nowy

# Alert displayed when a module was created.
#
# Variables:
# - $title (string): new module's title
module-list-add-module-alert-success = Moduł { $title } został dodany.



## Reusable components - list of modules - module deletion dialog

module-list-delete-module-title = Usunięcie modułu jest nieodwracalne.

module-list-delete-module-confirm = Usuń

module-list-delete-module-cancel = Anuluj

# Alert displayed when a module was deleted.
#
# Variables:
# - $title (string): module's title
module-list-delete-module-alert-success = { $title } został usunięty.



## Reusable components - chat and message input

message-input-textarea =
  .placeholder = Napisz swoją wiadomość...

message-input-send = Wyślij

message-input-alert-select-user-error =
  Coś poszło nie tak podczas wybierania użytkownika.



## Reusable components - reference target

# Variables:
# - $label (string): string that would be used to refer to this target in text
reference-target = { $label }

# Variables:
# - $label (string): string that would be used to refer to this target in text
# - $description (string)
reference-target-description = { $label }: { $description }



## Reusable components - list of reference targets

# Variables:
# - $type (string)
reference-targets-category = { $type ->
  [example] Przykłady
  [exercise] Ćwiczenia
  [figure] Figury
  [important] Ważne
  [note] Notki
  [tip] Uwagi
  [warning] Ostrzeżenia
 *[notavalidtype] { $type }
}



## Reusable components - list of reference targets

reference-target-list-go-back = Wstecz

reference-target-list-tab-local = Ten dokument

reference-target-list-tab-remote = Inne dokumenty

reference-target-list-tab-remote-not-assigned = Nie przypisany do żadnej książki



## Editor - document title

# Placeholder text for document title
editor-document-title-value =
  .placeholder = Tytuł szkicu

# Alert displayed when document title was changed.
editor-document-title-save-alert-success = Tytuł został zmieniony.

# Alert displayed when document title could not be changed.
editor-document-title-save-alert-error = Nie udało się zmienić tytułu.



## Editor - toolboxes

editor-toolbox-no-selection = Brak zaznaczenia

editor-toolbox-multi-selection = Zaznaczanie wielu elementów nie jest jeszcze
  wspierane



## Editor - toolboxes - save

editor-tools-save = Zapisz

# Alert displayed when document was saved.
editor-tools-save-alert-success = Szkic został zapisany.

# Alert displayed when document could not be saved.
editor-tools-save-alert-error = Nie udało się zapisać szkicu.



## Editor - toolboxes - merge

editor-tools-merge = Zjednocz

# Alert displayed when draft was merged into source module.
editor-tools-merge-alert-success = Zjednoczono.

# Alert displayed when draft could not be merged.
editor-tools-merge-alert-error = Nie udało się zjednoczyć.



## Editor toolboxes - admonitions

editor-tools-admonition-title = Admonition

# Entry on the list of possible admonition types.
#
# Variables:
# - $type (string): admonition's type. Possible values are 'note', 'warning',
#   'tip', and 'important'.
editor-tools-admonition-type = { $type ->
 *[note] Notka
  [important] Ważne
  [tip] Uwaga
  [warning] Ostrzeżenie
}



## Editor toolboxes - document settings

editor-tools-document-title = Dokument



## Editor toolboxes - exercises

editor-tools-exercise-title = Ćwiczenie

editor-tools-exercise-insert-solution = Dodaj rozwiązanie

editor-tools-exercise-insert-commentary = Dodaj komentarz



## Editor toolboxes - text formatting

# Entry on the list of possible text types.
#
# Variables:
# - $type (string): text type. Possible values include 'paragraph', 'title',
#   and 'figure_caption', but other values are also allowed.
editor-tools-format-text-type = { $type ->
  [paragraph] Akapit
  [title] Tytuł
  [figure_caption] Opis figury
 *[notavalidtype] Tekst
}

editor-tools-format-button-clear =
  .title = Usuń formatowanie

editor-tools-format-button-emphasis =
  .title = Wyróżnienie

editor-tools-format-button-list =
  .title = Lista

editor-tools-format-button-strong =
  .title = Wytłuszczenie

editor-tools-format-button-subscript =
  .title = Indeks dolny

editor-tools-format-button-superscript =
  .title = Indeks górny

editor-tools-format-button-underline =
  .title = Podkreślenie



## Editor toolboxes - figures

editor-tools-figure-title = Figura

editor-tools-figure-add-subfigure = Dodaj podfigurę

editor-tools-figure-remove-subfigure = Usuń podfigurę

editor-tools-figure-add-caption = Dodaj opis



## Editor toolboxes - insertion tools

editor-tools-insert-title = Wstaw

editor-tools-insert-reference = Odnośnik

editor-tools-insert-admonition = Admonition

editor-tools-insert-exercise = Ćwiczenie

editor-tools-insert-figure = Figura

editor-tools-insert-section = Sekcja



## Editor toolboxes - lists

editor-tools-list-title = Lista

editor-tools-list-decrease-level = Zmniejsz zagłębienie

editor-tools-list-increase-level = Zwiększ zagłębienie

# Entry on the list of possible list styles.
#
# Variables:
# - $style (string): list style. Possible values are 'ol_list' and 'ul_list'.
editor-tools-list-style = { $style ->
 *[ol_list] Cyfry arabskie
  [ul_list] Wypunktowanie
}



## Editor toolboxes - references

editor-tools-xref-title = Odnośnik

editor-tools-xref-case = Wybierz przypadek

editor-tools-xref-change = Wybierz cel

editor-tools-xref-hover-tooltip = Kliknij z wciśniętym klawiszem control aby
  przejść do elementu docelowego

# Text to display when target of a local (in document) reference doesn't exist.
editor-tools-xref-label-local-reference-missing =
  (element docelowy nie istnieje)

# Text to display while remote (outside of a document) references have not been
# loaded yet.
editor-tools-xref-label-remote-loading = (ładowanie danych)

# Text to display when target of a remote (outside of a document) reference
# doesn't exist.
editor-tools-xref-label-remote-reference-missing =
  (element docelowy nie istnieje)

# Entry on the list of possible grammatical cases.
#
# Note that this list doesn't contain all cases, only ones for which we found
# enough information.
#
# Variables:
# - $case (string): grammatical case. Only values listed here are allowed, any
#   other value should be treated as 'nominative'.
#
# XXX: I don't know how to translate few cases:
# - adverbial: The only Polish Wikipedia page to feature it gives it's English
#   name (adverbial), with “essivus“ (essive) in parenthesis.
# - aversive
# - benefactive: This case is mentioned in article on Quechuan, but no name
#   is given.
# - intrative
# - ornative: According to English Wikipedia this case is found in Hungarian,
#   but Polish page for Hungarian doesn't list any case that would match.
# - pegative
# - pertingent
# - postessive
# - subessive
#
# Additionally Polish Wikipedia lists three cases for which I found
# no equivalent in English:
# - Disjunctivus
# - Passivus: description is analogous to the English description of
#   the intransitive case
# - Prosecutivus
editor-tools-xref-grammatical-case = { $case ->
  [abessive] Abessivus
  [ablative] Ablatyw (ablativus)
  [absolutive] Absolutyw (absolutivus)
  [accusative] Biernik (accusativus)
  [adessive] Adessivus
  [adverbial] Adverbial
  [allative] Allatyw (allativus)
  [aversive] Aversive
  [benefactive] Benefactive
  [causal] Causalis
  [causal-final] Causalis-finalis
  [comitative] Comitativus
  [comparative] Comparativus
  [dative] Celownik (dativus)
  [delative] Delativus
  [distributive] Distributivus
  [distributive-temporal] Distributivus-temporalis
  [egressive] Egressivus
  [elative] Elativus
  [equative] Aequativus
  [ergative] Ergatyw (ergativus)
  [ergative-genitive] Ergativus-genitivus
  [essive] Essivus
  [essive-formal] Essivus-formalis
  [essive-modal] Essivus-modalis
  [exessive] Exessivus
  [formal] Formalis
  [genitive] Dopełniacz (genitivus)
  [illative] Illativus
  [inessive] Inessivus
  [instructive] Instructivus
  [instrumental] Narzędnik (Instrumentalis)
  [instrumental-comitative] Instrumentalis-comitativus
  [intransitive] Intransitivus
  [intrative] Intrative
  [lative] Lativus
  [locative] Miejscownik (Locativus)
 *[nominative] Mianownik (Nominativus)
  [objective] Objectivus
  [oblique] Obliquus
  [ornative] Ornative
  [partitive] Partitivus
  [pegative] Pegative
  [perlative] Vialis
  [pertingent] Pertingent
  [possessive] Possessivus
  [postessive] Postessive
  [prepositional] Prepositionalis
  [privative] Privativus
  [prolative] Prolativus
  [sociative] Sociativus
  [subessive] Subessive
  [sublative] Sublativus
  [superssive] Superessivus
  [temporal] Temporalis
  [terminative] Terminativus
  [translative] Translativus
  [vocative] Wołacz (vocativus)
}

## Editor toolboxes - sections

editor-tools-sections-title = Sekcja

editor-tools-sections-increase-depth =  Zwiększ zagłębienie sekcji

editor-tools-sections-decrease-depth =  Zmniejsz zagłębienie sekcji 
