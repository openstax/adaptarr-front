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

book-button-add-module = Add module

book-button-add-group = Add group

book-button-remove = Remove

# Variable:
# - $name (string): process name.
book-in-process = Process: { $name }

book-begin-process = Begin process

book-begin-process-title = Configure and begin process

book-process-preview-title = Process details:

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

book-list-add-book-cancel = Cancel

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

dashboard-section-free-slots = Free slots:


## Screens - draft

draft-title = Draft

draft-style-switcher-title = Choose style in which you want to display this document

# Variables:
# - $style (string): version of styles.
draft-style-switcher = { $style ->
 *[default] Default styles
  [webview] Online styles
  [pdf] PDF styles
}

draft-style-switcher-info-box = This is experimental feature. There are visual differences between preview and original styles.

draft-loading-message = Loading draft. It may take a few minutes for bigger documents.

draft-remove-glossary-dialog = Are you sure you want to remove glossary?

draft-add-glossary = Add glossary

draft-remove-glossary = Remove

draft-cancel = Cancel



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

# Alert displayed if error occurs when sending invitation.
#
# Variables:
# - $details (string): error details.
invitation-send-alert-error = Something went wrong. Details: { $details }



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

user-profile-section-role = User's role

user-profile-role-unknown = Unknown role

user-profile-section-role-unassign =  Unassign user from role

# Alert displayed when user's role has been changed successfully.
#
# Variables:
# - $name (string): name of role which has been assigned to user.
user-profile-change-role-success = Role successfully changed to { $name }.

# Alert displayed when error occurred when changing user's role.
#
# Variables:
# - $details (string): error details.
user-profile-change-role-error = Something went wrong. Details: { $details }.

user-profile-unassign-role-success = Successfully unassigned user from role.

# Alert displayed when error occurred when unassiging user from role.
#
# Variables:
# - $details (string): error details.
user-profile-unassign-role-error = Something went wrong. Details: { $details }.

# Placeholder text for team search box.
user-profile-team-list-search =
  .placeholder = Search for user

user-profile-team-list-no-results = There are no users with specified criteria.



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
  Password must be between 6 and 12 characters.

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



## Screens - roles

role-view-title = Roles

role-section-add = Add new role

role-section-manage = Manage roles

role-name = Role name

role-create = Create role

role-edit = Edit

role-remove = Remove

# Alert displayed when role has been created.
#
# Variables:
# - $name (string): name of role which user created.
role-create-success = New role "{ $name }" created successfully.

# Alert displayed when role has not been created.
#
# Variables:
# - $details (string): error details.
role-create-error = Couldn't create new role. Details: { $details }.

# Dialog displayed when user want to delete role.
#
# Variables:
# - $name (string): name of role which user want to delete.
role-delete-title = Are you sure you want to delete "{ $name }" role?

role-delete-confirm = Confirm

role-delete-cancel = Cancel

# Alert displayed when role has been deleted.
#
# Variables:
# - $name (string): name of role which user deleted.
role-delete-success = Role "{ $name }" has been deleted.

# Alert displayed when role has not been deleted.
#
# Variables:
# - $details (string): error details.
role-delete-error = Couldn't delete role. Details: { $details }.

# Alert displayed when role has been updated.
#
# Variables:
# - $name (string): name of role which user updated.
role-update-success = Role "{ $name }" has been updated.

# Alert displayed when role has not been updated.
#
# Variables:
# - $details (string): error details.
role-update-error = Couldn't update role. Details: { $details }.

role-update-confirm = Update role

role-update-cancel = Cancel



## Screens - processes

processes-view-title = Manage processes

processes-view-add = Add new process

processes-view-preview = Process preview

# Alert displayed when process has been created.
#
# Variables:
# - $name (string): name of process which was created.
process-create-success = Process “{ $name }” has been created.

# Alert displayed when process has not been created.
#
# Variables:
# - $details (string): error details.
process-create-error = Couldn't create new process. Details: { $details }.

# Alert displayed when name of process has been updated.
process-update-name-success = Name has been updated.

# Alert displayed when name has not been updated.
#
# Variables:
# - $details (string): error details.
process-update-name-error = Couldn't update name. Details: { $details }.

# Alert displayed when version of process has been created.
#
# Variables:
# - $name (string): name of new version which was created.
process-create-version-success = Version “{ $name }” has been created.

# Alert displayed when version has not been created.
#
# Variables:
# - $details (string): error details.
process-create-version-error = Couldn't create new version. Details: { $details }.



## Components for creating and updating process

process-form-create = Create process

process-form-new-version = Create new version

process-form-cancel = Cancel

process-form-remove = Remove

process-form-process-name = Process name

process-form-slot-title = List of slots:

process-form-slot-add = Add slot

process-form-slot-remove = Remove slot

process-form-slot-name = Slot name:

process-form-slot-autofill = Automatically assign users:

process-form-slot-role = Role:

process-form-step-title = List of steps:

process-form-step-add = Add step

process-form-step-remove = Remove step

process-form-step-name = Step name:

process-form-step-slots = Step slots:

process-form-step-slots-add = Add slot

process-form-step-links = Step links:

process-form-step-links-add = Add link

process-form-step-slot-slot = Slot:

process-form-step-slot-permission = Permission:

process-form-step-link-name = Link name:

process-form-step-link-to = Next step:

process-form-step-link-slot = Slot allowed to use this link:

process-form-step-link-remove = Remove link

process-form-error-name = Please specify name of this process.

process-form-error-slot-name = All slots must have a name.

process-form-error-step-name = All steps must have a name.

process-form-error-step-link-name = All links must have a name.

process-form-error-starting-step = Please specify starting step.

process-form-error-starting-step-no-links = Starting step must have links.

process-form-error-slots-min = Process must have at least one slot.

process-form-error-steps-min = Process must have at least two steps.

process-form-error-no-finish =
  Process must have at least one final step (a step from which there are
  no outgoing links).

process-form-error-propose-and-no-accept =
  Step with propose changes have to be linking to step with accept changes.

process-form-error-accept-and-no-propose =
  Step with accept changes have to be linked from step with propose changes.

process-form-error-edit-and-changes =
  The permissions to edit and propose changes cannot both be granted in the same
  step.

process-form-error-step-slot-permission-or-slot =
  Each permission must have a slot assigned.

process-form-error-step-link-to-or-slot =
  Each link must have a target and specify a slot which can use it.



## Reusable components - process preview

# Variables:
# - $name (string): name of the process.
process-preview-title = Process name: { $name }

process-preview-slots-list = List of slots:

process-preview-steps-list = List of steps:

# Variables:
# - $name (string): name of the slot.
process-preview-slot-name = Slot name: { $name }

# Variables:
# - $value (string: true | false): value of autofill for this slot.
process-preview-slot-autofill = Automatic assignment of users { $value ->
  [true] enabled
 *[false] disabled
}

# Variables:
# - $name (string): role name for this slot.
process-preview-role = Role: { $name }

# Variables:
# - $name (string): name of the step.
process-preview-step-name = Step name: { $name }

process-preview-step-slots-list = List of step slots:

process-preview-step-links-list = List of step links:

# Variables:
# - $name (string): slot name.
# - $permission (string): permission granted to this slot.
process-preview-step-slot = { $name } is able to { $permission ->
  [view] view drafts
  [edit] edit drafts
  [propose-changes] propose changes
  [accept-changes] accept changes
 *[notavalidvalue] { $permission }
}.

# Variables:
# - $slot (string): slot name.
# - $link (string): link name.
# - $to (string): target step name.
process-preview-step-link =
  { $slot } can use link “{ $link }” which leads to step “{ $to }”.



## Reusable components - begin process

begin-process-select-process = Select process:

begin-process-start = Start process

# Alert displayed when process has been started.
#
# Variables:
# - $process (string): name of process which was started.
# - $module (string): title of module for which process was started.
begin-process-success = Started process “{ $process }” for “{ $module }”.

# Alert displayed when process has not been started.
#
# Variables:
# - $details (string): error details.
begin-process-error = Couldn't start process. Details: { $details }.

begin-process-assign-user-title = Select user for this slot.

begin-process-slots-title = Configure slots:

begin-process-assign-user = Select user

begin-process-unassign-user = Unassign user



## Reusable components - update slots

update-slots-title = Manage slots assignments:

# Variables:
# - $name (string): slot name.
# - $role (string): role name for this slot.
update-slots-name = { $role ->
  [undefined] { $name }
 *[role] { $name } for users with role: { $role }
}

update-slots-assign-user = Select user

update-slots-unassign-user = Unassign user

# Variables:
# - $slot (string): slot name.
# - $role (string): role name for this slot.
update-slots-assign-user-title = Select user { $role ->
  [undefined] for slot: { $slot }
 *[role] with role: { $role } for slot: { $slot }
}

# Alert displayed when there was an error while fetching data.
update-slots-fetching-error = Couldn't fetch details about slots in this process for given module. Please try again later.



## Reusable components - draft info

draft-info-main-button = Informations about process

draft-info-title = Informations about process for this draft

# Variables:
# - $process (string): process name which this draft follows.
draft-info-process = Process: { $process }

# Variables:
# - $step (string): step name in current process.
draft-info-step = Current step: { $step }

draft-info-permissions = Your permissions:

# Variables:
# - $permission (string): draft permission (view | edit | propose-changes accept-changes)
draft-info-permission = { $permission ->
  [view] view
  [edit] edit
  [propose-changes] propose changes
  [accept-changes] accept changes
 *[notavalidvalue] { $permission }
}



## Reusable components - free slots

free-slots-view-draft = View draft

free-slots-not-avaible = There are no free slots for you to take.

free-slots-take-slot = Take slot

# Alert displayed when user assign himself to a free slot.
#
# Variables:
# - $slot (string): name of slot which was taken.
# - $draft (string): draft name for which user was assigned.
free-slots-success = You've been assigned to “{ $draft }” with slot: { $slot }.

# Alert displayed when there was an error while taking free slot.
#
# Variables:
# - $details (string): error details.
free-slots-error = Couldn't assign you to this slot. { $details ->
 *[string] Details: { $details }
  [none] {""}
}



## Reusable components - step changer

step-changer-main-button = I'm handing my work to the next step

step-changer-choose = Choose link:

step-changer-move = Move using selected link

# Alert displayed when draft was advanced to the next step.
#
# Variables:
# - $code (string): draft-process-advanced or draft-process-finished
step-changer-success = { $code ->
  [draft-process-advanced] Draft was advanced to the next step.
  [draft-process-finished] Process has ended. Draft was saved as a module.
 *[notavalidvalue] { $code }
}

# Alert displayed when there was an error while advancing to the next step.
#
# Variables:
# - $details (string): error details.
step-changer-error = Couldn't advance to the next step. Details: { $details }.

step-changer-details-dialog-title = Choose next step

step-changer-confirm-dialog-title = Do you want to move this draft to the next step?

step-changer-unsaved-changes = You have unsaved changes.

step-changer-advance = Advance

step-changer-cancel = Cancel

step-changer-discard-advance = Discard changes and advance

step-changer-save-advance = Save and advance

# Alert displayed when there was an error while saving and advancing to the next step.
#
# Variables:
# - $details (string): error details.
step-changer-save-advance-error = Couldn't save and advance to the next step. Details: { $details }.



## Reusable components - permissions

# Variables:
# - $name (string): name of permission.
permission-label = { $name ->
  [user-invite] Invite users
  [user-delete] Delete users
  [user-edit-permissions] Edit user's permissions
  [user-assign-role] Assign roles to users
  [book-edit] Create, delete and edit book content
  [module-edit] Create, delete and edit modules
  [role-edit] Create, delete and edit roles
  [editing-process-edit] Create and edit processes
  [editing-process-manage] Assign modules to processes
 *[unknown] Unknown permission
}



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

navigation-roles = Roles

navigation-processes = Editing processes



## Reusable components - list of assets

# Button for adding new assets (files).
asset-list-add-media = Add media

# Alert for error when adding new media
#
# Variables:
# - $details (string): error message.
asset-list-add-error = Couldn't add media. Details: { $details }



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
  [assigned] <actor>{ $actor }</actor> assigned you to <module>{ $module }</module>
  [process_ended] Editing process for <module>{ $module }</module> has ended.
  [slot_filled] You were assigned to slot in <module>{ $module }</module>.
  [slot_vacated] You were removed from slot in <module>{ $module }</module>.
  [draft_advanced] Step in <module>{ $module }</module> has changed.
 *[notavalidkind] Unknown action
}



## Reusable components - date differences

date-diff-now = just now

# Variables:
# - $minutes (number): numbers of minutes between from and current date
date-diff-minutes = { $minutes ->
  [1] 1 minute ago
 *[more] { $minutes } minutes ago
}

# Variables:
# - $hours (number): numbers of hours between from and current date
date-diff-hours = { $hours ->
  [1] 1 hour ago
 *[more] { $hours } hours ago
}

# Variables:
# - $days (number): numbers of days between from and current date
date-diff-days = { $days ->
  [1] 1 day ago
 *[more] { $days } days ago
}



## Reusable components - file upload

file-upload-select-files = Drop files here or click to upload (optional).

file-upload-remove-all = Remove all files



## Reusable components - list of modules

# Placeholder text for search box
module-list-search-box =
  .placeholder = Search for a module

module-list-remove = Remove



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



## Reusable components - list of reference targets

reference-target-list-go-back = Back

reference-target-list-tab-local = This document

reference-target-list-tab-remote = Other documents

reference-target-list-tab-remote-not-assigned = Not assigned to any book



## Reusable components - error boundary

error-boundary-title = Something went wrong

# Variables:
# - $hasReport (string): true | false depends if Sentry received automatic report.
# Fragments:
# - <p> ... </p>: text in new paragraph
error-boundary-info =
  <p>It's not your fault, it should not have happened.</p>
  <p>To prevent errors from corrupting your document we disabled editing until
  you reload the page. Don't worry about your work; it has been auto-saved and
  will be restored after reload.</p>
  { $hasReport ->
    [true] <p>We have received an automatic error report, but would appreciate if
    you could spare some time and fill out a more detailed one.</p>
   *[false] {""}
  }

error-boundary-button-go-to-dashboard = Go to dashboard

error-boundary-button-reload = Reload page

error-boundary-button-fill-report = Fill out a report



## Reusable components - load component

load-error-message =
  <p>There was an error while loading part of this page.</p>
  <p>Please reload this page.</p>
  <p>If error will still occurs please contact administrator.</p>



## Reusable components - book card

book-card-edit = Edit

book-card-remove = Remove



## Editor - document title

# Placeholder text for document title
editor-document-title-value =
  .placeholder = Title of draft

# Alert displayed when document title was changed.
editor-document-title-save-alert-success = Title has been updated.

# Alert displayed when document title could not be changed.
editor-document-title-save-alert-error = Couldn't update the title.



## Editor - toolboxes

editor-toolbox-no-selection = Please select editor to show toolbox.

editor-toolbox-multi-selection = Selection across elements is not yet supported



## Editor - toolboxes - save

editor-tools-save = Save

# Alert displayed when document was saved.
editor-tools-save-alert-success = Draft has been saved successfully.

# Alert displayed when document could not be saved.
editor-tools-save-alert-error = Draft couldn't be saved.

editor-tools-save-error-title = We couldn't save this document

# Variables:
# - $error (string): error message
# Fragments:
# - <p> ... </p>: paragraph
editor-tools-save-error-content =
  <p>There was an error while saving this document. It's not your fault, it
  should not have happened.</p>
  <p>Please export document and send it to the administrator so he can fix it.</p>
  <p>Error details: { $error }</p>

editor-tools-save-error-export = Export document

editor-tools-save-export-title = Please send downloaded file to the administrator
  so he can fix your problem.

editor-tools-save-export-ok = Ok



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



## Editor toolboxes - quotations

editor-tools-quotation-title = Quotation



## Editor toolboxes - document settings

editor-tools-document-title = Document

editor-tools-document-select-language = Document language:



## Editor toolboxes - glossary settings

editor-tools-glossary-title = Glossary



## Editor toolboxes - characters counter

# Variables:
# - $value (number): number of characters in document.
editor-tools-characters-counter-title = Number of characters: { $value }

editor-tools-characters-counter-refresh = Refresh



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

editor-tools-format-button-undo = Undo (Ctrl+Z)

editor-tools-format-button-redo = Redo (Ctrl+Y)

editor-tools-format-button-clear = Clear formatting

editor-tools-format-button-emphasis = Emphasis (Ctrl+I)

editor-tools-format-button-list = List

editor-tools-format-button-strong = Strong (Ctrl+B)

editor-tools-format-button-subscript = Subscript

editor-tools-format-button-superscript = Superscript

editor-tools-format-button-underline = Underline (Ctrl+U)

editor-tools-format-button-code = Code (Ctrl+`)

editor-tools-format-button-term = Term (Ctrl+K)



## Editor toolboxes - figures

editor-tools-figure-title = Figure

editor-tools-figure-add-subfigure = Add subfigure

editor-tools-figure-remove-subfigure = Remove subfigure

editor-tools-figure-add-caption = Add caption

editor-tools-figure-alt-text = Alternative text:



## Editor toolboxes - insertion tools

editor-tools-insert-title = Insert

editor-tools-insert-reference = Reference

editor-tools-insert-admonition = Admonition

editor-tools-insert-exercise = Exercise

editor-tools-insert-figure = Figure

editor-tools-insert-code = Code

editor-tools-insert-title = Title

editor-tools-insert-quotation = Quotation

editor-tools-insert-link = Link

editor-tools-insert-source = Source element



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



## Editor toolboxes - classes

editor-tools-classes-title = List of classes:

editor-tools-classes-placeholder = Add new class



## Editor toolboxes - links

editor-tools-link-title = Link

editor-tools-link-text = Provide text

editor-tools-link-url = Provide link

editor-tools-link-remove = Remove link

editor-tools-link-cancel = Cancel

editor-tools-link-confirm = Confirm



## Editor toolboxes - terms

editor-tools-term-title = Term

editor-tools-term-label = Index form

editor-tools-term-remove = Remove term



## Editor toolboxes - definitions

editor-tools-definition-title = Definition

editor-tools-definition-insert-definition-before = Insert definition before

editor-tools-definition-insert-definition-after = Insert definition after

editor-tools-definition-remove-definition = Remove definition

editor-tools-definition-insert-meaning = Add meaning

editor-tools-definition-insert-seealso = Add "see also"



## Editor toolboxes - meanings

editor-tools-meaning-title = Meaning

editor-tools-meaning-insert-example = Add example



## Editor toolboxes - see also

editor-tools-seealso-title = See also

editor-tools-seealso-add-term = Add term

editor-tools-seealso-remove-term = Remove term



## Editor toolboxes - source elements

editor-tools-source-title = Source element

editor-tools-source-type-label = Show element as:

# Entry on the list of possible source types.
#
# Variables:
# - $type (string): source's type. Possible values are 'inline' and 'block'
editor-tools-source-type = { $type ->
 *[inline] Inline
  [block] Block
}
