# 🚦 Smart City Traffic Management System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

A traffic-aware city route planning project that combines **graph algorithms**, **route analysis**, **traffic scoring**, **vehicle-based travel-time estimation**, **machine-learning traffic forecasting**, and **interactive maps**.

The current version adds a richer city network, a traffic-aware alternative-route recommendation system, and an integrated **KNN-based machine-learning module** that forecasts traffic delay for a selected departure time. The shortest-distance route remains the primary route, while an alternative is shown only when the original route has **Medium/High traffic** and a **longer route with lower traffic** is available.

> **Attribution:** This repository is a customized educational derivative of an existing Smart City Traffic project. The original contributors are credited below. New routing, traffic-analysis, and portfolio-oriented changes in this version are identified as modifications by **Md Zeeshan**.

---

## ✨ Highlights

- 🚗 Shortest-distance route finder using **Dijkstra's Algorithm**
- 🛣️ Traffic-aware **alternative route recommendation**
- 🚦 Low / Medium / High route traffic classification
- 📊 Route traffic score on a 0–100 scale
- ⏳ Traffic delay estimation
- 🚘 Vehicle-aware ETA for Car, Bike, and Bus
- ⛽ Fuel-cost estimation
- 🗺️ Interactive **Leaflet + OpenStreetMap** map
- 🌐 City-network visualization
- 🔍 BFS/DFS-based graph traversal and route exploration
- 🏥 Nearby places lookup
- 🤖 KNN-based AI traffic/ETA prediction from historical demo data
- 📱 Responsive dashboard UI

### AI Traffic Prediction

The application includes a lightweight machine-learning module based on **K-nearest-neighbours (KNN) regression**. It uses a simulated historical dataset with departure hour, weekday/weekend, route distance, traffic score, and vehicle speed to forecast expected traffic delay and travel time **30 minutes after the selected/current time**. Current route traffic and AI future forecasts are displayed separately.

This is a portfolio/learning implementation, not a live traffic prediction service. The training dataset is simulated for demonstration.

### Alternative Route Rule

The application follows this rule:

```text
Original route = Low traffic
        ↓
No alternative shown

Original route = Medium / High traffic
        ↓
Look for another route that:
  • has a longer distance than the shortest route
  • has strictly lower traffic
  • still has a lower ETA after traffic is considered
        ↓
Recommend it only when such a route exists
```

This keeps the shortest route as the default and only suggests taking a longer road when its traffic conditions are meaningfully better.

---

## 🧠 Algorithms

### Dijkstra's Algorithm

Finds the shortest-distance path between the selected source and destination city.

```text
Source
  ↓
Weighted Graph
  ↓
Dijkstra
  ↓
Shortest Route
```

### BFS / DFS

BFS is available for graph traversal, while DFS-based simple-path enumeration is used to explore route alternatives for comparison.

---

## 🏙️ Demo Network

The current demo network contains **13 cities** and **25 city-to-city roads**.

Cities include:

`Patna · Vaishali · Hajipur · Ara · Gaya · Nalanda · Chhapra · Muzaffarpur · Samastipur · Darbhanga · Sitamarhi · Motihari · Begusarai`

> Distances and traffic levels in the demo network are **simulated/approximate values for learning and demonstration**. They are not live road measurements.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- OpenStreetMap

### Backend

- Node.js
- Express.js
- CORS

### Algorithms

- Graph Data Structure
- Dijkstra
- BFS
- DFS / simple-path enumeration
- KNN regression for traffic-delay prediction

### Version Control

- Git
- GitHub

---

## 📂 Project Structure

```text
Smart-City-Traffic
│
├── client
│   ├── assets
│   ├── css
│   ├── js
│   │   ├── app.js
│   │   ├── graph.js
│   │   └── map.js
│   └── index.html
│
├── server
│   ├── ai
│   │   ├── trafficPredictor.js
│   │   └── traffic_history.json
│   ├── algorithms
│   │   ├── bfs.js
│   │   ├── dfs.js
│   │   ├── dijkstra.js
│   │   ├── graph.js
│   │   ├── priorityQueue.js
│   │   └── routeOptions.js
│   ├── controllers
│   ├── data
│   ├── routes
│   ├── services
│   └── server.js
│
├── .gitignore
├── NOTICE.md
└── README.md
```

---

## ⚙️ Run Locally

### 1. Open the project

Open the project folder in VS Code.

### 2. Install backend dependencies

Open a terminal inside the `server` folder and run:

```bash
npm install
```

### 3. Start the backend

```bash
npm start
```

The API runs on:

```text
http://localhost:5000
```

### 4. Open the frontend

Open `client/index.html` with **VS Code Live Server**.

The local frontend automatically uses `http://localhost:5000` for the API.

---

## 🔗 Deployment

This repository intentionally contains **no third-party deployment URLs**.

When the project is deployed, add your own links here:

```text
Frontend:  <your Netlify/Vercel URL>
Backend:   <your Render/Railway URL>
GitHub:    <your GitHub repository URL>
```

Before deploying the frontend, update the production API URL in `client/js/config.js` with your own backend URL.

---

## 📸 Screenshots

Updated screenshots can be added here after the final UI is captured.

---

## 🔮 Planned Enhancements

- 🚑 Emergency vehicle routing
- 📊 Traffic analytics dashboard
- 📍 GPS-based navigation
- 🔔 Traffic incident alerts
- 📡 Live traffic API integration
- 🌙 Dark mode

> **Note:** The current version includes an AI/ML traffic-delay prediction module trained on simulated historical data. Live traffic API integration is still planned.

---

## 👨‍💻 Developer & Attribution

### Modified / Maintained by

**Md Zeeshan**

### Original Contributors

- Saumya Mihir
- Naureen
- Shubham Yadav

This version contains portfolio-oriented modifications and extensions to the original educational project. Please retain the attribution when redistributing derivative versions.

---

## 📄 Project Scope

This project is intended for **educational, internship, portfolio, and learning purposes**.
