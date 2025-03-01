<h1 align="center">Devploy</h1>

---

**Devploy** is an on-demand platform for quickly testing **Docker-based environments**. It allows users to **create, deploy, and interact** with containerized setups in seconds—without any manual setup.  

## Key Features  
- **Instant Deployments** – Spin up containers in **seconds** and use them for **up to 15 minutes** before automatic cleanup.  
- **Browser-Based Terminal** – Interact with your container **directly from the browser**, no SSH required.  
- **Custom Dockerfiles & Compose Support** – Define your own **Dockerfiles** or use **Docker Compose** for multi-container setups.  
- **Dynamic Port Exposure** – No need for manual configurations; devploy **automatically exposes user-defined ports**.  
- **Ephemeral Environments** – Every session is temporary, ensuring a **clean slate** for each test.  

Devploy simplifies testing and deployment, making it a **powerful tool** for developers who need **fast, disposable environments**.    

---

## Architecture   
1. **Underlying technology** - Docker, it uses docker to orchestrate and manage active services and networks.   
2. **Service Management** - Dockerode, it uses dockerode.js to manage docker containers via APIs.   
3. **Connection to service** - Websockets, it uses websockets server to stream from/to container.    
4. **Terminal Access** - Xterm.js, it uses powerful xterm react library to interact with running container.   
5. **Access Service** - It uses reverse proxy server built in-house to route request to particular service running inside container with specified port binded to it.    
6. **Browser Storage** - OPFS, it uses **open private file system** to store configurations files on local.    


## Tech stack    
- **Backend**                   - Node with express.js     
- **Frontend**                  - React.js    
- **Database**                  - Postgresql    
- **Notable implementations**   - Server: Dockerode, websocket || Client: xterm.js, web workers, opfs    

## Implementation    
---
### **Configuration builds**    
1. Integrated <ins>*docker hub with tags*</ins>, <ins>*npm registry*</ins>, *python package registry (pip)*, *cargo package registry*, *rubygems registry* in one place to configure in dockerfile.    
2. Define *environment variables*, *port mappings*, *network configurations*, *commands*.    
3. Define all network configurations except overlays.    
4. Build *docker compose configs* with multi service config build support.    
5. Download your configurations to keep in your device.    
6. **Deploy** your custom build environments for 15 (+ ~2) minutes with **512 MB** RAM, run *tests*, *services*, host them at port specified in dockerfile and access them with *unique endpoint* provided.   
7. **OPFS** storage is utilized to save your configurations locally, enabling storage of gigabytes of data for extremely fast retrieval.    
8. **Web workers** are utilized to manage opfs storage so main thread remains free.    

### **Service Orchestration and Management**     
1. Implemented *dockerode* library to interact with *docker daemon* and orchestrate containers.     
2. Defined apis using *express server* to manage docker images and containers via dockerode.    
3. Created *reverse-proxy* using *http server* to efficiently direct incoming traffic to intended service inside container.    
4. Provided unique *authenticated and protected* endpoint, for *each port* defined in dockerfile, that points to service running, binded to that port, inside container.    
5. Created *websocket server* by upgrading incoming requests to http server (http/https) to (ws/wss), to maintain *full-duplex* communication between terminal inside container and browser-terminal on client.   
6. Created *cronjob service* to cleanup intended images and containers automatically, it removes:     
    a. Containers and their images after 15 +~ 2 minutes, from docker and database.   
    b. Old base images after 30 minutes of creation.     
    c. Prune corrupted containers/images every minute.   







