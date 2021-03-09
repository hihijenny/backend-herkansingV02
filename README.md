## Datingapp 
Met mijn datingapp kan de gebruiker door zijn/haar liefde voor voedsel de ideale partner vinden. 
In de feature die ik heb uitgewerkt voor dit project kunnen zij hun naam invoeren, hun twee favoriete gerechten
en een beschrijving over zichzelf en natuurlijk vooral waarom zij zo leuk zijn.  
![](static/my-app.png)

### Installatie
Wil je deze feature ook lokaal op jouw pc hebben, volg dan de volgende stappen.
Zorg er voor dat je voorafgaand al NodeJS en NPM hebt geïnstalleerd.

Clone of download mijn repository

`gh repo clone hihijenny/backend-herkansingV02`

CD naar de map in jouw CLI

`cd /backend-herkansingV02`

Installeer de benodigde packages

`npm install`

Om de feature werkend te kijgen moet je ook een MongoDB database aanmaken,
mijn cluster ziet er zo uit: 
![](static/datamodel.png)

Plaats de .env file in de map en zet hier de juiste variabele in 

```
DB_NAME= Naam van jouw database
DB_PASS= Wachtwoord 
DB_USER= Gebruikersnaam
```

Je bent er nu klaar voor om de feature op jouw server te draaien

`npm start`

## License 
[MIT License](https://www.google.com)

#### Auteur
Jenny Nijhof