# Blog helper
Python raspodijeljeni sustav koji olakšava pisanje blogova uz pomoć LLM-ova.

Da biste ga lokalno pokrenuli, morate instalirati sve potrebne biblioteke u svakom pojedinom mikroservisu i pokrenuti iste.

Blog helper se sastoji od 3 mikroservisa:
1. AI API - služi dobivanju teksta za blog pomoću lokalnog LLM-a
2. AUTH API - služi autentifikaciji korisnika
3. POSTS API - služi interakciji s blog postovima u bazi podataka

Pored toga, postoji i frontend React aplikacija koja prikazuje cijeli UI aplikacije koja koristi ta 3 mikroservisa.

VIDEO:  https://www.loom.com/share/db93d7901fc0487e9cf1ac418c5c373a
