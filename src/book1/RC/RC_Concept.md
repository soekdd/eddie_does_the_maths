# Eddie rechnet: Der Würfel, der nicht alles kann

> **Arbeitsfassung für ein Eddie-rechnet-Kapitel**  
> Thema: Zauberwürfel, Permutationen, Parität, Kommutatoren  
> Zeitrahmen: Weihnachten 1985 / historisch plausibel für Eddie  
> Nicht verwenden: *God’s Number = 20* — das wird erst 2010 bewiesen.

---

## 0. Szenischer Einstieg

Vidar legt den Würfel in meine Hand, als wäre es nur ein Spielzeug. Sechs Farben, kleine Quadrate, ein bisschen Plastik. Ich drehe eine Seite, dann noch eine, und sofort ist die Ordnung weg. Das ist der Trick. Der Würfel tut so, als wären seine Farben frei. Als könnte man alles überallhin drehen, solange man nur lange genug probiert.

Aber das stimmt nicht.

Ich halte ihn dichter ans Licht. Die Mittelsteine bleiben stehen. Weiß bleibt weiß, rot bleibt rot, blau bleibt blau. Die Mitte wandert nicht. Sie ist das Koordinatensystem. Alles andere bewegt sich darum herum.

Vidar grinst.

„Und?“, fragt er. „Magst du ihn?“

Ich nicke. Natürlich mag ich ihn. Er ist klein, frech und voller Regeln, die er nicht zugibt.

Ich drehe eine Ecke zwischen zwei Fingern und denke: Der Würfel ist kein Farbspiel. Er ist eine Maschine für Permutationen.

---

## 1. Der Würfel sieht aus wie ein Spielzeug

Ein gelöster Zauberwürfel hat außen sechs einfarbige Seiten. Auf jeder Seite sind neun sichtbare Quadrate. Also könnte man glauben, er bestünde aus 54 einzelnen Farbplättchen.

Aber das ist falsch gedacht.

Die sichtbaren Flächen gehören zu beweglichen Steinen:

- 8 Ecksteine mit je 3 sichtbaren Farben
- 12 Kantensteine mit je 2 sichtbaren Farben
- 6 Mittelsteine mit je 1 sichtbaren Farbe

Die Mittelsteine verraten die Seitenfarben. Sie können sich zwar auf ihrer eigenen Stelle drehen, aber sie tauschen nicht miteinander. Für den normalen 3×3×3-Würfel legen sie also fest, was „oben“, „unten“, „vorn“, „hinten“, „links“ und „rechts“ bedeutet.

Damit ist der Würfel kein freies Farbmosaik, sondern ein System aus Steinen, die bestimmte Plätze einnehmen und dabei eine bestimmte Orientierung haben.

Ich muss also nicht Farben zählen. Ich muss Steine zählen.

---

## 2. In Wahrheit ist er eine Permutationsmaschine

Zuerst zähle ich großzügig, also absichtlich zu groß.

Die 8 Ecksteine könnten auf den 8 Eckplätzen beliebig vertauscht werden:

$$
8!
$$

Jede Ecke kann drei Drehstellungen haben:

$$
3^8
$$

Die 12 Kantensteine könnten auf den 12 Kantenplätzen beliebig vertauscht werden:

$$
12!
$$

Jede Kante kann zwei Kippstellungen haben:

$$
2^{12}
$$

Naiv ergäbe das:

$$
8! \cdot 3^8 \cdot 12! \cdot 2^{12}
$$

Aber das ist zu viel.

Denn der echte Würfel kann nicht alles, was man sich äußerlich vorstellen kann. Wenn man ihn auseinanderbaut und falsch wieder zusammensetzt, können Stellungen entstehen, die durch Drehen niemals erreichbar sind.

Der Würfel ist strenger als seine Farben.

---

## 3. Nicht alle scheinbaren Zustände sind möglich

Es gibt drei wichtige Einschränkungen.

### 3.1 Eckenverdrehung

Wenn ich eine einzelne Ecke herausnehme und verdreht wieder hineinsetze, sieht das nur wie ein kleiner Fehler aus. Aber durch legale Würfeldrehungen kann keine einzelne Ecke allein verdreht werden.

Die Summe aller Eckenverdrehungen bleibt immer durch 3 teilbar:

$$
\sum \text{Eckendrehungen} \equiv 0 \pmod 3
$$

Also sind nicht alle $3^8$ Eckenorientierungen möglich, sondern nur:

$$
3^7
$$

Die letzte Ecke ist durch die sieben anderen festgelegt.

### 3.2 Kantenkippung

Dasselbe gilt für Kanten. Eine einzelne gekippte Kante kann man nicht durch legale Züge erzeugen. Die Anzahl der gekippten Kanten bleibt gerade:

$$
\sum \text{Kantenkippungen} \equiv 0 \pmod 2
$$

Also sind nicht alle $2^{12}$ Kantenorientierungen möglich, sondern nur:

$$
2^{11}
$$

Die letzte Kante ist durch die elf anderen festgelegt.

### 3.3 Parität der Permutation

Noch eine Regel: Man kann nicht einfach zwei Ecksteine vertauschen und alles andere unverändert lassen. Ebenso wenig kann man nur zwei Kantensteine vertauschen.

Die Parität der Eckenpermutation und die Parität der Kantenpermutation müssen zusammenpassen. Deshalb fällt noch einmal ein Faktor 2 weg.

Damit ergibt sich die Zahl der legal erreichbaren Würfelstellungen:

$$
\frac{8! \cdot 3^7 \cdot 12! \cdot 2^{11}}{2}
$$

Das ist:

$$
43\,252\,003\,274\,489\,856\,000
$$

Also ungefähr:

$$
4{,}3 \cdot 10^{19}
$$

Der Würfel hat mehr als dreiundvierzig Trillionen erreichbare Stellungen. Aber er hat nicht alle Stellungen, die man mit seinen Steinen äußerlich zusammenbauen könnte.

Das ist der erste richtige Satz über ihn:

> Der Zauberwürfel ist nicht deshalb interessant, weil er so viele Möglichkeiten hat.  
> Er ist interessant, weil er so viele Möglichkeiten **nicht** hat.

---

## 4. Bewegungen vertauschen sich nicht

Jetzt kommt der Teil, der mich am meisten freut.

Beim normalen Rechnen ist die Reihenfolge oft egal:

$$
a + b = b + a
$$

Wenn ich erst 3 und dann 5 addiere, ist das dasselbe, als würde ich erst 5 und dann 3 addieren.

Beim Würfel stimmt das fast nie.

Ich nenne eine Drehung der rechten Seite $R$ und eine Drehung der oberen Seite $U$.

Dann ist im Allgemeinen:

$$
R U \ne U R
$$

Ich kann das sofort ausprobieren.

- Erst rechts drehen, dann oben drehen.
- Zurück zum Anfang.
- Erst oben drehen, dann rechts drehen.

Das Ergebnis ist nicht dasselbe.

Der Würfel ist also nicht-kommutativ. Die Reihenfolge der Handlungen ist Teil der Handlung.

Das klingt abstrakt, aber am Würfel sieht man es mit den Händen.

Vidar sagt, ich solle nicht so ernst gucken. Ich sage ihm, dass der Würfel gerade bewiesen hat, dass Reihenfolge ein Gedächtnis ist.

---

## 5. Aus Nichtvertauschbarkeit entstehen Kommutatoren

Wenn zwei Bewegungen nicht vertauschbar sind, kann man ihre Nichtvertauschbarkeit isolieren. Dafür gibt es einen sehr schönen Ausdruck:

$$
A B A^{-1} B^{-1}
$$

Das heißt:

1. Mache $A$.
2. Mache $B$.
3. Mache $A$ rückwärts.
4. Mache $B$ rückwärts.

Wenn $A$ und $B$ vertauschbar wären, würde alles verschwinden. Dann wäre das Ergebnis wieder der Anfang.

Aber beim Würfel bleibt oft etwas übrig.

Nicht alles. Nur eine kleine, gezielte Störung.

Genau das macht Kommutatoren so nützlich. Sie sind keine rohen Zerstörungen, sondern chirurgische Eingriffe. Man bewegt wenige Steine, während vieles andere wieder zurückkehrt.

Ich denke mir:

> Ich zerstöre etwas.  
> Ich zerstöre etwas anderes.  
> Ich nehme das erste zurück.  
> Ich nehme das zweite zurück.  
> Und übrig bleibt nur die Wechselwirkung.

Das ist der Zauber im Zauberwürfel. Nicht die Farben. Die Wechselwirkung.

---

## 6. Konjugation: denselben Trick an einer anderen Stelle verwenden

Noch ein zweiter Ausdruck ist wichtig:

$$
X A X^{-1}
$$

Das heißt:

1. Bringe den Würfel in eine Lage, in der ein bekannter Trick wirkt.
2. Führe den Trick $A$ aus.
3. Bringe den Würfel zurück.

Der Trick bleibt derselbe, aber sein Wirkungsort verändert sich.

Das ist wie bei einer Werkbank. Ich muss nicht für jede Stelle des Würfels ein neues Werkzeug erfinden. Ich bringe das Problem zur Werkbank, arbeite dort, und bringe alles zurück.

Mathematisch heißt das Konjugation.

Praktisch heißt es:

> Ein guter Algorithmus ist nicht nur eine Zugfolge.  
> Ein guter Algorithmus ist ein Werkzeug, das man an die richtige Stelle trägt.

Das gefällt mir besser als Auswendiglernen. Ich will nicht hundert Sprüche aufsagen. Ich will wissen, warum ein Spruch wirkt.

---

## 7. Schon 1985 kennt man Schranken — aber nicht die genaue Grenze

Jetzt kommt die Frage, die sofort entsteht:

Wenn es so viele Stellungen gibt, wie weit kann eine Stellung vom gelösten Würfel entfernt sein?

Mit „weit“ meine ich: Wie viele Züge braucht man mindestens, wenn man perfekt löst?

Man kann eine untere Schranke durch Zählen bekommen.

Wenn ich nur sehr kurze Zugfolgen zulasse, dann gibt es davon nicht genug, um alle möglichen Würfelstellungen zu erreichen. Also muss es Stellungen geben, die länger brauchen.

Die Idee ist einfach:

$$
\text{Anzahl kurzer Zugfolgen} < \text{Anzahl Würfelstellungen}
$$

Dann können kurze Zugfolgen nicht ausreichen, um jede Stellung zu lösen.

1985 darf Eddie wissen oder zumindest plausibel herleiten:

- Es gibt Stellungen, die mindestens 18 Züge brauchen.
- Es gibt theoretische Verfahren, die jede Stellung in einer beschränkten Zahl von Zügen lösen.
- Eine bekannte obere Schranke aus dieser Zeit ist Thistlethwaites 52-Züge-Verfahren von 1981.

Aber Eddie darf 1985 **nicht** wissen:

> Jede Stellung ist in höchstens 20 Zügen lösbar.

Diese exakte Zahl wird erst Jahrzehnte später bewiesen.

Für Eddie ist deshalb der offene Rand interessant. Der Würfel ist nicht fertig verstanden. Er liegt in ihrer Hand und ist zugleich Spielzeug, Gruppe, Suchproblem und Versprechen.

Sie kann ihn lösen. Aber sie kann nicht wissen, wie kurz es im schlimmsten Fall wirklich geht.

Das ist fast schöner.

---

# Die sieben Eddie-rechnet-Punkte

## 1. Der Würfel sieht aus wie ein Spielzeug

Er beginnt als Geschenk, als Objekt, als bunter Würfel. Das ist wichtig: Die Mathematik kommt nicht von außen, sondern aus Eddies Beobachtung. Sie merkt, dass die Mittelsteine stehen bleiben und die Farben nur die Oberfläche eines strengeren Systems sind.

**Eddie-Satz:**

> Er tut harmlos. Das ist verdächtig.

## 2. In Wahrheit ist er eine Permutationsmaschine

Eddie ersetzt die Farben durch bewegliche Steine: Ecken, Kanten, Zentren. Damit wird der Würfel zu einem konkreten Modell für Permutationen und Orientierungen.

**Mathematischer Kern:**

$$
8! \cdot 3^8 \cdot 12! \cdot 2^{12}
$$

ist die naive Zahl. Danach beginnt die eigentliche Mathematik.

## 3. Nicht alle scheinbaren Zustände sind möglich

Durch Eckenorientierung, Kantenorientierung und Parität fallen Zustände weg. Das ist der erzählerisch stärkste Punkt, weil er das zentrale Motiv liefert: Der Würfel lügt mit seiner Oberfläche.

**Mathematischer Kern:**

$$
\frac{8! \cdot 3^7 \cdot 12! \cdot 2^{11}}{2}
=
43\,252\,003\,274\,489\,856\,000
$$

**Eddie-Satz:**

> Nicht alles, was man sehen kann, kann man erreichen.

## 4. Bewegungen vertauschen sich nicht

Der Würfel zeigt Nicht-Kommutativität mit den Händen. Das ist didaktisch stärker als eine abstrakte Gruppendefinition.

**Mathematischer Kern:**

$$
R U \ne U R
$$

**Eddie-Satz:**

> Die Reihenfolge ist kein Detail. Sie ist die Sache selbst.

## 5. Aus Nichtvertauschbarkeit entstehen Kommutatoren

Kommutatoren erklären, warum feste Zugfolgen gezielte Wirkungen haben können. Sie sind der Übergang vom Herumprobieren zum konstruktiven Lösen.

**Mathematischer Kern:**

$$
A B A^{-1} B^{-1}
$$

**Eddie-Satz:**

> Der Würfel merkt sich nicht, was ich getan habe. Er merkt sich, was sich nicht vertauschen ließ.

## 6. Konjugation überträgt Tricks an andere Orte

Mit Konjugation versteht Eddie, warum ein bekannter Algorithmus an verschiedenen Stellen funktionieren kann. Das ist besonders gut für den erzählerischen Ton, weil es wie ein praktisches Werkzeug wirkt.

**Mathematischer Kern:**

$$
X A X^{-1}
$$

**Eddie-Satz:**

> Ich muss nicht für jede Stelle einen neuen Trick lernen. Ich muss lernen, den alten Trick richtig hinzustellen.

## 7. Schon 1985 kennt man Schranken und 52-Züge-Strategien, aber die exakte Grenze bleibt offen

Hier wird der historische Rahmen sauber gezogen. Eddie kann zählen, Schranken verstehen, die Größe des Problems erfassen und über theoretische Löseverfahren staunen. Aber *God’s Number = 20* gehört nicht in ihr Jahr.

**1985-kompatible Aussage:**

> Es gibt sehr gute Gründe zu glauben, dass manche Stellungen mindestens 18 Züge brauchen, und es gibt Verfahren, die für jede Stellung eine endliche obere Schranke liefern. Die genaue beste Schranke ist 1985 aber noch offen.

**Nicht 1985-kompatibel:**

> God’s Number ist 20.

---

# Möglicher Schlussabsatz

Vidar nimmt mir den Würfel kurz weg und dreht ihn so schnell, dass ich nur noch Farben sehe. Er kann das besser als ich. Viel besser. Seine Finger wissen Dinge, die meine erst lernen müssen.

Aber als er ihn mir zurückgibt, ist er nicht gelöst. Nur anders verwirrt.

Ich sehe die weißen, roten und blauen Flächen. Ich sehe die Kanten und Ecken. Ich sehe die Parität, die er nicht sieht. Und plötzlich ist mir klar, dass der Würfel kein Rätsel ist, weil er durcheinandergerät.

Er ist ein Rätsel, weil er beim Durcheinander seine Gesetze behält.

Das ist tröstlich.

Vielleicht ist genau das Ordnung: nicht, dass nichts geschieht. Sondern dass selbst im Chaos etwas unverletzt bleibt.

---

# Historische Plausibilität

Für eine Szene im Jahr 1985 sind folgende Bezugspunkte plausibel:

- David Singmasters Notation und mathematische Betrachtung des Würfels ist bereits Ende der 1970er/frühen 1980er Jahre bekannt.
- Gruppentheorie, Permutationen, Parität, Kommutatoren und Konjugation sind mathematisch deutlich älter und für eine sehr begabte Schülerin zugänglich.
- Die Zahl der legalen Würfelstellungen ist 1985 plausibel verfügbar oder von Eddie selbst herleitbar.
- Thistlethwaites 52-Züge-Algorithmus von 1981 liegt zeitlich passend, ist aber eher theoretisch/computerorientiert.
- Die genaue Aussage *God’s Number = 20* ist für 1985 nicht verwendbar.

## Quellenhinweise für die Autorennotiz

- David Singmaster: *Notes on Rubik's Magic Cube* / frühe Singmaster-Notation und mathematische Analyse.
- Morwen Thistlethwaite: 52-move algorithm, 1981.
- God’s Number Chronologie: 1981 untere Schranke 18, obere Schranke 52; exakter Wert 20 erst 2010.
