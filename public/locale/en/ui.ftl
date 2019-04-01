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
book-view-title-loading = Loading

book-add-group = Group

book-remove-group = Group

book-change-group-title = Edit

book-add-module = Module

book-remove-module = Module

book-assign-user = Assign user

book-assign-different-user = Assign other user

book-unassign-user = Unassign

# Alert displayed when book could not be downloaded.
#
# Variables:
# - $title (string): book's title
# - $details (string): description of the error
book-fetch-error = Couldn't load parts for: { $title }. Details: { $details }



## Screens - book view - module removal dialog

book-remove-module-title = Are you sure?

book-remove-module-confirm = Delete

book-remove-module-cancel = Cancel

# Alert displayed when a module was removed.
#
# Variables:
# - $title (string): module's title
book-remove-module-alert-success = Module { $title } was removed successfully.



## Screens - book view - user assignment dialog

book-assign-user-title = Select user from a list to assign them.

# Alert displayed when a user was assigned to a module.
#
# Variables:
# - $user (string): user's name
# - $module (string): module's title
book-assign-user-alert-success = { $user } was assigned to { $module }.

book-assign-user-alert-error = Target module or user are undefined.

# Alert displayed when a user was unassigned from a module.
#
# Variables:
# - $module (string): module's title
book-unassign-user-alert-success = User was unassigned from { $module }



## Screens - book view - “Edit book” dialog

book-edit-dialog-title = Edit book

# Placeholder text for title field.
book-edit-title =
  .placeholder = Book title

book-edit-submit =
  .value = Confirm

book-edit-alert-success = Book was updated successfully.



## Screens - book view - reordering parts

book-part-moving-locked = Moving modules is locked.

book-part-moving-unlocked = Now you can move modules.

# Alert displayed when a module or a group was moved to a different location.
#
# Variables:
# - $item (string): title of the module or thee group that was moved
# - $target (string): title of the group into which it was moved
book-part-moving-alert-success = { $item } was moved to { $target }.



## Screens - book view - add group dialog

book-add-group-dialog-title = Provide chapter title.

book-add-group-title =
  .placeholder = Title

book-add-group-confirm =
  .value = Confirm

book-add-group-cancel = Cancel

book-add-group-alert-success = New group was added successfully.



## Screens - book view - remove group dialog

book-remove-group-dialog-title = Remove this group and all its contents?

book-remove-group-confirm = Delete

book-remove-group-cancel = Cancel

# Alert displayed when a group was removed.
#
# Variables:
# - $title (string): group's title
book-remove-group-alert-success = Group { $title } was removed successfully.



## Screens - book view - change group title dialog

book-group-change-title-dialog-title = Change chapter title.

# Placeholder text for group title
book-group-change-title-value =
  .placeholder = New title

book-group-change-title-confirm =
  .value = Confirm

book-group-change-title-cancel = Cancel

# Alert displayed when group's title was changed.
#
# Variables:
# - $from (string): old title
# - $to (string): new title
book-group-change-title-alert-success =
  Group title was change from { $from } to { $to }.



## Screens book view - add module to a group

book-group-add-module-dialog-title = Select module or create a new one.

# Alert displayed when module was added to a group.
#
# Variables:
# - $title (string): module's title
book-group-add-module-alert-success = { $title } was added to the group.



## Screens - list of books

book-list-view-title = Books

book-list-empty = No books found.



## Screens - list of books - book deletion dialog

# Dialog's title.
#
# Variables:
# - $title (string): title of the book to be deleted
book-delete-title = Are you sure you want to delete { $title }?

book-delete-confirm = Confirm

book-delete-cancel = Cancel

# Alert displayed when a book was deleted.
book-delete-alert-success = Book was deleted successfully.



## Screens - list of books - adding book dialog

book-list-add-book-dialog-title = Add new book

# Placeholder text for book title.
book-list-add-book-title =
  .placeholder = Book title

book-list-add-book-confirm =
  .value = Confirm

# Alert displayed when a book was created.
book-list-add-book-alert-success = Book was added successfully.



## Screens - dashboard

dashboard-view-title = Dashboard

dashboard-section-assigned = Assigned to you:

dashboard-assigned-view-draft = View draft

dashboard-assigned-new-draft = New draft

dashboard-assigned-view-module = View module

dashboard-assigned-empty = You are not assigned to any module.

dashboard-assigned-section-not-assigned = Not assigned to any book

dashboard-section-drafts = Your drafts:

dashboard-drafts-section-not-assigned = Not assigned to any book

dashboard-drafts-view = View draft

dashboard-drafts-delete = Delete

dashboard-drafts-empty = You don't have any drafts.

# Alert displayed when draft of a module was created.
dashboard-create-draft-alert-success = Draft was created successfully.


## Screens - draft

draft-loading-message = Loading draft. It may take a while minutes for bigger documents.


## Screens - dashboard - draft deletion dialog

dashboard-delete-draft-dialog-title = Are you sure you want to delete { $title } draft?

dashboard-delete-draft-confirm = Delete

dashboard-delete-draft-cancel = Cancel

# Alert displayed when a draft was deleted.
dashboard-delete-draft-alert-success = Draft was deleted successfully.



## Screens - invitations

invitation-view-title = Invite new user

# Placeholder text for email address
invitation-email =
  .placeholder = E-mail address

invitation-email-validation-invalid = This is not valid email address.

invitation-send =
  .value = Send invitation

# Alert displayed when an invitation was sent to a user.
#
# Variables:
# - $email (string): email address to which the invitation was sent.
invitation-send-alert-success = Invitation sent to { $email }



## Screens - module view
##
## Preview of a module. Can be displayed either standalone or as part of book
## view.

# View title.
#
# Variables:
# - $title (string): module's title
module-view-title = { $title }

module-go-to = Go to module

module-assignee = Assignee:

module-create-draft = New Draft

module-open-draft = View draft

# Alert displayed when draft of a module was created.
module-create-draft-alert-success = Draft was created successfully.



## Screens - notification centre

notification-centre-view-title = Notifications

notification-centre-empty = No notifications found.



## Screens - user's profile

# Title displayed when viewing user's own profile.
user-profile-view-title-your = Your profile

# Title displayed when viewing another user's profile.
#
# Variables:
# - $name (string): user's name
user-profile-view-title-named = { $name }'s profile

user-profile-section-team = Your team

user-profile-section-bio = Bio

user-profile-section-contact = Contact

# Placeholder text for team search box.
user-profile-team-list-search =
  .placeholder = Search for user



## Screens - user's profile - update dialog

user-profile-update-avatar-title = Upload file for your avatar.

user-profile-update-name-title = Update your name.

# Placeholder text for name input.
user-profile-update-name =
  .placeholder = Name

user-profile-update-confirm = Confirm

# Message displayed below name input when it has fewer than three characters.
user-profile-name-validation-error = Name has to be at least 3 characters long.



## Screens - resources

resources-view-title = Resources



## Screens - settings

settings-view-title = Settings

settings-section-language = Change language

settings-section-password = Change password

# Placeholder text for old password input
settings-value-old-password =
  .placeholder = Old password

# Placeholder text for new password input
settings-value-new-password =
  .placeholder = New password

# Placeholder text for new password repetition
settings-value-new-password-repeat =
  .placeholder = Repeat new password

# Message displayed below new password when it has invalid length.
settings-validation-password-bad-length =
  Password must be bewtween 6 and 12 characters.

# Message displayed below new password repetition when it doesn't match
# new password.
settings-validation-password-no-match = Passwords must be identical.

settings-password-change =
  .value = Confirm

# Alert displayed when password was changed.
settings-change-password-alert-success = Password has been changed.

# Alert displayed when password could not be changed.
settings-change-password-alert-error = Password has not been changed.



## Screens - settings - language change dialog

settings-language-dialog-title = Are you sure you want to change language?

settings-language-dialog-confirm = Confirm

settings-language-dialog-cancel = Cancel



## Reusable components - navigation and side menu
##
## This component is displayed at all times and provides easy access to primary
## screens.

navigation-title = Menu

navigation-dashboard = Dashboard

navigation-notifications = Notifications

navigation-notifications-show-all = Show all

navigation-books = Books

navigation-resources = Resources

navigation-profile = Your profile

navigation-settings = Settings

navigation-logout = Logout

navigation-invite = Invitations



## Reusable components - list of assets

# Button for adding new assets (files).
asset-list-add-media = Add media



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
  [assigned] <actor>{ $actor }</actor> assigned you to <module>{ $module }</module>
 *[notavalidkind] Unknown action
}



## Reusable components - file upload

file-upload-select-files = Drop files here or click to upload (optional).

file-upload-remove-all = Remove all files



## Reusable components - list of modules

# Placeholder text for search box
module-list-search-box =
  .placeholder = Search for a module



## Reusable components - list of modules - new module dialog

# Placeholder text for module's title
module-list-add-module-title =
  .placeholder = Title

module-list-add-module-submit =
  .value = Add new

# Alert displayed when a module was created.
#
# Variables:
# - $title (string): new module's title
module-list-add-module-alert-success = Module { $title } was added.



## Reusable components - list of modules - module deletion dialog

module-list-delete-module-title = Deleting module is permanent.

module-list-delete-module-confirm = Delete

module-list-delete-module-cancel = Cancel

# Alert displayed when a module was deleted.
#
# Variables:
# - $title (string): module's title
module-list-delete-module-alert-success = { $title } was deleted successfully.



## Reusable components - chat and message input

message-input-textarea =
  .placeholder = Type your message...

message-input-send = Send

message-input-alert-select-user-error =
  Something went wrong while selecting user.



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
  [example] Examples
  [exercise] Exercises
  [figure] Figures
  [important] Important
  [note] Notes
  [tip] Tips
  [warning] Warnings
 *[notavalidtype] { $type }
}



## Reusable components - list of reference targets

reference-target-list-go-back = Back

reference-target-list-tab-local = This document

reference-target-list-tab-remote = Other documents



## Editor - document title

# Placeholder text for document title
editor-document-title-value =
  .placeholder = Title of draft

# Alert displayed when document title was changed.
editor-document-title-save-alert-success = Title has been updated.

# Alert displayed when document title could not be changed.
editor-document-title-save-alert-error = Couldn't update the title.



## Editor - toolboxes

editor-toolbox-no-selection = No selection

editor-toolbox-multi-selection = Selection across elements is not yet supported



## Editor - toolboxes - save

editor-tools-save = Save

# Alert displayed when document was saved.
editor-tools-save-alert-success = Draft has been saved successfully.

# Alert displayed when document could not be saved.
editor-tools-save-alert-error = Draft couldn't be saved.



## Editor - toolboxes - merge

editor-tools-merge = Merge

# Alert displayed when draft was merged into source module.
editor-tools-merge-alert-success = Draft has been merged successfully.

# Alert displayed when draft could not be merged.
editor-tools-merge-alert-error = Draft couldn't be merged.



## Editor toolboxes - admonitions

editor-tools-admonition-title = Admonition

# Entry on the list of possible admonition types.
#
# Variables:
# - $type (string): admonition's type. Possible values are 'note', 'warning',
#   'tip', and 'important'.
editor-tools-admonition-type = { $type ->
 *[note] Note
  [warning] Warning
  [tip] Tip
  [important] Important
}



## Editor toolboxes - document settings

editor-tools-document-title = Document



## Editor toolboxes - exercises

editor-tools-exercise-title = Exercise

editor-tools-exercise-insert-solution = Add solution

editor-tools-exercise-insert-commentary = Add commentary



## Editor toolboxes - text formatting

# Entry on the list of possible text types.
#
# Variables:
# - $type (string): text type. Possible values include 'paragraph', 'title',
#   and 'figure_caption', but other values are also allowed.
editor-tools-format-text-type = { $type ->
  [paragraph] Paragraph
  [title] Title
  [figure_caption] Figure caption
 *[notavalidtype] Text
}

editor-tools-format-button-clear =
  .title = Clear formatting

editor-tools-format-button-emphasis =
  .title = Emphasis

editor-tools-format-button-list =
  .title = List

editor-tools-format-button-strong =
  .title = Strong

editor-tools-format-button-subscript =
  .title = Subscript

editor-tools-format-button-superscript =
  .title = Superscript

editor-tools-format-button-underline =
  .title = Underline



## Editor toolboxes - figures

editor-tools-figure-title = Figure

editor-tools-figure-add-subfigure = Add subfigure

editor-tools-figure-remove-subfigure = Remove subfigure

editor-tools-figure-add-caption = Add caption



## Editor toolboxes - insertion tools

editor-tools-insert-title = Insert

editor-tools-insert-reference = Reference

editor-tools-insert-admonition = Admonition

editor-tools-insert-exercise = Exercise

editor-tools-insert-figure = Figure

editor-tools-insert-section = Section



## Editor toolboxes - lists

editor-tools-list-title = List

editor-tools-list-decrease-level = Decrease item level

editor-tools-list-increase-level = Increase item level

# Entry on the list of possible list styles.
#
# Variables:
# - $style (string): list style. Possible values are 'ol_list' and 'ul_list'.
editor-tools-list-style = { $style ->
 *[ol_list] Arabic numerals
  [ul_list] Bullet
}



## Editor toolboxes - references

editor-tools-xref-title = Reference

editor-tools-xref-case = Select case

editor-tools-xref-change = Change target

editor-tools-xref-hover-tooltip = Control-click to go to destination

# Text to display when target of a local (in document) reference doesn't exist.
editor-tools-xref-label-local-reference-missing = (reference target missing)

# Text to display while remote (outside of a document) references have not been
# loaded yet.
editor-tools-xref-label-remote-loading = (loading reference data)

# Text to display when target of a remote (outside of a document) reference
# doesn't exist.
editor-tools-xref-label-remote-reference-missing = (reference target missing)

# Entry on the list of possible grammatical cases.
#
# Note that this list doesn't contain all cases, only ones for which we found
# enough information.
#
# Variables:
# - $case (string): grammatical case. Only values listed here are allowed, any
#   other value should be treated as 'nominative'.
editor-tools-xref-grammatical-case = { $case ->
  [abessive] Abessive
  [ablative] Ablative
  [absolutive] Absolutive
  [accusative] Accusative
  [adessive] Adessive
  [adverbial] Adverbial
  [allative] Allative
  [aversive] Aversive
  [benefactive] Benefactive
  [causal] Causative
  [causal-final] Causal-final
  [comitative] Comitative
  [comparative] Comparative
  [dative] Dative
  [delative] Delative
  [distributive] Distributive
  [distributive-temporal] Distributive-temporal
  [egressive] Egressive
  [elative] Elative
  [equative] Equative
  [ergative] Ergative
  [ergative-genitive] Ergative-genitive
  [essive] Essive
  [essive-formal] Essive-formal
  [essive-modal] Essive-modal
  [exessive] Exessive
  [formal] Formal
  [genitive] Genitive
  [illative] Illative
  [inessive] Inessive
  [instructive] Instructive
  [instrumental] Instrumental
  [instrumental-comitative] Instrumental-comitative
  [intransitive] Intransitive
  [intrative] Intrative
  [lative] Lative
  [locative] Locative
 *[nominative] Nominative
  [objective] Objective
  [oblique] Oblique
  [ornative] Ornative
  [partitive] Partitive
  [pegative] Pegative
  [perlative] Perlative
  [pertingent] Pertignent
  [possessive] Possessive
  [postessive] Postessive
  [prepositional] Prepositional
  [privative] Privative
  [prolative] Prolative
  [sociative] Sociative
  [subessive] Subessive
  [sublative] Sublative
  [superssive] Superssive
  [temporal] Temporal
  [terminative] Terminative
  [translative] Translative
  [vocative] Vocative
}

## Editor toolboxes - sections

editor-tools-sections-title = Section

editor-tools-sections-increase-depth =  Increase level

editor-tools-sections-decrease-depth =  Decrease level 

