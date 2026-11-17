# Evaluarea Națională · clasa a II-a

Testele de Evaluare Națională (2026 „Animale de companie”, 2025 „Medii de viață”, 2025 „Animale polare”), cu toți itemii, punctaj din 100, fără cronometru, cu posibilitatea de a sări peste un item. În română și engleză.

Nu are cont și nu folosește Firebase: cel mai bun punctaj se păstrează doar pe dispozitiv.

## Pornire

```
npm install
npm start
```

## Publicare

Creezi un depozit nou pe GitHub, urci folderul și îl imporți în Vercel („Add New → Project”). Nu e nevoie de chei.

## Ce conține

- `src/App.js`: lista testelor și ecranul testului.
- `src/exam/`: motorul de joc din Math Owl (itemii sunt în `nationalTest.js`) și traducerea în engleză.

Sursa itemilor: testele oficiale publicate de Ministerul Educației (CNPEE). Aplicația nu este oficială.
