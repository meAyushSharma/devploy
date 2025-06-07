<h1 align="center">Devploy : Development Pod and Configuration Builds</h1>
      
![Logo](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740261820/devploy-high-resolution-logo-edit-1_bu9lgv.png "Devploy logo")
---

### TL;DR   
**Devploy** is an on-demand platform for running <ins>**temporary Docker environments**</ins> in the browser. Users can create containers using <ins>**Dockerfiles or Docker Compose**</ins>, interact via a <ins>**built-in terminal**</ins>, and expose <ins>**custom ports dynamically**</ins> without manual configuration. It supports <ins>**guest mode**</ins> for quick access without an account and uses <ins>**OPFS storage**</ins> to save configurations locally for fast retrieval. Each session runs for <ins>**up to 15 minutes**</ins> before automatic cleanup.    

## Key Features   
- **Instant Deployments** – Spin up containers in **seconds** and use them for **up to 15 minutes** before automatic cleanup.  
- **Browser-Based Terminal** – Interact with your container **directly from the browser**, no SSH required.  
- **Custom Dockerfiles & Compose Support** – Define your own **Dockerfiles** or use **Docker Compose** for multi-container setups.  
- **Dynamic Port Exposure** – No need for manual configurations; Devploy **automatically exposes user-defined ports**.  
- **Ephemeral Environments** – Every session is temporary, ensuring a **clean slate** for each test.  
- **Ask Devai** - Converse with AI to solve queries regarding configurations.

Devploy simplifies testing and deployment, making it a **powerful tool** for developers who need **fast, disposable environments**.    

---

## Architecture   
1. **Underlying technology** - Docker, it uses <ins>*Docker to orchestrate and manage*</ins> active services and networks.   
2. **Service Management** - Dockerode, it uses <ins>*dockerode.js*</ins> to manage Docker containers via APIs.   
3. **Connection to service** - WebSockets, it uses <ins>*WebSocket server*</ins> to stream from/to containers.    
4. **Terminal Access** - Xterm.js, it uses powerful <ins>*Xterm*</ins> React library to interact with running containers.   
5. **Access Service** - It uses <ins>*reverse proxy server*</ins> built in-house to route requests to specific services running inside containers with specified port bindings.    
6. **Browser Storage** - OPFS, it uses <ins>**Origin Private File System**</ins> to store configuration files locally.       
      
![Architecture image](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740862513/diagram-export-3-2-2025-2_23_14-AM_hi5suh.png "Devploy Architecture")
      

## Tech Stack    
- **Backend**                   - Node.js with Express.js     
- **Frontend**                  - React.js with Tailwind CSS    
- **Database**                  - PostgreSQL    
- **Reverse Proxy**             - Caddy    
- **Notable Implementations**   -
    - Dockerode : For managing Docker images and containers.    
    - WebSocket Server : For managing WebSocket connections.     
    - Resend    : For sending verification emails.   
    - Xterm.js  : For browser-based terminal.    
    - MindsDB AI integration : codellama-70b llm model with OpenAI chat completions API.    


## Reason for Building    
1. To provide a <ins>simple process</ins> for building Docker configurations.   
2. To enable users to <ins>test environments</ins> they build.    
3. To ensure Devploy is <ins>easy to use</ins> and navigate.          


## Implementation    
### **1. Configuration Builds**    
1. Integrated <ins>*Docker Hub with tags*</ins>, <ins>*NPM registry*</ins>, <ins>*Python Package Index (pip)*</ins>, <ins>*Cargo package registry*</ins>, <ins>*RubyGems registry*</ins> in one place for seamless Dockerfile configuration.    
2. Define <ins>*environment variables*</ins>, <ins>*port mappings*</ins>, <ins>*network configurations*</ins>, and <ins>*commands*</ins>.    
3. Support for all network configurations except overlays.    
4. Build <ins>*Docker Compose configs*</ins> with multi-service support.    
5. Download configurations to keep on your device.    
6. <ins>**Deploy**</ins> your custom-built environments for 15 (+ ~2) minutes with <ins>**512 MB** RAM</ins>. Run *tests*, *services*, and host applications at the ports specified in the Dockerfile with a <ins>*unique endpoint*</ins>.   
7. <ins>**OPFS**</ins> storage is used to save configurations locally, allowing gigabytes of storage for extremely fast retrieval without overloading main thread by using web-workers on client.        
8. <ins>**Web Workers**</ins> are used to manage OPFS storage, keeping the main thread free.    

### **2. Service Orchestration and Management**     
1. Implemented <ins>*Dockerode*</ins> library to interact with <ins>*Docker daemon*</ins> and orchestrate containers.     
2. Defined APIs using <ins>*Express server*</ins> to manage Docker images and containers via Dockerode.    
3. Created a <ins>*reverse-proxy*</ins> using an <ins>*HTTP server*</ins> to efficiently direct incoming traffic to the intended service inside the container.    
4. Provided unique <ins>*authenticated and protected*</ins> endpoints for each exposed port, binding them to services inside the container.    
5. Created a <ins>*WebSocket server*</ins> by upgrading incoming HTTP requests to maintain <ins>*full-duplex*</ins> communication between the terminal inside the container and the browser terminal on the client.   
6. Created a <ins>*cron job service*</ins> to automatically clean up unused images and containers:     
    a. Containers and their images are removed after 15 (+~2) minutes.   
    b. Old base images are removed after 30 minutes.     
    c. Corrupted containers/images are pruned every minute.   

---

## Installation     

1. Fork this repository.   
2. Clone the repository to your local environment.    
3. In server and client folders, create a ```.env``` file and copy the contents from ```.env.example```, then modify it accordingly.   
4. For local development, run:    
   ```sh
   docker compose -f docker-compose.dev.yml up --build
   ```    
**Note:**
- You need **Docker** installed: [Install Docker Guide](https://docs.docker.com/engine/install/)    
- Devploy uses Caddy's local authority to issue SSL certificates for local development. You need to set it up locally by:
  - Retrieving root SSL certificates from the Caddy container: `/data/caddy/pki/authorities/local/root.crt`
  - Setting up certificate management for your OS.
  - Adding the following entries to your `hosts` file:
    ```sh
    127.0.0.1 devploy.localhost
    127.0.0.1 server.devploy.localhost
    ```       
  Now, it should be accessible at `devploy.localhost`.   

## Other Features    
1. **Guest Mode** - Use the app without an account. Configurations are stored locally but cannot be deployed. Local data is volatile and will be lost if site data is cleared.    
2. **Robust Authentication** - <ins>*Google Sign-In*</ins>, *Email verification* using <ins>**Resend**</ins>.    
3. **One-Click Configuration Download**.    
4. **Password Recovery** features implemented.     

---

## Image Gallery    
*Home*:     
![Home](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740997087/Screenshot_2025-03-03_154413_smcixe.png "Devploy Home")

*Docker Configuration*:     
![Docker Configuration](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740087953/Screenshot_2025-02-21_030437_w9on5w.png "Docker Configuration")
      
*Active Services*:     
![Active Services](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096523/Screenshot_2025-02-21_053826_kj8jrd.png "Active Services")
      
*Terminal Access*:     
![Terminal Access](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096525/Screenshot_2025-02-21_053755_lzaddy.png "Terminal Access")

