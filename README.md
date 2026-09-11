# ROUTS — Frontend MVP

Primeira versão extremamente enxuta do ROUTS.

## Escopo atual

Apenas uma categoria:

**Notícias**

Fluxo:

```text
GNews API
   ↓
NestJS
   ↓
React + Vite
   ↓
Notícias de Rio Verde
```

## 1. Instalar

```bash
npm install
```

## 2. Configurar

Copie:

```text
.env.example
```

para:

```text
.env
```

O padrão já funciona com:

```text
VITE_API_URL=http://localhost:3000/api
```

## 3. Rodar

```bash
npm run dev
```

O frontend ficará disponível no endereço mostrado pelo Vite, normalmente:

```text
http://localhost:5173
```

## Importante

O frontend não acessa a GNews diretamente.

A chave da GNews fica somente no backend.
