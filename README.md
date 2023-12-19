# binance-trading-bot

A trading bot for binance. Still in progress.

## Setup

### Step 1: Environment File Setup

Create .env file in server directory:

- binanceApiKey = "YOUR_BINANCE_PUBLIC_KEY"
- binanceApiSecretKey = "YOUR_BINANCE_SECRET_KEY"
- binanceApiUrl = "https://api.binance.com"
- clientUrl = "http://localhost:5173" If your client url different, make changes accordingly.
- mongoUri ="mongodb://127.0.0.1:27017/binanceData" (your mongodb connection string)

Also create .env file inside the client directory:

- VITE_serverUrl = "http://localhost:3000/binance-api/v1" If your server url different, make changes accordingly.

### Step 2: Dependency Installation

Execute inside the both client and server directories after cloning the repo:

```sh
npm install
```

### Step 3: Launching the Development Server

Execute:

```sh
npm start
```

Or to start the server continuously with nodemon:

```sh
npm run devstart
```

### Step 4: Launching the Client

Inside the frontend folder execute:

```sh
npm run dev
```
