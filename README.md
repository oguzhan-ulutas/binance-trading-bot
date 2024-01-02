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

## Documentation

### 09 Strategy One

#### StrategyOne Component

- Main component

#### GetAssetValue Component

- When you press the start fetching, it gets asset value every second, and appends the value to the assetsArray.

#### PlaceOrder Component

- First asset value fetching needed to be started.
- After setting order side, order type, and order quantity then bot can be started.
- When the start button is pressed, the bot opens a market order at the current price and places a stop loss order 0.5% below or above the opened price. It saves the order to database and send order info to client.

#### TakeProfit Component

- It checks the order status every second. And informs the user.
- If price reaches to take profit point (which is 0.5% up or down to entery price)
  - it cancels the stop loss limit order, and updates it on database.
  - Place a market order and takes profit.
