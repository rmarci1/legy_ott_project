# Fejlesztői dokumentáció

## 🔧 Technológiák

- Node.js (NestJS)
- TypeScript
- Prisma ORM
- MySQL
- JWT alapú autentikáció

## 💾 Telepítés és futtatás

### 1. Függőségek telepítése

```bash
cd backend
npm install
```

### 2. Környezeti változók beállítások

- Hozzon létre egy .env nevű fájlt a **backend** mappában, ezzel a tartalommal:
    ```bash
    DATABASE_URL: "mysql://root:@localhost:3306/LegyOtt"
    
    SESSION_KEY: 'valamiTitkosKulcs'
    
    JWT_SECRET: 'valamiTitkosKulcs'
    ```
### 3. Adatbáziskezelő

- Indítsa el a Xampp-on keresztül a MySQL-t, ha még nem tette.
  - Adatbázis létrehozásához az alábbi parancsot írja be a parancssorba miközben a **backend** mappában tartózkodik:  
    ```bash
      npx prisma db push --force-reset --schema=./schema/schema.prisma
      ```
    - Alap adatok feltöltéséhez utána az alábbi parancsot írja be:
      ```bash
        npx prisma db seed
      ```

### 4. Alkalmazás futattása

```bash
  npm run start
```
### 5. Alapértelmezett Jelszó

- Asd1234@
