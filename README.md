# Blog helper

| Polja    | Podaci                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Student  | Luka Batarelo                                                                                                      |
| Fakultet | [Fakultet informatike u Puli](https://fipu.unipu.hr/)                                                              |
| Kolegij  | [Programsko inženjerstvo](https://ntankovic.unipu.hr/pi) i [Raspodijeljeni sustavi](https://ntankovic.unipu.hr/rs) |
| Mentor   | [doc. dr. sc. Nikola Tanković](https://ntankovic.unipu.hr)                                                         |

## Kratki opis funkcionalnosti

Blog Helper je web aplikacija za AI-potpomognuto pisanje blog objava koja koristi lokalni jezični model (Ollama / gemma3), pa sadržaj ne napušta korisnikovo računalo. Glavne funkcionalnosti:

- **Prijava i autentikacija** putem Auth0 (OAuth2) uz JWT token za zaštitu API poziva.
- **Upravljanje objavama (CRUD)** - pregled svih objava, čitanje pojedine objave te kreiranje, uređivanje i brisanje vlastitih objava.
- **AI generiranje sadržaja** - na temelju zadanog naslova model u stvarnom vremenu (streaming) generira tekst objave.
- **AI poboljšanje teksta** - prijedlog poboljšane verzije postojećeg sadržaja koju korisnik može prihvatiti ili odbaciti.
- **AI prijedlozi naslova** - generiranje alternativnih naslova za objavu.

Aplikacija je izgrađena kao skup mikroservisa (auth-service, posts-api, ai-api) i React frontenda.

## Prototip

Dostupan na: [figma](https://www.figma.com/design/yIBX113Jnea3tuz2TvU8Zz/Blog-helper?node-id=0-1&t=CfbwgrZPP5pcZ0Ru-1)

## Video

Dostupan na: [youtube]()

## Pokretanje aplikacije

Cijela aplikacija pokreće se odjednom putem Docker Compose-a koji gradi i pokreće sve komponente (frontend, tri mikroservisa i nginx reverse proxy) u zajedničkoj mreži.

### Preduvjeti

- Instaliran [Docker](https://docs.docker.com/get-docker/) i Docker Compose
- Pokrenut [Ollama](https://ollama.com/) na lokalnom računalu (port `11434`) sa skinutim `gemma3` modelom:

```bash
ollama pull gemma3
```

- Kreiran `auth-service/.env` (prema `auth-service/.env.template`) s ispunjenim Auth0 podacima:

```bash
cp auth-service/.env.template auth-service/.env
```

Zatim u `auth-service/.env` ispuni `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_CALLBACK_URL`, `JWT_SECRET` i `FRONTEND_URL`.

### Pokretanje

Iz korijenskog direktorija projekta pokrenuti:

```bash
docker compose up --build
```

Time se podižu sve komponente:

| Servis         | Uloga                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| `nginx`        | Reverse proxy na portu `80` — usmjerava promet na servise              |
| `frontend`     | React aplikacija (port `5173`)                                         |
| `auth-service` | Autentikacija putem Auth0 i izdavanje JWT-a (2 replike)                |
| `posts-api`    | CRUD objava nad SQLite bazom u trajnom volumenu `posts-db` (2 replike) |
| `ai-api`       | AI funkcionalnosti preko Ollame (3 replike)                            |

Nakon pokretanja aplikaciji se pristupa na [http://localhost:5173](http://localhost:5173).

Za zaustavljanje:

```bash
docker compose down
```
