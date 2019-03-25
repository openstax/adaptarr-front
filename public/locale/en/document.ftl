### Localization file for document.



## Admonitions

# Label displayed above an admonition without a title.
#
# Variables:
# - $type (string): admonition's type. Possible values are 'note', 'warning',
#   'important', and 'tip'.
admonition-label = { $type ->
 *[note] Note
  [warning] Warning
  [important] Important
  [tip] Tip
}



## Exercises

exercise-label = Exercise

exercise-problem-label = Problem:

exercise-solution-label = Solution { $solution }:

exercise-commentary-label = Commentary:



## Figures

# A short fragment of text displayed before a figure's caption, used
# to identify it.
#
# This will be displayed directly before the caption. If the target language
# requires space between label and caption end label with `{ " " }` (as is done
# here for English).
#
# Variables:
# - $figure (number): figure's number
figure-label = Figure { $figure }:{ " " }



## References
##
## References are small fragments of text that name other elements in
## a document.
##
## This section defines text of those references, for each element that can
## be referenced. Besides arguments which are specific to a reference target
## all labels also take a set of common arguments, which are described below.
##
## Variables:
## - $case (string): grammatical case in which the reference is used. Possible
##     values are limited to lower-case English names of cases in use in current
##     language.

# Target element is a note.
#
# Variables:
# - $admonition (number): target note's number
xref-label-note = Note { $admonition }

# Target element is a type=important note.
#
# Variables:
# - $admonition (number): target note's number
xref-label-important = Important { $admonition }

# Target element is a type=warning note.
#
# Variables:
# - $admonition (number): target note's number
xref-label-warning = Warning { $admonition }

# Target element is a type=tip note.
#
# Variables:
# - $admonition (number): target note's number
xref-label-tip = Tip { $admonition }

# Target element is an equation.
#
# Variables:
# - $equation (number): target equation's number
xref-label-equation = Equation { $equation }

# Target element is an example.
#
# Variables:
# - $example (number): target example's number
xref-label-example = Example { $example }

# Target element is an exercise.
#
# Variables:
# - $exercise (number): target exercise's number
xref-label-exercise = Exercise { $exercise }

# Target element is a solution of an exercise.
#
# Variables:
# - $exercise (number): target solution's parent exercise's number
# - $solution (number): target solution's number
xref-label-exercise_solution = Solution { $exercise }.{ $solution }

# Target element is a standalone figure.
#
# Variables:
# - $figure (number): target figure's number
xref-label-figure = Figure { $figure }

# Target element is a table.
#
# Variables:
# - $table (number): target table's number
xref-label-table = Table { $table }
