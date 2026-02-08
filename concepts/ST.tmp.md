# Spieltheorie am Busbahnhof

> *„Spieltheorie, aber auf Straßenstaub und kalte Finger runtergebrochen.“*

## Worum’s geht (Kurzfassung)

Ich entscheide nicht aus dem Bauch, sondern rechne mir die **Chance auf Freiheit** aus. Dazu zerlege ich die Flucht in **Pfad-Entscheidungen** – und jeder Pfadast kriegt eine Wahrscheinlichkeit. Am Ende addiere ich alle Erfolgs‑Äste, fertig ist mein „Kann klappen“-Prozent.

## Der Baum – Ebenen & Logik

![Der Entscheidungsbaum](decisiontree.svg)

1. **Buslage**: Kommt überhaupt ein Bus in meiner Wartezeit nach **Süden** oder **Norden**?
Wenn **kein Bus** kommt → **Misserfolg** (Tag gelaufen, neues Zeitfenster suchen).

2. **Fahrer-Bargeld-Test**: Nimmt der Fahrer meine **D‑Mark** (statt FIM/SEK/whatever)?
**Ja** → ich steige ein. **Nein** → **Misserfolg** (Ast endet).

3. **Verfolger-Risiko** (*Mielke‑Bossfight*):
**Erwischt** → **Misserfolg**. **Verpasst** → **Freiheit**.

---

## Notation (damit’s flott geht)

- \(p_S\): Bus nach **Süden** kommt (im Zeitfenster).
- \(p_N\): Bus nach **Norden** kommt.
- \(a_S, a_N\): Fahrer akzeptiert **D‑Mark** (Süden/Norden).
- \(r_S, r_N\): **Erwischt‑Wahrscheinlichkeit** im Bus (Süden/Norden).
→ \((1-r)\) ist die **„Er verpasst mich“**‑Chance.

---

## Erfolgsformel (die zwei guten Äste)

Es gibt zwei Erfolgswege (Süden, Norden). Die Gesamtchance ist die Summe der Pfadprodukte:

\[ P(\text{Freiheit}) = p_S \cdot a_S \cdot (1 - r_S)\;+\; p_N \cdot a_N \cdot (1 - r_N). \]

Alles andere landet automatisch in \[ P(\text{Misserfolg}) = 1 - P(\text{Freiheit}). \]

---

## Mini‑Beispiel (Zahlen nur zum Fühlen)

- \(p_S=0{,}4\), \(a_S=0{,}6\), \(r_S=0{,}3\)
- \(p_N=0{,}3\), \(a_N=0{,}7\), \(r_N=0{,}5\)

Rechnung:

- Süden: \(0{,}4 \times 0{,}6 \times (1-0{,}3) = 0{,}168\)
- Norden: \(0{,}3 \times 0{,}7 \times (1-0{,}5) = 0{,}105\)
- **Gesamt**: \(0{,}168 + 0{,}105 = 0{,}273\) → **27,3 % Freiheit**

---

## Was lerne ich daraus?

- Ich kann **Annahmen je Ast** anpassen (z. B. Süden fährt öfter, Fahrer aber pingeliger).
- Ich sehe sofort, **welcher Ast mehr bringt**.
- Wenn ich Optionen **killen** will (z. B. Norden ignoriere ich heute), setze ich die Kanten‑Wahrscheinlichkeit einfach auf **0**.

---

## Deine Szene? Trag hier deine Werte ein

| Parameter | Bedeutung | Dein Wert |
|---|---|---|
| \(p_S\) | Bus nach Süden kommt |  |
| \(p_N\) | Bus nach Norden kommt |  |
| \(a_S\) | Fahrer (S) nimmt D‑Mark |  |
| \(a_N\) | Fahrer (N) nimmt D‑Mark |  |
| \(r_S\) | Erwischt‑Risiko im Süden |  |
| \(r_N\) | Erwischt‑Risiko im Norden |  |

> Tipp: Werte zwischen **0** und **1** eintragen (z. B. 0,65). Dann oben in die Formel stopfen.

## Eddy‑Tonspur zum Schluss

„Das ist mein **taktisches Navi**: Äste sind Wege, Kanten sind Chancen, und am Ende steht eine Zahl, mit der ich leben kann. Bauchgefühl bleibt – aber **Bauch

- Baum** schlägt **Bauch allein**.“

$$ \frac{5}{60}+\frac{56}{60}\cdot\frac{5}{60} + \frac{55}{60}\cdot\frac{55}{60}
+ \left( \frac{5}{60}+\frac{55}{60}\cdot\frac{5}{60} \right) \cdot 20\%\cdot
80\% + \frac{5}{60}\left( 1+\frac{55}{60} \right) \cdot 80\%\cdot 80\% $$
