---
synopsis: 'Diophantische Gleichungen: Busfahrt-Erklärung + Tampere-Beispiel (3 Säcke Reis + 4 Säcke Nudeln für 55 Markka).'
---

# Reis, Nudeln und Herr Fischers Gleichungen

> **Hinweis:** Dieses Kapitel gehört zu *„Eddie rechnet“*.
> Eddie erklärt hier launisch, schrittweise und gut nachvollziehbar.
> Platz für Beispiele, Skizzen, Mini-Beweise und kleine Seitenhiebe.

## alter Text, kein Eddie-Style

\### 1) Modell

Schreibe die Gleichung

A x + B y = X,

wobei x,y nichtnegative ganze Zahlen sind.

\### 2) Existenzbedingung

Berechne g=\\gcd(A,B).

Es gibt \*\*ganzzahlige\*\* Lösungen genau dann, wenn g teilt X (also g\\mid X).

Wenn g\\nmid X --- keine Lösung.

\### 3) Eine partikuläre Lösung finden

Finde ganze Zahlen s,t mit

A s + B t = g

(z.B. mit dem erweiterten Euklidischen Algorithmus). Multipliziere mit X/g. Dann ist

x_0 = s\\cdot\\frac{X}{g},\\qquad y_0 = t\\cdot\\frac{X}{g}

eine (möglicherweise negative) partikuläre Lösung der ursprünglichen Gleichung.

\### 4) Allgemeine Lösung (alle ganzzahligen)

Alle ganzzahligen Lösungen sind

x = x_0 + \\frac{B}{g}\\,k,\\qquad y = y_0 - \\frac{A}{g}\\,k,

für beliebige ganze k.

\### 5) Auf nichtnegative Lösungen einschränken

Setze x\\ge0 und y\\ge0. Das ergibt die Ungleichungen für k:

k \\ge \\Big\\lceil -\\dfrac{x_0}{B/g}\\Big\\rceil

\\quad\\text{und}\\quad

k \\le \\Big\\lfloor \\dfrac{y_0}{A/g}\\Big\\rfloor.

Alle ganzen k in diesem Intervall geben genau die gewünschten nichtnegativen Paare (x,y).

\## Kurzes Beispiel

Bauer hat X=100 Mark, Kuh kostet A=13, Schwein B=7.

1\. \\gcd(13,7)=1, also möglich.

2\. Erweiteter Euklid: -1\\cdot13 + 2\\cdot7 = 1. Also s=-1,\\; t=2.

Multipliziere mit 100: x_0=-100,\\; y_0=200.

3\. Allgemeine Lösung: x=-100+7k,\\; y=200-13k.

4\. Bedingungen: x\\ge0 \\Rightarrow k\\ge\\lceil100/7\\rceil=15.

y\\ge0 \\Rightarrow k\\le\\lfloor200/13\\rfloor=15.

Also einziges k ist 15. Das liefert x=5,\\; y=5.

Ergebnis: genau eine Möglichkeit --- 5 Kühe und 5 Schweine.

(Und als Gegenbeispiel: mit A=15,B=6,X=100 gilt \\gcd(15,6)=3\\nmid100 --- also \*\*keine\*\* Lösung.)

## Einstieg

Kurzer, lockerer Einstieg im Eddie-Ton.

## Idee / Strategie

Was ist das Grundprinzip? Wie denkt Eddie darüber?

## Schritt-für-Schritt

1. …
2. …
3. …

## Fallstricke & Tipps

- …
- …

## Fazit

Was soll hängen bleiben? Kleine Pointe erlaubt.

Okay, ich stehe hier auf dem Marktplatz, die Sonne scheint, und ich habe 55 Markka in der Tasche. Ich will Reis und Nudeln kaufen, Reis kostet 9 Markka pro Sack, Nudeln 7 Markka. Ich muss das Geld genau aufbrauchen, kein Rest. Das klingt nach einer Rechnung, die ich im Kopf lösen kann. Also, los geht’s.

Ich stelle mir eine Gleichung vor: Wenn ich \( x \) Säcke Reis kaufe, kostet das \( 9x \) Markka, und wenn ich \( y \) Säcke Nudeln kaufe, kostet das \( 7y \) Markka. Zusammen muss das 55 Markka ergeben. Also: \[ 9x + 7y = 55 \] Das ist meine Ausgangsgleichung. Ich brauche ganzzahlige Werte für \( x \) und \( y \), weil ich ja nur ganze Säcke kaufen kann, und sie dürfen nicht negativ sein.

Hmm, das sieht nach einer Diophantischen Gleichung aus, oder? Ich erinnere mich an den Mathematikunterricht – solche Gleichungen haben Lösungen, wenn der größte gemeinsame Teiler der Koeffizienten die rechte Seite teilt. Die Koeffizienten sind 9 und 7. Sind die teilerfremd? 9 ist \( 3^2 \), 7 ist eine Primzahl. Sie haben keine gemeinsamen Teiler außer 1, also ist der ggT 1. Und 1 teilt 55, das passt. Es gibt also Lösungen.

Jetzt muss ich \( x \) und \( y \) finden. Am einfachsten ist es, wenn ich \( y \) ausdrücke. Ich löse die Gleichung nach \( y \): \[ 7y = 55 - 9x \] \[ y = \frac{55 - 9x}{7} \] Damit \( y \) ganzzahlig ist, muss \( 55 - 9x \) durch 7 teilbar sein. Okay, ich prüfe das modulo 7. Zuerst rechne ich: \[ 55 \div 7 = 7 \text{ Rest } 6 \implies 55 \equiv 6 \pmod{7} \] \[ 9 \div 7 = 1 \text{ Rest } 2 \implies 9 \equiv 2 \pmod{7} \] Also: \[ 55 - 9x \equiv 0 \pmod{7} \implies 6 - 2x \equiv 0 \pmod{7} \] Das heißt: \[ 2x \equiv 6 \pmod{7} \] Ich dividiere durch 2 (modulo 7): \[ x \equiv 3 \pmod{7} \] Das bedeutet, \( x \) muss die Form \( x = 7k + 3 \) haben, wobei \( k \) eine ganze Zahl ist. Okay, ich setze das in die Gleichung für \( y \): \[ y = \frac{55 - 9(7k + 3)}{7} = \frac{55 - 63k - 27}{7} = \frac{28 - 63k}{7} = 4 - 9k \] Das ist schön, \( y = 4 - 9k \). Jetzt müssen \( x \) und \( y \) nicht-negativ sein: \[ x = 7k + 3 \geq 0 \implies k \geq -\frac{3}{7} \approx -0,43 \] Da \( k \) ganzzahlig ist, muss \( k \geq 0 \). \[ y = 4 - 9k \geq 0 \implies 4 \geq 9k \implies k \leq \frac{4}{9} \approx 0,44 \] Also \( k \leq 0 \). Die einzige ganze Zahl, die sowohl \( k \geq 0 \) als auch \( k \leq 0 \) erfüllt, ist \( k = 0 \). Ich probiere es: \[ k = 0 \implies x = 7 \cdot 0 + 3 = 3 \] \[ y = 4 - 9 \cdot 0 = 4 \] Überprüfe ich das: \[ 9 \cdot 3 + 7 \cdot 4 = 27 + 28 = 55 \] Das passt perfekt! Ich kaufe 3 Säcke Reis und 4 Säcke Nudeln, das macht genau 55 Markka.

Soll ich andere \( k \)-Werte testen? Für \( k = 1 \): \[ x = 7 \cdot 1 + 3 = 10 \] \[ y = 4 - 9 \cdot 1 = -5 \] Das geht nicht, \( y \) ist negativ. Für \( k = -1 \): \[ x = 7 \cdot (-1) + 3 = -4 \] Auch negativ, das funktioniert nicht. Da \( k = 0 \) die einzige Zahl ist, die beide Bedingungen erfüllt, scheint das die einzige Lösung zu sein.

Okay, ich bin sicher: 3 Säcke Reis und 4 Säcke Nudeln. Jetzt ab zum Stand!
