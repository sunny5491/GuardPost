# 🛡️ GuardPost Proxy

A high-performance API Gateway built with **Node.js**, **TypeScript**, and **Redis**. 

## ✨ Features
- **Rate Limiting:** Prevents API abuse using a Redis-backed counter (IP-based).
- **Request Caching:** Minimizes external API calls by caching responses in Redis for 30 seconds.
- **Transparent Proxying:** Forwards requests dynamically to external services using Axios.
- **Type Safety:** Built entirely with TypeScript for robust error handling.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Database:** Redis (In-memory storage)
- **Language:** TypeScript
- **Tools:** Nodemon, Dotenv, Axios

## 🚀 How to Run
1. Clone the repo: `git clone <your-repo-url>`
2. Install dependencies: `npm install`
3. Start Redis server locally.
4. Create a `.env` file with your `EXTERNAL_API_URL`.
5. Run in dev mode: `npm run dev`