---
title: "IMO 1985 • Problem 1 — Eddie erklärt’s (Pandoc/LaTeX)"
author: "Eddie (Erklärstil), aufbereitet für Pandoc"
date: 1985-07-00
lang: de
tags:
  - Geometrie
  - Tangenten
  - Kreis
  - Winkelhalbierende
  - Kongruenz
  - zyklisches Viereck
source:
  - "AoPS Wiki: 1985 IMO Problems/Problem 1"
  - "IMO 1985 ISL solutions (prase.cz): isoln851.html"
---

# IMO 1985 – Aufgabe 1

## Aufgabenstellung

Ein Kreis hat seinen Mittelpunkt auf der Seite $AB$ eines zyklischen Vierecks $ABCD$ (also: $A,B,C,D$ liegen auf einem gemeinsamen Umkreis). Die drei anderen Seiten $BC$, $CD$ und $DA$ sind Tangenten an diesen Kreis.

Zeige: $$ AD + BC = AB. $$

(Quelle der Aufgabenformulierung: AoPS. :contentReference[oaicite:0]{index=0})

---

# Lösung (ausführlich, locker – aber sauber)

## 0) Notation: Berührpunkte und der Mittelpunkt

Der Kreis berührt (tangiert)

- $AD$ im Punkt $L$,
- $CD$ im Punkt $M$,
- $BC$ im Punkt $N$.

Der Mittelpunkt des Kreises heißt $O$ und liegt irgendwo auf der Strecke $AB$.

**Tangenten-Merksätze (die man im Schlaf können will):**

1. Radius steht auf Tangente senkrecht:
$OL \perp AD$, $OM \perp CD$, $ON \perp BC$.

2. Von einem Punkt außerhalb eines Kreises sind die Tangenten gleich lang:
Vom Punkt $D$ gehen zwei Tangenten an den Kreis, nämlich über $DL$ und $DM$, also $$ DL = DM. $$ Vom Punkt $C$ gehen Tangenten über $CN$ und $CM$, also $$ CN = CM. $$

Diese beiden Gleichheiten werden später wie Lego-Steine ineinandergeklickt.

---

## 1) Der eigentliche Trick: Einen Punkt $X$ auf der Verlängerung von $AD$

Jetzt kommt Eddies Lieblingsmove: “Wir bauen uns eine Strecke, die genau $AO$ lang ist.”

Nimm auf dem Strahl $AD$ (also auf der Geraden durch $A$ und $D$, **jenseits von $D$**) einen Punkt $X$ so, dass $$ AX = AO. $$

Warum das sinnvoll sein soll? Geduld. Wir wollen gleich zwei rechtwinklige Dreiecke kongruent machen.

---

## 2) Winkelhalbierenden aus Tangenten: $CO$ und $DO$

Weil der Kreis sowohl $CD$ als auch $BC$ berührt, hat $O$ zu beiden Geraden denselben Abstand (Radius). Damit liegt $O$ auf der Winkelhalbierenden des Winkels bei $C$ zwischen $CD$ und $CB$.

Also ist $CO$ Winkelhalbierende von $\angle DCB$, d.h. $$ \angle OCM = \angle NCO \quad\text{und insbesondere}\quad \angle OCM = \frac{\angle DCB}{2}. $$

Analog: Weil der Kreis $CD$ und $AD$ berührt, liegt $O$ auf der Winkelhalbierenden bei $D$ zwischen $DC$ und $DA$. Also ist $DO$ Winkelhalbierende von $\angle CDA$, und insbesondere gilt $$ \angle ODL = \angle MDC = \frac{\angle CDA}{2}. $$

(Man kann das auch “symmetrisch gleiche Abstände zu den Schenkeln” nennen. In der IMO ist das Standard-Werkzeug.)

---

## 3) Zyklisch heißt: Gegenwinkel ergänzen sich zu $180^\circ$

Da $ABCD$ zyklisch ist, gilt: $$ \angle DAB + \angle DCB = 180^\circ. $$

Daraus folgt nach Halbieren: $$ \frac{\angle DCB}{2} = 90^\circ - \frac{\angle DAB}{2}. $$

Das ist eine kleine, aber extrem nützliche Umformung, weil gleich überall rechte Winkel auftauchen.

---

## 4) Kongruenz-Plan: Dreiecke $ \triangle OLX $ und $ \triangle OMC $

Wir schauen uns zwei Dreiecke an:

- $\triangle OLX$: Punkte $O$, $L$, $X$
- $\triangle OMC$: Punkte $O$, $M$, $C$

### (a) Beide sind rechtwinklig

- $L$ ist Berührpunkt auf $AD$, also $OL \perp AD$.
Und $X$ liegt auf der Geraden $AD$. Also ist $$ \angle OLX = 90^\circ. $$

- $M$ ist Berührpunkt auf $CD$, also $OM \perp CD$.
Und $C,M$ liegen auf $CD$. Also ist $$ \angle OMC = 90^\circ. $$

### (b) Eine Kathete ist gleich: $OL = OM$

Beides sind Radien desselben Kreises: $$ OL = OM = r. $$

### (c) Und jetzt der “Winkel passt”-Moment

Wir vergleichen die Winkel bei $X$ und bei $C$:

- In $\triangle OLX$ ist $\angle OXL$ der Winkel zwischen $OX$ und $XL$.
Aber $XL$ liegt auf $AD$.

- In $\triangle OMC$ ist $\angle OCM$ der Winkel zwischen $OC$ und $CM$.
Aber $CM$ liegt auf $CD$.

Jetzt kommt die Kette:

1. Weil $CO$ Winkelhalbierende bei $C$ ist:
$$ \angle OCM = \frac{\angle DCB}{2}. $$

2. Weil $ABCD$ zyklisch ist:
$$ \frac{\angle DCB}{2} = 90^\circ - \frac{\angle DAB}{2}. $$

3. Und weil $AO$ auf der Geraden $AB$ liegt, ist der Winkel zwischen $AD$ und $AO$ genau $\angle DAB$.
Also ist $$ \angle (AD, AO) = \angle DAB. $$

4. Wenn man eine Gerade ($AD$) um $90^\circ$ “hochklappt”, dann taucht genau dieser Ausdruck $90^\circ - \frac{\angle DAB}{2}$ in den rechten Dreiecken auf.
Konkret: In $\triangle OLX$ ist $OL \perp AD$, also ist der Winkel zwischen $OX$ und $XL$ gleich $$ \angle OXL = 90^\circ - \frac{\angle DAB}{2}. $$

Damit haben wir: $$ \angle OXL = 90^\circ - \frac{\angle DAB}{2} = \frac{\angle DCB}{2} = \angle OCM. $$

### (d) Also: Dreiecke sind kongruent

Wir haben:

- $\angle OLX = \angle OMC = 90^\circ$,
- $OL = OM$,
- $\angle OXL = \angle OCM$.

Damit sind die Dreiecke $\triangle OLX$ und $\triangle OMC$ kongruent (ASA / “Winkel-Seite-Winkel” in rechtwinkliger Version).

Folge: $$ LX = MC. $$

Das ist *der* Längen-Transfer, den wir wollten.

(Genau diese Kongruenz-Idee steht auch in der klassischen ISL-Lösung. :contentReference[oaicite:1]{index=1})

---

## 5) Jetzt rechnen wir Längen: $AO = AL + MC$

Weil $A, L, X$ auf einer Geraden liegen und $L$ zwischen $A$ und $D$ liegt, gilt:

$$ AX = AL + LX. $$

Aber $AX = AO$ (so haben wir $X$ gebaut) und $LX = MC$ (Kongruenz). Also:

$$ AO = AL + MC. $$

Das ist schon hübsch: $AO$ zerfällt in “ein Stück auf $AD$” plus “ein Stück am $CD$”.

---

## 6) Dasselbe auf der rechten Seite: $OB = BN + MD$

Ganz analog macht man das rechts:

Man bekommt (durch dieselbe Art Überlegung, nur gespiegelt über die Seite $BC$):

$$ OB = BN + MD. $$

(Die ISL-Lösung formuliert das als “Similarly, $OB = BN + MD$”. :contentReference[oaicite:2]{index=2})

---

## 7) Jetzt die Tangenten-Gleichheiten einklicken: $MC = CN$ und $MD = DL$

Erinnerung von ganz oben:

- Von $C$ aus sind Tangenten gleich: $CM = CN$.
- Von $D$ aus sind Tangenten gleich: $DM = DL$.

Also können wir in den Summen ersetzen.

---

## 8) Finale: $AB = AO + OB$ auseinanderziehen

Da $O$ auf der Strecke $AB$ liegt, ist $$ AB = AO + OB. $$

Setze die beiden Zerlegungen ein: $$ AB = (AL + MC) + (BN + MD). $$

Ersetze $MC$ durch $CN$ und $MD$ durch $DL$: $$ AB = AL + CN + BN + DL. $$

Gruppiere:

- $AL + DL = AD$,
- $CN + BN = BC$.

Also: $$ AB = AD + BC. $$

Und genau das war zu zeigen: $$ \boxed{AD + BC = AB}. $$

---

# Mini-Eddie-Kommentar: Warum das so “gut” ist

Die Aufgabe sieht aus wie “reine Geometrie”, aber die Lösung ist fast wie Buchhaltung:

- Tangenten geben dir **Gleichheiten von Strecken** ($DL=DM$, $CN=CM$),
- der Kreis mit Mittelpunkt auf $AB$ gibt dir Winkelhalbierenden,
- und zyklisch gibt dir diese nette Halbwinkel-Beziehung.

Dann bastelst du dir ein Dreieck, das kongruent zu einem anderen ist, damit eine “fremde” Strecke ($MC$) zu deiner “gewollten” Strecke ($LX$) wird — und plötzlich fällt $AB$ als Summe auseinander wie ein Reißverschluss.

---

# Quellen

- AoPS Wiki, *1985 IMO Problems/Problem 1* (Aufgabenstatement & kurze Lösungsskizzen). :contentReference[oaicite:3]{index=3}
- *IMO 1985 ISL solutions* (prase.cz), Problem A1 (klassische Konstruktion und Kongruenz-Idee). :contentReference[oaicite:4]{index=4}
