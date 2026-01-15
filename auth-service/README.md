# AUTH API

API koji služi autentifikaciji korisnika aplikacije.

Kao preduvjet za rad mikroservisa, potrebno je registrirati mikroservis na [Auth0](https://auth0.com/) platformi.

## Postavljanje environmenta
1. `conda create -n auth python=3.13`
2. `conda env list` (provjera svih conda okruženja)
3. `conda activate auth`

### Provjera verzije pythona:
- `which python3` ili `which python`

Očekujemo nešto u stilu: `/opt/anaconda3/envs/auth-service/bin/python3/...`

## Instalacija potrebnih biblioteka
`pip install -r requirements.txt`

Stvorite `.env` datoteku i dodajte odgovarajuće vrijednosti varijabli okruženja prema `.env.template`:

```sh
touch .env
cat env.template > .env
```

## Pokretanje mikroservisa
Sada biste trebali biti spremni da pokrenete mikroservis. Pokrenite sljedeću naredbu: `python server.py`
