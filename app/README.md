# Intervalltimer som iPhone-app

Samma app som webbversionen (`../index.html`), inbyggd med [Capacitor](https://capacitorjs.com) så att den kan installeras som en riktig app.

Det appen gör utöver webbversionen:

- **Notiser med ljud vid varje byte när skärmen är låst.** Löpning, vila och "klart" har olika ljud. Notisen visar momentet och tiden.
- **Håller skärmen tänd** medan ett pass pågår.
- **Rätt tid efter låst skärm.** När du låser upp hoppar timern fram till rätt moment.

Den upplästa rösten fungerar bara när appen är öppen. Med låst skärm hörs bara notisljudet.

## Första gången på Macen

Det här behövs: Xcode (från App Store), Node.js LTS (från nodejs.org) och iPhonen med en kabel.

1. Öppna Terminal och kör:

   ```
   git clone https://github.com/Erik7411/intervalltimer.git
   cd intervalltimer/app
   npm install
   npm run ios
   ```

   Det sista kommandot bygger appen och öppnar projektet i Xcode.

2. I Xcode: klicka på **App** överst i vänsterspalten → fliken **Signing & Capabilities** → vid **Team**, välj *Add an Account…* och logga in med ditt Apple-ID. Välj sedan ditt namn (Personal Team).
3. Koppla in iPhonen och lås upp den. Välj den i listan med enheter högst upp i Xcode och tryck på ▶.
4. På iPhonen, om den frågar:
   - **Utvecklarläge:** Inställningar → Integritet och säkerhet → Utvecklarläge → på. Telefonen startar om.
   - **Lita på utvecklaren:** Inställningar → Allmänt → VPN och enhetshantering → ditt Apple-ID → Lita på.
5. Starta appen, starta ett pass och tillåt notiser.

Med ett gratis Apple-ID slutar appen fungera efter 7 dagar. Då kopplar du in telefonen och trycker på ▶ i Xcode igen.

## När något har ändrats

```
cd intervalltimer
git pull
cd app
npm install
npm run ios
```

Tryck sedan på ▶ i Xcode.

## Bra att veta

- **Ljudlöst läge och fokus:** Notisljuden följer telefonens inställningar. I ljudlöst läge vibrerar den bara, och ett fokusläge kan stänga av notiserna helt.
- **Långa pass:** iOS tillåter ungefär 60 schemalagda notiser åt gången. Har ett pass fler moment än så slutar notiserna efter det 60:e, om du inte låser upp telefonen emellan (då fylls de på).
- **Filer:** `src/native.js` är det som bara körs i appen. `scripts/build.mjs` bygger `www/` från webbversionen. Notisljuden finns i `sounds/`.
