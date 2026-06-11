---
name: project-onboarding
description: A step-by-step guide to set up the project environment and database schema using Prisma ORM  
compatibility: Use Node.js 22+
license: MIT
metadata: 
   Version: 1.0
   author: NAT
  
---
## First-Time Setup Guide

```bash 
#1. Install Deps
npm install

#2 copy .env file
cp .env.example .env

#3. Pull DB Schema(Prisma ORM)
npx prisma db pull

#4. Generate Prisma Client
npx prisma generate

#5. check lint
npm run lint
```

## Gotchas
- Install and close docker desktop before running `npx prisma db pull` to avoid `Error: P1000: Authentication failed against database server at 'localhost:3306'`
- `npx prisma db pull` will overwrite `schema.prisma` with the current DB schema, so if you have made manual changes to `schema.prisma` that are not yet in
the DB, they will be lost. Always back up your `schema.prisma` before running this command if you have made changes that are not yet in the DB.
- After running `npx prisma db pull`, you must run `npx prisma generate` to update the Prisma Client with the new schema. Failure to do so may result in runtime errors when your application tries to access the database using the old schema.  

## Output
- setup answer in table format and easy to read