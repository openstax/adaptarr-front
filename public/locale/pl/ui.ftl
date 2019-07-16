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

book-button-add-module = Dodaj moduł

book-button-add-group = Dodaj rozdział

book-button-remove = Usuń

# Variable:
# - $name (string): process name.
book-in-process = Proces: { $name }

book-begin-process = Rozpocznij proces

book-begin-process-title = Skonfiguruj i rozpocznij proces

book-process-preview-title = Szczegóły procesu:

book-process-cancel-title = Przerwij proces bez zapisywania zmian

book-process-cancel-button = Przerwij proces

book-process-cancel-button-cancel = Anuluj

# Alert displayed when process has been finished.
book-process-cancel-success = Pomyślnie przerwano proces.

# Alert displayed when process could not be finished.
#
# Variables:
# - $error (string): error details.
book-process-cancel-error = Coś poszło nie tak. Szczegóły: { $error }

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

book-remove-module-title = Usunąć ten moduł?

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

book-edit-dialog-title = Modyfikuj książkę

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

book-add-group-alert-success = Nowy rozdział został dodany.



## Screens - book view - remove group dialog

book-remove-group-dialog-title = Usunąć ten rozdział wraz ze wszystkimi jego modułami?

book-remove-group-confirm = Usuń

book-remove-group-cancel = Anuluj

# Alert displayed when a group was removed.
#
# Variables:
# - $title (string): group's title
book-remove-group-alert-success = Rozdział { $title } został usunięty.



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
  Nazwa rozdziału została zmieniona z { $from } na { $to }.



## Screens book view - add module to a group

book-group-add-module-dialog-title = Wybierz moduł lub utwórz nowy.

# Alert displayed when module was added to a group.
#
# Variables:
# - $title (string): module's title
book-group-add-module-alert-success = { $title } został dodany do rozdziału.



## Screens - list of books

book-list-view-title = Książki

book-list-empty = Nie znaleziono książek.



## Screens - list of books - book deletion dialog

# Dialog's title.
#
# Variables:
# - $title (string): title of the book to be deleted
book-delete-title = Usunąć książkę "{ $title }"?

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

book-list-add-book-cancel = Anuluj

# Alert displayed when a book was created.
book-list-add-book-alert-success = Książka została dodana.



## Screens - dashboard

dashboard-view-title = Panel główny

dashboard-section-assigned = Przypisane do Ciebie:

dashboard-assigned-view-draft = Zobacz szkic

dashboard-assigned-new-draft = Nowy szkic

dashboard-assigned-view-module = Zobacz moduł

dashboard-assigned-empty = Brak przypisanych tekstów

dashboard-assigned-section-not-assigned = Brak przypisanych książek

dashboard-section-drafts = Szybki dostęp do moich tekstów

dashboard-drafts-section-not-assigned = Nie przypisano do żadnej książki

dashboard-drafts-view = Zobacz szkic

dashboard-drafts-delete = Usuń

dashboard-drafts-empty = Brak tekstów do wyświetlenia

# Alert displayed when draft of a module was created.
dashboard-create-draft-alert-success = Szkic został utworzony.

dashboard-section-free-slots = Wolne funkcje do podjęcia


## Screens - draft

draft-style-switcher-title = Wybierz styl, w którym chcesz wyświetlić ten dokument

# Variables:
# - $style (string): version of styles.
draft-style-switcher = { $style ->
 *[default] Style domyślne
  [webview] Style wersji online
  [pdf] Style wersji PDF
}

draft-style-switcher-info-box = Widok roboczy. Niektóre element w ostatecznej wersji
  podręcznika będą wyświetlane inaczej.

draft-loading-message = Ładowanie wersji roboczej może potrwać nawet kilka minut.

draft-remove-glossary-dialog = Usunąć skorowidz?

draft-add-glossary = Dodaj skorowidz

draft-remove-glossary = Usuń

draft-cancel = Anuluj



## Screens - dashboard - draft deletion dialog

dashboard-delete-draft-dialog-title = Usunąć szkic "{ $title }"?

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

# Alert displayed if error occurs when sending invitation.
#
# Variables:
# - $details (string): error details.
invitation-send-alert-error = Coś poszło nie tak. Szczegóły: { $details }



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

notification-centre-empty = Brak nowych powiadomień.



## Screens - user's profile

# Title displayed when viewing user's own profile.
user-profile-view-title-your = Mój profil

# Title displayed when viewing another user's profile.
#
# Variables:
# - $name (string): user's name
user-profile-view-title-named = Profil { $name }

user-profile-section-team = Mój zespół

user-profile-section-bio = Bio:

user-profile-section-contact = Kontakt

user-profile-section-role = Rola użytkownika

user-profile-role-unknown = Nieznana rola

## Variables
# $role: (string) - new role name
user-profile-role-change = Zmienić rolę użytkownikowi na: { $role }?

user-profile-role-remove = Usunąć rolę użytkownikowi?

user-profile-role-button-cancel = Anuluj

user-profile-role-button-change = Zmień

user-profile-role-button-remove = Usuń

user-profile-section-role-unassign =  Usuń rolę użytkownikowi

# Alert displayed when user's role has been changed successfully.
#
# Variables:
# - $name (string): name of role which has been assigned to user.
user-profile-change-role-success = Rola została pomyślnie zmieniona na { $name }.

# Alert displayed when error occurred when changing user's role.
#
# Variables:
# - $details (string): error details.
user-profile-change-role-error = Coś poszło nie tak. Szczegóły: { $details }.

user-profile-unassign-role-success = Pomyślnie usunięto rolę użytkownikowi.

# Alert displayed when error occurred when unassiging user from role.
#
# Variables:
# - $details (string): error details.
user-profile-unassign-role-error = Coś poszło nie tak. Szczegóły: { $details }.

user-profile-users-drafts = Teksty użytkownika

# Placeholder text for team search box.
user-profile-team-list-search =
  .placeholder = Szukaj użytkownika

user-profile-team-list-no-results = Brak wyników dla określonych kryteriów.



## Screens - user's profile - update dialog

user-profile-update-avatar-title = Wgraj swoje zdjęcie.

user-profile-update-name-title = Zaktualizuj nazwę użytkownika.

# Placeholder text for name input.
user-profile-update-name =
  .placeholder = Imię

user-profile-update-confirm = Potwierdź

# Message displayed below name input when it has fewer than three characters.
user-profile-name-validation-error = Imię musi mieć co najmniej 3 znaki.



## Screens - resources

resources-view-title = Pomocne dokumenty

resources-add-title = Dodaj nowy zasób

resources-add-folder = Dodaj folder

resources-add-file = Dodaj plik

resources-name-placeholder =
  .placeholder = Nazwa

resources-add-cancel = Anuluj

resources-add-confirm = Potwierdź

resources-add-success = Pomyślnie dodano nowy zasób

resources-add-error = Nie udało się dodać zasobu

resources-card-edit = Edytuj

resources-card-edit-title = Zaktualizuj ten zasób

resources-edit-cancel = Anuluj

resources-edit-update = Zaktualizuj

resources-edit-success = Pomyślnie zaktualizowano zasób

resources-edit-error = Nie udało się zaktualizować zasobu



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

settings-language-dialog-title = Zmienić język?

settings-language-dialog-confirm = Potwierdź

settings-language-dialog-cancel = Anuluj



## Screens - roles

role-view-title = Role

role-section-add = Dodaj nową rolę

role-section-manage = Zarządzaj rolami

role-name = Nazwa roli

role-create = Utwórz rolę

role-edit = Edycja

role-remove = Usuń

# Alert displayed when role has been created.
#
# Variables:
# - $name (string): name of role which user created.
role-create-success = Rola "{ $name }" została utworzona.

# Alert displayed when role has not been created.
#
# Variables:
# - $details (string): error details.
role-create-error = Nie udało się utworzyć roli. Szczegóły: { $details }.

# Dialog displayed when user want to delete role.
#
# Variables:
# - $name (string): name of role which user want to delete.
role-delete-title = Usunąć rolę "{ $name }"?

role-delete-confirm = Potwierdź

role-delete-cancel = Anuluj

# Alert displayed when role has been deleted.
#
# Variables:
# - $name (string): name of role which user deleted.
role-delete-success = Rola "{ $name }" została usunięta.

# Alert displayed when role has not been deleted.
#
# Variables:
# - $details (string): error details.
role-delete-error = Nie udało się usunąć roli. Szczegóły: { $details }.

# Alert displayed when role has been updated.
#
# Variables:
# - $name (string): name of role which user updated.
role-update-success = Rola "{ $name }" została zaktualizowana.

# Alert displayed when role has not been updated.
#
# Variables:
# - $details (string): error details.
role-update-error = Nie udało się zaktualizować roli. Szczegóły: { $details }.

role-update-confirm = Zaktualizuj rolę

role-update-cancel = Anuluj



## Screens - processes

processes-view-title = Zarządzanie procesami

processes-view-add = Dodaj nowy proces

processes-view-preview = Podgląd procesu

# Alert displayed when process has been created.
#
# Variables:
# - $name (string): name of process which was created.
process-create-success = Proces „{ $name }” został utworzony.

# Alert displayed when process has not been created.
#
# Variables:
# - $details (string): error details.
process-create-error = Nie udało się utworzyć procesu. Szczegóły: { $details }.

# Alert displayed when name of process has been updated.
process-update-name-success = Nazwa została zaktualizowana.

# Alert displayed when name has not beed updated.
#
# Variables:
# - $details (string): error details.
process-update-name-error = Nazwa nie została zaktualizowana. Szczegóły: { $details }.

# Alert displayed when version of process has been created.
#
# Variables:
# - $name (string): name of new version which was created.
process-create-version-success = Wersja „{ $name }” została utworzona.

# Alert displayed when version has not been created.
#
# Variables:
# - $details (string): error details.
process-create-version-error = Nie udało się utworzyć nowej wersji. Szczegóły: { $details }.



## Components for creating and updating process

process-form-create = Utwórz proces

process-form-new-version = Utwórz nową wersję

process-form-cancel = Anuluj

process-form-remove = Usuń

process-form-process-name = Nazwa procesu

process-form-process-starting-step = Krok początkowy

process-form-slot-title = Lista funkcji:

process-form-slot-add = Dodaj funkcję

process-form-slot-remove = Usuń funkcję

process-form-slot-name = Nazwa funkcji:

process-form-slot-autofill = Automatycznie przypisz użytkownika:

process-form-slot-role = Role:

process-form-step-title = Lista kroków:

process-form-step-add = Dodaj krok

process-form-step-remove = Usuń krok

process-form-step-name = Nazwa kroku:

process-form-step-slots = Funkcje w kroku:

process-form-step-slots-add = Dodaj funkcję

process-form-step-links = Linki dla kroku:

process-form-step-links-add = Dodaj link

process-form-step-slot-slot = Funkcja:

process-form-step-slot-permission = Uprawnienie:

process-form-step-link-name = Nazwa linku:

process-form-step-link-to = Następny krok:

process-form-step-link-slot = Funkcja, która może używać tego linku:

process-form-step-link-remove = Usuń link

process-form-error-name = Proszę podać nazwę procesu.

process-form-error-slot-name = Wszystkie funkcje muszą posiadać nazwy.

process-form-error-step-name = Wszystkie kroki muszą posiadać nazwy.

process-form-error-step-link-name = Wszystkie linki muszą posiadać nazwy.

process-form-error-starting-step = Proszę określić krok początkowy.

process-form-error-starting-step-no-links = Krok początkowy musi posiadać linki.

process-form-error-slots-min = Proces musi zawierać przynajmniej jedną funkcję.

process-form-error-steps-min = Proces musi zawierać przynajmniej dwa kroki.

process-form-error-no-finish =
  Proces musi zawierać przynajmniej jeden krok końcowy (taki, z którego nie
  wychodzą żadne linki).

process-form-error-propose-and-no-accept =
  Krok z uprawnieniem do proponowania zmian musi linkować do kroku
  z akceptowaniem zmian.

process-form-error-accept-and-no-propose =
  Krok z uprawnieniem do akceptowania zmian musi być podlinkowany przez
  krok z uprawnieniem do proponowania zmian.

process-form-error-edit-and-changes =
  Uprawnienia do edycji oraz do sugerowania zmian nie mogą być przyznane w tym
  samym kroku.

process-form-error-step-slot-permission-or-slot =
  Każde uprawnienie musi mieć przypisaną funkcję.

process-form-error-step-link-to-or-slot =
  Każdy link musi wskazywać na krok oraz mieć przypisaną funkcję, która może go
  używać.



## Reusable components - process preview

# Variables:
# - $name (string): name of the process.
process-preview-title = Nazwa procesu: { $name }

process-preview-slots-list = Lista funkcji:

process-preview-steps-list = Lista kroków:

# Variables:
# - $name (string): name of the slot.
process-preview-slot-name = Nazwa funkcji: { $name }

# Variables:
# - $value (string): value of autofill for this slot.
process-preview-slot-autofill = Automatyczne przypisywanie użytkowników { $value ->
  [true] włączone
 *[false] wyłączone
}

# Variables:
# - $roles (string): role names for this slot.
process-preview-roles = Role: { $roles }

# Variables:
# - $name (string): name of the step.
process-preview-step-name = Nazwa kroku: { $name }

process-preview-step-slots-list = Lista funkcji dla tego kroku:

process-preview-step-links-list = Lista linków dla tego kroku:

# Variables:
# - $name (string): slot name.
# - $permission (string): permission granted to this slot.
process-preview-step-slot = { $name } może { $permission ->
  [view] oglądać szkice
  [edit] edytować szkice
  [propose-changes] proponować zmiany
  [accept-changes] akceptować zmiany
 *[notavalidvalue] { $permission }
}.

# Variables:
# - $slot (string): slot name.
# - $link (string): link name.
# - $to (string): target step name.
process-preview-step-link =
  { $slot } może używać linku „{ $link }”, który prowadzi do kroku „{ $to }”.



## Reusable components - begin process

begin-process-select-process = Wybierz proces:

begin-process-start = Rozpocznij proces

# Alert displayed when process has been started.
#
# Variables:
# - $process (string): name of process which was started.
# - $module (string): title of module for which process was started.
begin-process-success = Rozpoczęto proces „{ $process }” dla „{ $module }”.

# Alert displayed when process has not been started.
#
# Variables:
# - $details (string): error details.
begin-process-error = Nie udało się rozpocząć procesu. Szczegóły: { $details }.

begin-process-assign-user-title = Wybierz użytkownika dla danej funkcji.

begin-process-slots-title = Skonfiguruj funkcje:

begin-process-assign-user = Wybierz użytkownika

begin-process-unassign-user = Usuń użytkownika



## Reusable components - update slots

update-slots-title = Zarządzaj funkcjami w procesie:

# Variables:
# - $name (string): slot name.
# - $roles (string): role names for this slot.
update-slots-name = { $roles ->
  [undefined] { $name }
 *[roles] { $name } dla użytkowników z rolami: { $roles }
}

update-slots-assign-user = Wybierz użytkownika

update-slots-unassign-user = Cofnij przypisanie

# Variables:
# - $slot (string): slot name.
# - $roles (string): role names for this slot.
update-slots-assign-user-title = Wybierz użytkownika { $roles ->
  [undefined] dla funkcji: { $slot }
 *[roles] posiadajacego jedną z roli: { $roles } dla funkcji: { $slot }
}

# Alert displayed when there was an error while fetching data.
update-slots-fetching-error = Coś poszło nie tak podczas pobierania informacji o funkcjach w tym procesie. Spróbuj ponownie później.



## Reusable components - draft info

draft-info-main-button = Informacje o procesie

draft-info-title = Informacje o procesie dla tego szkicu

# Variables:
# - $process (string): process name which this draft follows.
draft-info-process = Proces: { $process }

# Variables:
# - $step (string): step name in current process.
draft-info-step = Aktualny krok: { $step }

draft-info-permissions = Twoje uprawnienia:

# Variables:
# - $permission (string): draft permission (view | edit | propose-changes accept-changes)
draft-info-permission = { $permission ->
  [view] oglądanie
  [edit] edycja
  [propose-changes] proponowanie zmian
  [accept-changes] akceptowanie zmian
 *[notavalidvalue] { $permission }
}



## Reusable components - free slots

free-slots-view-draft = Pokaż tekst

free-slots-not-avaible = Obecnie nie ma żadnych wolnych funkcji do objęcia.

free-slots-take-slot = Biorę to zadanie

# Alert displayed when user assign himself to a free slot.
#
# Variables:
# - $slot (string): name of slot which was taken.
# - $draft (string): draft name for which user was assigned.
free-slots-success = Zostałeś przypisany do „{ $draft }” w funkcji { $slot }.

# Alert displayed when there was an error while taking free slot.
#
# Variables:
# - $details (string): error details.
free-slots-error = Nie udało się objąć funkcji. { $details ->
 *[string] Szczegóły: { $details }.
  [none] {""}
}



## Reusable components - step changer

step-changer-main-button = Przekazuję pracę do kolejnego etapu

step-changer-choose = Wybierz link:

step-changer-move = Przenieś używając wybranego linku

# Alert displayed when draft was advanced to the next step.
#
# Variables:
# - $code (string): draft-process-advanced or draft-process-finished
step-changer-success = { $code ->
  [draft-process-advanced] Szkic został przeniesiony do następnego kroku.
  [draft-process-finished] Proces został zakończony. Zapisano szkic jako moduł.
 *[notavalidvalue] { $code }
}

# Alert displayed when there was an error while advancing to the next step.
#
# Variables:
# - $details (string): error details.
step-changer-error = Nie udało się przenieść szkicu. Szczegóły: { $details }.

step-changer-details-dialog-title = Wybierz następny krok

step-changer-confirm-dialog-title = Przenieść szkic do następnego kroku?

step-changer-unsaved-changes = Masz niezapisane zmiany.

step-changer-advance = Przenieś

step-changer-cancel = Anuluj

step-changer-discard-advance = Odrzuć zmiany i przenieś

step-changer-save-advance = Zapisz i przenieś

# Alert displayed when there was an error while saving and advancing to the next step.
#
# Variables:
# - $details (string): error details.
step-changer-save-advance-error = Nie udało się zapisać i przenieść szkicu. Szczegóły: { $details }.



## Reusable components - permissions

# Variables:
# - $name (string): name of permission.
permission-label = { $name ->
  [user-invite] Zapraszanie użytkowników
  [user-delete] Usuwanie użytkowników
  [user-edit] Edytuj profile użytkowników
  [user-edit-permissions] Edycja uprawnień użytkowników
  [user-assign-role] Przypisywanie ról do użytkowników
  [book-edit] Tworzenie, usuwanie i edycja książek
  [module-edit] Tworzenie, usuwanie i edycja modułów
  [role-edit] Tworzenie, usuwanie i edycja ról
  [editing-process-edit] Tworzenie i edycja procesów
  [editing-process-manage] Przypisywanie modułów do procesów
  [resources-manage] Zarządzanie zasobami
 *[unknown] Nieznane uprawnienie
}



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

navigation-profile = Mój profil

navigation-settings = Ustawienia

navigation-logout = Wyloguj

navigation-invite = Zaproszenia

navigation-roles = Role

navigation-processes = Procesy



## Reusable components - list of assets

# Button for adding new assets (files).
asset-list-add-media = Dodaj

# Alert for error when adding new media
#
# Variables:
# - $details (string): error message.
asset-list-add-error = Nie można dodać pliku. Szczegóły: { $details }



## Reusable components - notifications

# Text of a notification.
#
# Variables:
# - $kind (string): what kind of notification is this. Possible values are
#   'assigned', 'process_ended, 'slot_filled', 'slot_vacated', 'draft_advanced'.
#
# Variables ($kind = assigned):
# - $actor (string): name of the user who assigned $module to recipient
# - $module (string): title of the module which was assigned
#
# Fragments ($kind = assigned):
# - <actor> ... </actor>: link to actor's profile
# - <module> ... </module>: link to the assigned module
notification = { $kind ->
  [assigned] <actor>{ $actor }</actor> przypisał/a Cię do <module>{ $module }</module>
  [process_ended] Proces edycyjny dla <module>{ $module }</module> zakończył się.
  [slot_filled] Zostałeś/aś przypisany/a do funkcji w <module>{ $module }</module>.
  [slot_vacated] Zostałeś/aś usunięta z funkcji w <module>{ $module }</module>.
  [draft_advanced] Krok w <module>{ $module }</module> zmienił się.
 *[notavalidkind] Nieznana akcja
}



## Reusable components - date differences

date-diff-now = przed chwilą

# Variables:
# - $minutes (number): numbers of minutes between from and current date
date-diff-minutes = { $minutes ->
  [1] minutę temu
 *[more] { $minutes } min temu
}

# Variables:
# - $hours (number): numbers of hours between from and current date
date-diff-hours = { $hours ->
  [1] godzinę temu
 *[more] { $hours } godz. temu
}

# Variables:
# - $days (number): numbers of days between from and current date
date-diff-days = { $days ->
  [1] dzień temu
 *[more] { $days } dni temu
}



## Reusable components - file upload

file-upload-select-files = Upuść pliki lub kliknij, aby dodać (opcjonalnie).

file-upload-remove-all = Usuń wszystkie pliki

# Variables:
# - $code (number): error code for react-files component
file-upload-error = { $code ->
  [1] Niepoprawny typ pliku
  [2] Plik jest zbyt duży
  [3] Plik jest zbyt mały
  [4] Nie można już wgrać więcej plików
 *[unknowncode] Wystąpił nieznany błąd podczas ładowania pliku
}



## Reusable components - list of modules

# Placeholder text for search box
module-list-search-box =
  .placeholder = Szukaj modułu

module-list-remove = Usuń



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



## Reusable components - list of reference targets

reference-target-list-go-back = Wstecz

reference-target-list-tab-local = Ten dokument

reference-target-list-tab-remote = Inne dokumenty

reference-target-list-tab-remote-not-assigned = Nie przypisany do żadnej książki



## Reusable components - error boundary

error-boundary-title = Coś poszło nie tak

# Variables:
# - $hasReport (string): true | false depends if Sentry received automatic report.
# Fragments:
# - <p> ... </p>: text in new paragraph
error-boundary-info =
  <p>To nie Twoja wina, ten błąd nie powinien wystąpić.</p>
  <p>Aby zapobiec uszkodzeniu dokumentu przez błędy, wyłączyliśmy edycję, dopóki
  nie przeładujesz strony. Nie martw się o swoją pracę. Została ona automatycznie
  zapisana i zostanie przywrócona po ponownym załadowaniu.</p>
  { $hasReport ->
    [true] <p>Otrzymaliśmy automatyczny raport o błędzie, ale docenilibyśmy,
    gdybyś mógł/mogła poświęcić trochę czasu i opisać go bardziej szczegółowo.</p>
   *[false] {""}
  }

error-boundary-button-go-to-dashboard = Przejdź do panelu głównego

error-boundary-button-reload = Przeładuj stronę

error-boundary-button-fill-report = Wypełnij raport



## Reusable components - load component

load-error-message =
  <p>Wystąpił błąd podczas ładowania części tej strony.</p>
  <p>Odśwież tę stronę.</p>
  <p>Jeśli błąd nadal występuje, skontaktuj się z administratorem.</p>



## Reusable components - book card

book-card-edit = Edycja

book-card-remove = Usuń



## Editor - document title

# Placeholder text for document title
editor-document-title-value =
  .placeholder = Tytuł szkicu

# Alert displayed when document title was changed.
editor-document-title-save-alert-success = Tytuł został zmieniony.

# Alert displayed when document title could not be changed.
editor-document-title-save-alert-error = Nie udało się zmienić tytułu.



## Editor - toolboxes

editor-toolbox-no-selection = Proszę kliknąć w tekst, wtedy wyświetlą się dostępne narzędzia.

editor-toolbox-multi-selection = Zaznaczanie wielu elementów nie jest jeszcze
  wspierane



## Editor - toolboxes - save

editor-tools-save = Zapisz

# Alert displayed when document was saved.
editor-tools-save-alert-success = Szkic został zapisany.

# Alert displayed when document could not be saved.
editor-tools-save-alert-error = Nie udało się zapisać szkicu.

editor-tools-save-error-title = Nie udało się zapisać dokumentu

# Variables:
# - $error (string): error message
# Fragments:
# - <p> ... </p>: paragraph
editor-tools-save-error-content =
  <p>Wystąpił błąd podczas zapisywania. To nie Twoja wina, ten błąd nie powinien wystąpić.</p>
  <p>Proszę wyeksportować dokument i wysłać go do administratora, aby mógł go naprawić.</p>
  <p>Szczegóły błędu: { $error }</p>

editor-tools-save-error-export = Wyeksportuj dokument

editor-tools-save-export-title = Wyślij pobrany plik do administratora
  aby mógł rozwiązać problem.

editor-tools-save-export-ok = Ok



## Editor toolboxes - admonitions

editor-tools-admonition-title = Notka

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



## Editor toolboxes - quotations

editor-tools-quotation-title = Cytat



## Editor toolboxes - document settings

editor-tools-document-title = Dokument

editor-tools-document-select-language = Język dokumentu:



## Editor toolboxes - glossary settings

editor-tools-glossary-title = Skorowidz



## Editor toolboxes - characters counter

# Variables:
# - $value (number): number of characters in document.
editor-tools-characters-counter-title = Liczba znaków: { $value }

editor-tools-characters-counter-refresh = Odśwież



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
  [title] Nagłówek
  [figure_caption] Opis figury
 *[notavalidtype] Tekst
}

editor-tools-format-button-undo = Cofnij (Ctrl+Z)

editor-tools-format-button-redo = Ponów (Ctrl+Y)

editor-tools-format-button-clear = Usuń formatowanie

editor-tools-format-button-emphasis = Wyróżnienie (Ctrl+I)

editor-tools-format-button-list = Lista

editor-tools-format-button-strong = Wytłuszczenie (Ctrl+B)

editor-tools-format-button-subscript = Indeks dolny

editor-tools-format-button-superscript = Indeks górny

editor-tools-format-button-underline = Podkreślenie (Ctrl+U)

editor-tools-format-button-code = Kod (Ctrl+`)

editor-tools-format-button-term = Termin (Ctrl+K)



## Editor toolboxes - figures

editor-tools-figure-title = Ilustracja

editor-tools-figure-add-subfigure = Dodaj ilustrację

editor-tools-figure-remove-subfigure = Usuń ilustrację

editor-tools-figure-add-caption = Dodaj opis

editor-tools-figure-alt-text = Alternatywny tekst:



## Editor toolboxes - insertion tools

editor-tools-insert-title = Wstaw

editor-tools-insert-reference = Połącz

editor-tools-insert-admonition = Notka

editor-tools-insert-exercise = Ćwiczenie

editor-tools-insert-figure = Ilustracja

editor-tools-insert-code = Kod

editor-tools-insert-title = Nagłówek

editor-tools-insert-quotation = Cytat

editor-tools-insert-link = WWW

editor-tools-insert-source = Kod źródłowy



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



## Editor toolboxes - classes

editor-tools-classes-title = Lista klas:

editor-tools-classes-placeholder = Dodaj nową klasę



## Editor toolboxes - links

editor-tools-link-title = Odnośnik

editor-tools-link-text = Wprowadź tekst

editor-tools-link-url = Wprowadź odnośnik

editor-tools-link-remove = Usuń link

editor-tools-link-cancel = Anuluj

editor-tools-link-confirm = Potwierdź


## Editor toolboxes - terms

editor-tools-term-title = Termin

editor-tools-term-label = Forma indeksowa

editor-tools-term-remove = Usuń termin



## Editor toolboxes - definitions

editor-tools-definition-title = Definicja

editor-tools-definition-insert-definition-before = Dodaj definicję przed blokiem

editor-tools-definition-insert-definition-after = Dodaj definicję za blokiem

editor-tools-definition-remove-definition = Usuń definicję

editor-tools-definition-insert-meaning = Dodaj znaczenie

editor-tools-definition-insert-seealso = Dodaj "zobacz również"



## Editor toolboxes - meanings

editor-tools-meaning-title = Znaczenie

editor-tools-meaning-insert-example = Dodaj przykład



## Editor toolboxes - see also

editor-tools-seealso-title = Zobacz również

editor-tools-seealso-add-term = Dodaj termin

editor-tools-seealso-remove-term = Usuń termin



## Editor toolboxes - source elements

editor-tools-source-title = Kod źródłowy

editor-tools-source-type-label = Wyświetlaj element jako:

# Entry on the list of possible source types.
#
# Variables:
# - $type (string): source's type. Possible values are 'inline' and 'block'
editor-tools-source-type = { $type ->
 *[inline] Linia
  [block] Blok
}
