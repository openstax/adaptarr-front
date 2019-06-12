### Localization file for document.



## Admonitions

# Label displayed above an admonition without a title.
#
# Variables:
# - $type (string): admonition's type. Possible values are 'note', 'warning',
#   'important', and 'tip'.
admonition-label = { $type ->
  [note] Notka
  [warning] Ostrzeżenie
  [important] Ważne
  [tip] Uwaga
 *[noavalidtype] Notka ({ $type })
}



## Exercises

exercise-label = Ćwiczenie

exercise-problem-label = Problem { $exercise }:

exercise-solution-label = Rozwiązanie { $exercise }.{ $solution }:

exercise-commentary-label = Komentarz:



## Figures

# A short fragment of text displayed before a figure's caption, used
# to identify it.
#
# This will be displayed directly before the caption. If the target language
# requires space between label and caption end label with `{ " " }` (as is done
# here for Polish).
#
# Arguments:
# - $figure (number): figure's number
figure-label = Rysunek { $figure }:{ " " }



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



## References
##
## References are small fragments of text that name other elements in
## a document.
##
## This section defines text of those references, for each element that can
## be referenced. Besides arguments which are specific to a reference target
## all labels also take a set of common arguments, which are described below.
##
## Arguments:
## - $case (string): grammatical case in which the reference is used. Possible
##     values are limited to lower-case English names of cases in use in current
##     language.

# Target element is a note.
#
# Arguments:
# - $note (number): target note's number
xref-label-note = { $case ->
 *[nominative]    Notka
  [genitive]      Notki
  [dative]        Notce
  [accusative]    Notkę
  [instrumental]  Notką
  [locative]      Notce
  [vocative]      Notko
} { $note }

# Target element is a type=important note.
#
# Arguments:
# - $note (number): target note's number
xref-label-important = Ważne { $note }

# Target element is a type=warning note.
#
# Arguments:
# - $note (number): target note's number
xref-label-warning = { $case ->
 *[nominative]    Ostrzeżenie
  [genitive]      Ostrzeżenia
  [dative]        Ostrzeżeniu
  [accusative]    Ostrzeżenie
  [instrumental]  Ostrzeżeniem
  [locative]      Ostrzeżeniu
  [vocative]      Ostrzeżenie
} { $note }

# Target element is a type=tip note.
#
# Arguments:
# - $note (number): target note's number
xref-label-tip = { $case ->
 *[nominative]    Uwaga
  [genitive]      Uwagi
  [dative]        Uwadze
  [accusative]    Uwagę
  [instrumental]  Uwagą
  [locative]      Uwadze
  [vocative]      Uwago
} { $note }

# Target element is an equation.
#
# Arguments:
# - $equation (number): target equation's number
xref-label-equation = { $case ->
 *[nominative]    Równanie
  [genitive]      Równania
  [dative]        Równaniu
  [accusative]    Równanie
  [instrumental]  Równaniem
  [locative]      Równaniu
  [vocative]      Równanie
} { $equation }

# Target element is an example.
#
# Arguments:
# - $example (number): target example's number
xref-label-example = { $case ->
 *[nominative]    Przykład
  [genitive]      Przykładu
  [dative]        Przykładowi
  [accusative]    Przykład
  [instrumental]  Przykładem
  [locative]      Przykładzie
  [vocative]      Przykładzie
} { $example }

# Target element is an exercise.
#
# Arguments:
# - $exercise (number): target exercise's number
xref-label-exercise = { $case ->
 *[nominative]    Ćwiczenie
  [genitive]      Ćwiczenia
  [dative]        Ćwiczeniu
  [accusative]    Ćwiczenie
  [instrumental]  Ćwiczeniem
  [locative]      Ćwiczeniu
  [vocative]      Ćwiczenie
} { $exercise }

# Target element is a solution of an exercise.
#
# Arguments:
# - $exercise (number): target solution's parent exercise's number
# - $exercise_solution (number): target solution's number
xref-label-exercise_solution = { $case ->
 *[nominative]    Rozwiązanie
  [genitive]      Rozwiązania
  [dative]        Rozwiązaniu
  [accusative]    Rozwiązanie
  [instrumental]  Rozwiązaniem
  [locative]      Rozwiązaniu
  [vocative]      Rozwiązanie
} { $exercise_solution } ćwiczenia { $exercise }

# Target element is a solution of an exercise.
#
# Arguments:
# - $solution (number): target solution's number
xref-label-solution = { $case ->
 *[nominative]    Rozwiązanie
  [genitive]      Rozwiązania
  [dative]        Rozwiązaniu
  [accusative]    Rozwiązanie
  [instrumental]  Rozwiązaniem
  [locative]      Rozwiązaniu
  [vocative]      Rozwiązanie
} { $solution }

# Target element is a commentary of an exercise.
#
# Variables:
# - $commentary (number): target commentary's number
xref-label-commentary = { $case ->
 *[nominative]    Komentarz
  [genitive]      Komentarza
  [dative]        Komentarzu
  [accusative]    Komentarz
  [instrumental]  Komentarzem
  [locative]      Komentarzu
  [vocative]      Komentarz
} { $commentary }

# Target element is a standalone figure.
#
# Arguments:
# - $figure (number): target figure's number
xref-label-figure = { $case ->
 *[nominative]    Rysunek
  [genitive]      Rysunku
  [dative]        Rysunkowi
  [accusative]    Rysunek
  [instrumental]  Rysunkiem
  [locative]      Rysunku
  [vocative]      Rysunku
} { $figure }

# Target element is a table.
#
# Arguments:
# - $table (number): target table's number
xref-label-table = { $case ->
 *[nominative]    Tabela
  [genitive]      Tabeli
  [dative]        Tabeli
  [accusative]    Tabelę
  [instrumental]  Tabelą
  [locative]      Tabeli
  [vocative]      Tabelo
} { $table }

## Definitions

definition-label = Definicja dla

definition-example-label = Przykład

definition-seealso-label = Zobacz również
