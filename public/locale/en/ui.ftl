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

book-search-input =
  .placeholder = Search

book-statistics-choose-process = Statistics for process:

book-button-add-module = Add module

book-button-add-group = Add chapter

book-button-remove = Remove

# Variable:
# - $process (string): process name.
# - $step (string): step name.
book-in-process = { $step } in { $process }

book-begin-process = Begin process

book-begin-process-title = Configure and begin process

book-begin-process-no-modules = All modules in this chapter are already assigned to the process.

book-begin-process-no-modules-ok = OK

book-process-preview-title = Process details:

book-process-cancel-title = Cancel process without saving changes

book-process-cancel-button = Cancel process

book-process-cancel-button-cancel = Cancel

# Alert displayed when process has been finished.
book-process-cancel-success = Process has been canceled

# Alert displayed when process could not be finished.
#
# Variables:
# - $error (string): error details.
book-process-cancel-error = Something went wrong. Details: { $error }

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
book-remove-module-alert-success = Module { $title } was removed successfully



## Screens - book view - user assignment dialog

book-assign-user-title = Select user from a list to assign them

# Alert displayed when a user was assigned to a module.
#
# Variables:
# - $user (string): user's name
# - $module (string): module's title
book-assign-user-alert-success = { $user } was assigned to { $module }

book-assign-user-alert-error = Target module or user are undefined

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

book-edit-alert-success = Book has been updated



## Screens - book view - book parts

# Variables:
# - $step (string): name of step
# - $counter (string): number of modules in current step
book-part-step-statistic = { $step }: { $counter }

# Alert displayed when a module or a group was moved to a different location.
#
# Variables:
# - $item (string): title of the module or thee group that was moved
# - $target (string): title of the group into which it was moved
book-part-moving-alert-success = { $item } was moved to { $target }



## Screens - book view - add group dialog

book-add-group-dialog-title = Provide chapter title

book-add-group-title =
  .placeholder = Title

book-add-group-confirm =
  .value = Confirm

book-add-group-cancel = Cancel

book-add-group-alert-success = New chapter has been added



## Screens - book view - remove group dialog

book-remove-group-dialog-title = Remove this chapter and all its contents

book-remove-group-confirm = Delete

book-remove-group-cancel = Cancel

# Alert displayed when a group was removed.
#
# Variables:
# - $title (string): group's title
book-remove-group-alert-success = chapter { $title } has been removed



## Screens - book view - change group title dialog

book-group-change-title-dialog-title = Change chapter title

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
  Group title was change from { $from } to { $to }



## Screens book view - add module to a group

book-group-add-module-dialog-title = Select module or create a new one

# Alert displayed when module was added to a group.
#
# Variables:
# - $title (string): module's title
book-group-add-module-alert-success = { $title } was added to the chapter



## Screens - list of books

book-list-view-title = Books

book-list-empty = No books found



## Screens - list of books - book deletion dialog

# Dialog's title.
#
# Variables:
# - $title (string): title of the book to be deleted
book-delete-title = Are you sure you want to delete { $title }?

book-delete-confirm = Confirm

book-delete-cancel = Cancel

# Alert displayed when a book was deleted.
book-delete-alert-success = Book has been deleted



## Screens - list of books - adding book dialog

book-list-add-book-dialog-title = Add new book

# Placeholder text for book title.
book-list-add-book-title =
  .placeholder = Book title

book-list-add-book-confirm =
  .value = Confirm

book-list-add-book-cancel = Cancel

# Alert displayed when a book was created.
book-list-add-book-alert-success = Book has been added



## Screens - dashboard

dashboard-view-title = Dashboard

dashboard-section-assigned = Assigned to you:

dashboard-assigned-view-draft = View draft

dashboard-assigned-new-draft = New draft

dashboard-assigned-view-module = View module

dashboard-assigned-empty = You are not assigned to any module

dashboard-section-drafts = Your drafts

dashboard-drafts-section-not-assigned = Not assigned to any book

dashboard-drafts-view = View draft

dashboard-drafts-delete = Delete

dashboard-drafts-empty = You don't have any drafts

dashboard-drafts-details = Details

# Alert displayed when draft of a module was created.
dashboard-create-draft-alert-success = Draft has been created

dashboard-section-free-slots = Free slots:


## Screens - draft

draft-title = Draft

draft-style-switcher-title = Choose style in which you prefer to display this document

# Variables:
# - $style (string): version of styles.
draft-style-switcher = { $style ->
 *[default] Default styles
  [webview] Online styles
  [pdf] PDF styles
}

draft-style-switcher-info-box = This is an experimental feature. There are visual differences between preview and original styles.

draft-loading-message = Loading draft. It may take a few minutes.

draft-remove-glossary-dialog = Are you sure you want to remove glossary?

draft-add-glossary = Add glossary

draft-remove-glossary = Remove

draft-cancel = Cancel

draft-load-incorrect-version-title = Document version mismatch

draft-load-incorrect-version-info = Your version of the document is different from the
  version saved on the server because the file has been modified on another computer
  or browser. You can solve this problem by discarding unsaved changes and loading the
  version from the server, or you can continue working with the current version.

draft-load-incorrect-version-button-discard = Discard unsaved changes

draft-load-incorrect-version-button-keep-working = Keep working on current version

draft-save-incorrect-version-title = Document version mismatch

draft-save-incorrect-version-content = Your version of the document is different from the
  version saved on the server because the file has been modified on another computer
  or browser. You can overwrite the document from the currently viewed version.
  Refreshing the page in the browser will allow you to load the document saved on the server.

draft-save-incorrect-version-button-cancel = Cancel

draft-save-incorrect-version-button-overwrite = Overwrite document



## Screens - draft details

# Variables:
# - $draft (string): draft's title
draft-details-view-title = Draft details for { $draft }

draft-details-go-to-draft = Go to draft

draft-details-button-download = Download CNXML

draft-details-button-downloading = Downloading...

draft-details-button-import = Import CNXML

draft-details-button-importing = Importing...

draft-details-import-title = Upload CNXML file to import

draft-details-button-cancel = Cancel

draft-details-button-confirm = Confirm

draft-details-import-success = File has been imported.

# Variables:
# - $details (string): error details.
draft-details-import-error = We couldn't import this file. Details: { $details }



## Screens - dashboard - draft deletion dialog

dashboard-delete-draft-dialog-title = Are you sure you want to delete { $title } draft?

dashboard-delete-draft-confirm = Delete

dashboard-delete-draft-cancel = Cancel

# Alert displayed when a draft was deleted.
dashboard-delete-draft-alert-success = Draft has been deleted



## Screens - invitations

invitation-view-title = Invite new user

# Placeholder text for email address
invitation-email =
  .placeholder = E-mail address

invitation-email-validation-invalid = This is not valid email address.

invitation-select-language = Select language

invitation-select-role = Select role

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
module-create-draft-alert-success = Draft has been created



## Screens - notification centre

notification-centre-view-title = Notifications

notification-centre-empty = No notifications found



## Screens - user's profile

# Title displayed when viewing user's own profile.
user-profile-view-title-your = Your profile

# Title displayed when viewing another user's profile.
#
# Variables:
# - $name (string): user's name
user-profile-view-title-named = { $name }'s profile

user-profile-section-teams-members = Your teams' members

user-profile-section-bio = Bio

user-profile-section-contact = Contact

user-profile-section-role = User's role

# Variables:
# - $role (string): role name
# - $team (string): team name
user-profile-role-in-team = { $role } in team { $team }

# Variables:
# - $team (string): team name
user-profile-no-role-in-team = No role in the team { $team }

user-profile-role-unknown = Unknown role

user-profile-section-role-unassign =  Unassign user from role

## Variables
# $role: (string) - new role name
user-profile-role-change = Change user's role to: { $role }?

user-profile-role-remove = Remove user's role?

user-profile-role-button-cancel = Cancel

user-profile-role-button-change = Change

user-profile-role-button-remove = Remove

# Alert displayed when user's role has been changed successfully.
#
# Variables:
# - $name (string): name of role which has been assigned to user.
user-profile-change-role-success = Role had been changed to { $name }

# Alert displayed when error occurred when changing user's role.
#
# Variables:
# - $details (string): error details.
user-profile-change-role-error = Something went wrong. Details: { $details }

user-profile-unassign-role-success = User has been unassigned from role

# Alert displayed when error occurred when unassiging user from role.
#
# Variables:
# - $details (string): error details.
user-profile-unassign-role-error = Something went wrong. Details: { $details }

user-profile-users-drafts = User's drafts

user-profile-system-permissions = User's system permissions

user-profile-system-permissions-change-success = Successfully updated user's permissions

user-profile-system-permissions-change-error = Couldn't update user's permissions

# Variables:
# - $team (string): team name.
user-profile-team-list-team = Members of team { $team }

# Placeholder text for team search box.
user-profile-team-list-search =
  .placeholder = Search for user

user-profile-team-list-no-results = There are no users with specified criteria



## Screens - user's profile - update dialog

user-profile-update-name-success = Name has been changed

user-profile-update-name-error = Couldn't change name

user-profile-update-avatar-title = Upload file for your avatar

user-profile-update-name-title = Update your name

# Placeholder text for name input.
user-profile-update-name =
  .placeholder = Name

user-profile-update-confirm = Confirm

# Message displayed below name input when it has fewer than three characters.
user-profile-name-validation-error = Name has to be at least 3 characters long.



## Screens - resources

resources-view-title = Resources

resources-add-title = Add new resource

resources-add-folder = Add folder

resources-add-file = Add file

resources-name-placeholder =
  .placeholder = Name

resources-add-cancel = Cancel

resources-add-confirm = Confirm

resources-add-success = New resource has been added

resources-add-error = We couldn't add this resource

# Variables:
# - $team (string): team in which this resource exists.
resources-card-team = Team: { $team }

resources-card-edit = Edit

resources-card-edit-title = Edit this resource

resources-edit-cancel = Cancel

resources-edit-update = Update

resources-edit-success = Successfully updated resource

resources-edit-error = We couldn't update this resource



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
settings-change-password-alert-success = Password has been changed

# Alert displayed when password could not be changed.
settings-change-password-alert-error = Password has not been changed



## Screens - settings - language change dialog

settings-language-dialog-title = Are you sure you want to change language?

settings-language-dialog-confirm = Confirm

settings-language-dialog-cancel = Cancel



## Screens - helpdesk

helpdesk-view-title = Helpdesk

helpdesk-export-local-database = Export database

helpdesk-export-local-database-loading = Exporting...

# Variables:
# - $details (string): error details
helpdesk-export-error = We couldn't export your database. Details: { $details }

helpdesk-import-local-database = Import database

helpdesk-import-invalid-file = Invalid import file. Please contact with administrator.

helpdesk-import-database-title = Import database from file

helpdesk-import-cancel = Cancel

helpdesk-import-confirm = Import database

helpdesk-import-success = Database has been replaced

helpdesk-import-error-uploaded-database = We couldn't read from the uploaded file

# Variables:states
# - $details (string): error details
helpdesk-import-error = We couldn't replace this database. Details: { $details }



## Screens - teams

teams-section-manage-teams-title = Manage teams

teams-error-fetch = Couldn't fetch teams

teams-add-team =
  .value = Add team

teams-add-team-placeholder =
  .placeholder = Team name

# Variables:
# - $name (string): name of created team.
teams-add-team-success = { $name } team has been created

teams-add-team-error = Couldn't create new team

teams-update-name-success = Team name has been updated

teams-update-name-error = Couldn't update team name

# Variables:
# - $team (string): name of selected team.
teams-section-manage-roles-title = Manage roles in: { $team }

teams-role-name =
  .placeholder = Role name

teams-role-create =
  .value = Create role

# Alert displayed when role has been created.
#
# Variables:
# - $name (string): name of role which user created.
teams-role-create-success = New role “{ $name }” has been created

# Alert displayed when role has not been created.
#
# Variables:
# - $details (string): error details.
teams-role-create-error = Couldn't create new role. Details: { $details }

teams-tab-roles = Roles

teams-tab-members = Team members

# Variables:
# - $team (string): name of selected team.
teams-section-manage-members-title = Manage members in: { $team }

teams-no-members = This team doesn't have any members

teams-member-cancel = Cancel

teams-member-remove = Remove

# Variables:
# - $user (string): name of user to remove.
# - $team (string): name of team from which user will be removed.
teams-member-remove-confirm-dialog = Do you want to remove { $user } from team { $team }?

teams-member-remove-success = User has been removed from team

teams-member-remove-error = Couldn't remove user from team

teams-member-role-change-success = User’s role has been changed

teams-member-role-change-error = Couldn't change user's role

teams-member-permissions-change-success = User's permissions has been changed

teams-member-permissions-change-error = Couldn't change user's permissions

teams-select-user = Select user

teams-select-role = Select role

teams-member-add =
  .value = Invite

teams-member-add-success = Invitation has been sent

teams-member-add-error = Couldn't sent invitation



## Reusable components - team selector

team-selector-placeholder = Select team



## Reusable components - role manager

role-manager-edit = Edit

role-manager-remove = Remove

# Alert displayed when role has been created.
#
# Variables:
# - $name (string): name of role which user created.
role-manager-create-success = New role “{ $name }” has been created

# Alert displayed when role has not been created.
#
# Variables:
# - $details (string): error details.
role-manager-create-error = Couldn't create new role. Details: { $details }

# Dialog displayed when user want to delete role.
#
# Variables:
# - $name (string): name of role which user want to delete.
role-manager-delete-title = Are you sure you want to delete “{ $name }” role?

role-manager-delete-confirm = Confirm

role-manager-delete-cancel = Cancel

# Alert displayed when role has been deleted.
#
# Variables:
# - $name (string): name of role which user deleted.
role-manager-delete-success = Role “{ $name }” has been deleted

# Alert displayed when role has not been deleted.
#
# Variables:
# - $details (string): error details.
role-manager-delete-error = Couldn't delete role. Details: { $details }

# Alert displayed when role has been updated.
#
# Variables:
# - $name (string): name of role which user updated.
role-manager-update-success = Role “{ $name }” has been updated

# Alert displayed when role has not been updated.
#
# Variables:
# - $details (string): error details.
role-manager-update-error = Couldn't update role. Details: { $details }

role-manager-update-confirm =
  .value = Update role

role-manager-update-cancel = Cancel



## Screens - processes

processes-view-title = Manage processes

processes-view-add = Add new process

processes-view-preview = Process preview

# Alert displayed when process has been created.
#
# Variables:
# - $name (string): name of process which was created.
process-create-success = Process “{ $name }” has been created

# Alert displayed when process has not been created.
#
# Variables:
# - $details (string): error details.
process-create-error = Couldn't create new process. Details: { $details }

# Alert displayed when name of process has been updated.
process-update-name-success = Name has been updated

# Alert displayed when name has not been updated.
#
# Variables:
# - $details (string): error details.
process-update-name-error = Couldn't update name. Details: { $details }

process-update-success = Process has been updated

process-update-error = Some changes could not be applied

process-update-warning-new-version = Warning! New version will be created

# Fragments:
# - <p> ... </p>: paragraph content
process-update-warning-new-version-content =
  <p>Changes which you made require creating new version of this process.</p>
  <p>All drafts using current process will not be affected by this change.</p>
  <p>You will see changes which you made only for drafts started after creating this version.</p>

process-update-warning-new-version-cancel = Cancel

process-update-warning-new-version-confirm = Create new version

# Alert displayed when version of process has been created.
#
# Variables:
# - $name (string): name of new version which was created.
process-create-version-success = Version “{ $name }” has been created

# Alert displayed when version has not been created.
#
# Variables:
# - $details (string): error details.
process-create-version-error = Couldn't create new version. Details: { $details }

# Variables:
# - $team (string): team in which this process exists.
processes-team = Team: { $team }



## Components for creating and updating process

process-form-create = Create process

process-form-save-changes = Save changes

process-form-cancel = Cancel

process-form-remove = Remove

process-form-process-name = Process name

process-form-process-team = Team

process-form-process-starting-step = Starting step

process-form-slot-title = List of slots:

process-form-slot-add = Add slot

process-form-slot-remove = Remove slot

process-form-slot-name = Slot name:

process-form-slot-autofill = Automatically assign users:

process-form-slot-role = Roles:

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

process-form-error-team = Please specify in which team you want create process.

process-form-error-name = Please specify a name of this process.

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
  Each link must have a target and a specified slot which can use it.



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
# - $roles (string): role names for this slot.
process-preview-roles = Roles: { $roles }

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

begin-process-info = You are about to begin process for:

begin-process-start = Start process

# Alert displayed when process has been started.
#
# Variables:
# - $process (string): name of process which was started.
# - $success (number): number of modules for which process was started.
# - $total (number): total number of modules for which process should be started.
begin-process-success = Started process “{ $process }” for { $success }/{ $total } modules

# Alert displayed when process has not been started.
#
# Variables:
# - $module (string): title of module for which process wasn't started.
begin-process-error = Couldn't start process for „{ $module }”

begin-process-assign-user-title = Select user for this slot

begin-process-slots-title = Configure slots:

begin-process-assign-user = Select user

begin-process-unassign-user = Unassign user



## Reusable components - update slots

update-slots-title = Manage slots assignments:

# Variables:
# - $name (string): slot name.
# - $roles (string): role names for this slot.
update-slots-name = { $roles ->
  [undefined] { $name }
 *[roles] { $name } for users with roles: { $roles }
}

update-slots-assign-user = Select user

update-slots-unassign-user = Unassign user

# Variables:
# - $slot (string): slot name.
# - $roles (string): role names for this slot.
update-slots-assign-user-title = Select user { $roles ->
  [undefined] for slot: { $slot }
 *[roles] with one of those roles: { $roles } for slot: { $slot }
}

# Alert displayed when there was an error while fetching data.
update-slots-fetching-error = Couldn't fetch details about slots in this process. Please try again later.



## Reusable components - draft info

draft-info-main-button = Process information

draft-info-title = Process information for this draft

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

free-slots-not-assigned = Not assigned to any book

free-slots-view-draft = View draft

free-slots-not-avaible = There are no free slots for you to take

free-slots-take-slot = Take slot

# Alert displayed when user assign himself to a free slot.
#
# Variables:
# - $slot (string): name of slot which was taken.
# - $draft (string): draft name for which user was assigned.
free-slots-success = You've been assigned to “{ $draft }” with slot: { $slot }

# Alert displayed when there was an error while taking free slot.
#
# Variables:
# - $details (string): error details.
free-slots-error = Couldn't assign you to this slot. { $details ->
 *[string] Details: { $details }
  [none] {""}
}

free-slots-confirm-title = Take slot

free-slots-confirm-info = You will be assigned to the draft and process manager
  will be informed that you are willing to work on this task.

free-slots-cancel = Cancel

free-slots-confirm = Confirm



## Reusable components - step changer

step-changer-main-button = Advance my work to the next step

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
step-changer-error = Couldn't advance to the next step. Details: { $details }

step-changer-details-dialog-title = Choose next step

step-changer-confirm-dialog-title = Do you want to advance this draft to the next step?

step-changer-unsaved-changes = There are unsaved changes

step-changer-advance = Advance

step-changer-cancel = Cancel

step-changer-discard-advance = Discard changes and advance

step-changer-save-advance = Save and advance

# Alert displayed when there was an error while saving and advancing to the next step.
#
# Variables:
# - $details (string): error details.
step-changer-save-advance-error = Couldn't save and advance to the next step. Details: { $details }

step-changer-dialog-suggestions = Please resolve all suggestions

# Variables:
# - $document (number): number of suggestions inside document.
# - $glossary (number): number of suggestions inside glossary.
step-changer-dialog-suggestions-info = You have { $document } unresolved { $document ->
  [1] suggestion
 *[more] suggestions
} in document and { $glossary } in glossary. Please accept or reject all of them.

step-changer-dialog-suggestions-ok = OK

step-changer-dialog-wrong-target-title = Wrong target

step-changer-dialog-wrong-target = We couldn't find target which you selected.
  Please try again later or contact administrator.

# Variables:
# - $document (number): number of suggestions inside document.
# - $glossary (number): number of suggestions inside glossary.
# - $total (number): total number of suggestions inside draft.
step-changer-dialog-wrong-target-suggestions = You cannot go to this step because the draft
  has { $total } visible changes.



## Reusable components - permissions

# Variables:
# - $name (string): name of permission.
permission-label = { $name ->
  [user-edit] Edit user's profiles
  [user-edit-permissions] Edit user's permissions
  [user-delete] Delete users
  [team-manage] Manage teams
  [member-add] Add team members
  [member-remove] Remove team members
  [member-assign-role] Assign roles to team members
  [member-edit-permissions] Edit team members permissions
  [book-edit] Create, delete and edit book content
  [module-edit] Create, delete and edit modules
  [role-edit] Create, delete and edit roles
  [editing-process-edit] Create and edit processes
  [editing-process-manage] Assign modules to processes
  [resources-manage] Managing resources
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

navigation-profile = Your Profile

navigation-settings = Settings

navigation-logout = Logout

navigation-helpdesk = Helpdesk

navigation-invite = Invitations

navigation-roles = Roles

navigation-teams = Teams and Roles

navigation-processes = Editing Processes



## Reusable components - team switcher
##
## This component is displayed at all times and allows user to switch team for which
## he should see resources.

team-switcher-select-placeholder = Select Teams



## Reusable components - select list

select-list-select-all = Select all




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

# Variables:
# - $multiple (string): true or false
# - $optional (string): true or false
file-upload-select-files = Drop { $multiple ->
  [true] files
 *[false] file
} here or click to upload { $optional ->
  [true] (optional)
 *[false] (required)
}

file-upload-remove-all = Remove all files

# Variables:
# - $code (number): error code for react-files component
file-upload-error = { $code ->
  [1] Invalid file type
  [2] File too large
  [3] File too small
  [4] Maximum file count reached
 *[unknowncode] Unknown error occurred while loading file
}



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
module-list-add-module-alert-success = Module { $title } has been added



## Reusable components - list of modules - module deletion dialog

module-list-delete-module-title = Deleting module is permanent

module-list-delete-module-confirm = Delete

module-list-delete-module-cancel = Cancel

# Alert displayed when a module was deleted.
#
# Variables:
# - $title (string): module's title
module-list-delete-module-alert-success = { $title } has been deleted



## Reusable components - chat and message input

message-input-textarea =
  .placeholder = Type your message...

message-input-send = Send

message-input-alert-select-user-error =
  Something went wrong while selecting user



## Reusable components - list of reference targets

reference-target-list-go-back = Back

reference-target-list-tab-local = This document

reference-target-list-tab-remote = Other documents

reference-target-list-tab-remote-not-assigned = Not assigned to any book

reference-target-link-module = Link to this module



## Reusable components - error boundary

error-boundary-title = Something went wrong

# Variables:
# - $hasReport (string): true | false depends if Sentry received automatic report.
# Fragments:
# - <p> ... </p>: text in new paragraph
error-boundary-info =
  <p>To prevent errors from corrupting your document we disabled editing until
  you reload the page. Don't worry about your work, it has been auto-saved and
  will be restored after reloading the page.</p>
  { $hasReport ->
    [true] <p>We have already received an automatic error report, but we would appreciate if
    you could spare some time and give us more detailed feedback.</p>
   *[false] {""}
  }

error-boundary-button-go-to-dashboard = Go to Dashboard

error-boundary-button-reload = Reload page

error-boundary-button-fill-report = Fill out a report



## Reusable components - load component

load-error-message =
  <p>There was an error while loading part of this page.</p>
  <p>Please reload this page.</p>
  <p>If error will still occurs please contact administrator.</p>

load-error-persistance = We suspect you are currently using incognito mode which is
  not supported by Adaptarr!. Switch to normal window mode to continue. If you are seeing
  this message in normal window mode, contact hepldesk@openstax.pl



## Reusable components - book card

# Variables:
# - $team (string): team in which this book exists.
book-card-team = Team: { $team }

book-card-edit = Edit

book-card-remove = Remove



## Reusable components - editable text

# Variables:
# - $min (numner): number of minimum required character
editable-text-error-min-length = Minimum { $min } characters required.

# Variables:
# - $max (number): number of maximum allowed characters
editable-text-error-max-length = Maximum { $max } characters allowed.



## Reusable components - process selector

process-selector-title = Select process:

process-selector-placeholder =
  .placeholder = Select...



## Editor - document title

# Placeholder text for document title
editor-document-title-value =
  .placeholder = Title of draft

# Alert displayed when document title was changed.
editor-document-title-save-alert-success = Title has been updated

# Alert displayed when document title could not be changed.
editor-document-title-save-alert-error = Couldn't update the title



## Editor - toolboxes

editor-toolbox-no-selection = Please click on text to show toolbox.

editor-toolbox-multi-selection = Selection across elements is not yet supported



## Editor - toolboxes - save

editor-tools-save = Save

# Alert displayed when document was saved.
editor-tools-save-alert-success = Draft has been saved

# Alert displayed when document could not be saved.
editor-tools-save-alert-error = Draft couldn't be saved

editor-tools-save-error-title = Backup

# Variables:
# - $error (string): error message
# Fragments:
# - <p> ... </p>: paragraph
editor-tools-save-error-content =
  <p>The document could not be saved to the server, but you still have all of your work
  securely stored in your browser on this computer.</p>
  <p>Download the backup and return to working on the text. In this situation,
  we recommend working on a file on the same computer.</p>
  <p>If you want to transfer work to the next stage, send a backup by email
  to helpdesk@openstax.pl</p>

editor-tools-save-error-export = Download backup

editor-tools-save-export-title = Send the downloaded file to the administrator if you want
  to transfer the work to the next stage.

editor-tools-save-export-ok = OK



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

editor-tools-insert-tools-title = Insert

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

editor-tools-xref-title = Reference to element

editor-tools-docref-title = Reference to module

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



## Editor toolboxes - code

editor-tools-code-title = Code

editor-tools-code-lang =
  .placeholder = Programming language



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

editor-tools-definition-insert-seealso = Add “see also”



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



## Editor toolboxes - suggestions

# Variables:
# - $counter (number): total number of suggestions.
editor-tools-suggestions-title = Suggestions ({ $counter })

editor-tools-suggestion-accept-all = Accept all

editor-tools-suggestion-reject-all = Reject all

editor-tools-suggestion-undefined = Undefined suggestion

# Variables:
# - $insert (string): text to insert.
# Fragments:
# - <action> ... </action>: action name.
# - <content> ... </content>: content.
editor-tools-suggestion-insert = <action>Add</action> <content>{ $insert }</content>

# Variables:
# - $delete (string): text to delete.
# Fragments:
# - <action> ... </action>: action name.
# - <content> ... </content>: content.
editor-tools-suggestion-delete = <action>Remove</action> <content>{ $delete }</content>

# Variables:
# - $insert (string): text to insert.
# - $delete (string): text to delete.
# Fragments:
# - <action> ... </action>: action name.
# - <content> ... </content>: content.
editor-tools-suggestion-change =
  <action>Replace</action> <content>{ $delete }</content> with <content>{ $insert }</content>



## Reusable component - confirm dialog

confirm-dialog-button-cancel = Cancel

confirm-dialog-button-ok = OK
