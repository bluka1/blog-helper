# Posts API

API koji služi dohvaćanju i spremanju blog postova.

## Postavljanje environmenta
1. `conda create -n posts python=3.13`
2. `conda env list` (provjera svih conda okruženja)
3. `conda activate posts`

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
