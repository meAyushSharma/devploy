<h1 align="center">Devploy : Development pod and Configuration builds</h1>
      
![Logo](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740261820/devploy-high-resolution-logo-edit-1_bu9lgv.png "Devploy logo")
---

### TL;DR   
**Devploy** is an on-demand platform for running <ins>**temporary Docker environments**</ins> in the browser. Users can create containers using <ins>**Dockerfiles or Docker Compose**</ins>, interact via a <ins>**built-in terminal**</ins>, and expose <ins>**custom ports dynamically**</ins> without manual configuration. It supports <ins>**guest mode**</ins> for quick access without an account and uses <ins>**OPFS storage**</ins> to save configurations locally for fast retrieval. Each session runs for <ins>**up to 15 minutes**</ins> before automatic cleanup.    

## Key Features   
- **Instant Deployments** – Spin up containers in **seconds** and use them for **up to 15 minutes** before automatic cleanup.  
- **Browser-Based Terminal** – Interact with your container **directly from the browser**, no SSH required.  
- **Custom Dockerfiles & Compose Support** – Define your own **Dockerfiles** or use **Docker Compose** for multi-container setups.  
- **Dynamic Port Exposure** – No need for manual configurations; devploy **automatically exposes user-defined ports**.  
- **Ephemeral Environments** – Every session is temporary, ensuring a **clean slate** for each test.  

Devploy simplifies testing and deployment, making it a **powerful tool** for developers who need **fast, disposable environments**.    

---

## Architecture   
1. **Underlying technology** - Docker, it uses <ins>*docker to orchestrate and manage*</ins> active services and networks.   
2. **Service Management** - Dockerode, it uses <ins>*dockerode.js*</ins> to manage docker containers via APIs.   
3. **Connection to service** - Websockets, it uses <ins>*websockets server*</ins> to stream from/to container.    
4. **Terminal Access** - Xterm.js, it uses powerful <ins>*xterm*</ins> react library to interact with running container.   
5. **Access Service** - It uses <ins>*reverse proxy server*</ins> built in-house to route request to particular service running inside container with specified port binded to it.    
6. **Browser Storage** - OPFS, it uses <ins>**open private file system**</ins> to store configurations files on local.       
      
![Architecture image](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740862513/diagram-export-3-2-2025-2_23_14-AM_hi5suh.png "Devploy Architecture")
      

## Tech stack    
- **Backend**                   - Node with express.js     
- **Frontend**                  - React.js    
- **Database**                  - Postgresql    
- **Reverse proxy**             - Caddy    
- **Notable implementations**   - 
    - Dockerode : For managing docker images and containers.    
    - WS server : For managing ws connection.     
    - Resend    : For sending verification mails.   
    - Xterm.js  : For browser-based terminal. 


## Reason for building    
1. To provide <ins>simple process</ins> for building docker configurations.   
2. To be able to <ins>test environments</ins> built.    
3. To be <ins>easy to use</ins> and navigate.         



## Implementation    
### **1. Configuration builds**    
1. Integrated <ins>*docker hub with tags*</ins>, <ins>*npm registry*</ins>, <ins>*python package registry (pip)*</ins>, <ins>*cargo package registry*</ins>, <ins>*rubygems registry*</ins> in one place to configure in dockerfile.    
2. Define <ins>*environment variables*</ins>, <ins>*port mappings*</ins>, <ins>*network configurations*</ins>, <ins>*commands*</ins>.    
3. Define all network configurations except overlays.    
4. Build <ins>*docker compose configs*</ins> with multi service config build support.    
5. Download your configurations to keep in your device.    
6. <ins>**Deploy**</ins> your custom build environments for 15 (+ ~2) minutes with <ins>**512 MB** RAM</ins>, run *tests*, *services*, host them at port specified in dockerfile and access them with <ins>*unique endpoint*</ins> provided.   
7. <ins>**OPFS**</ins> storage is utilized to save your configurations locally, enabling storage of gigabytes of data for extremely fast retrieval.    
8. <ins>**Web workers**</ins> are utilized to manage opfs storage so main thread remains free.    

### **2. Service Orchestration and Management**     
1. Implemented <ins>*dockerode*</ins> library to interact with <ins>*docker daemon*</ins> and orchestrate containers.     
2. Defined apis using <ins>*express server*</ins> to manage docker images and containers via dockerode.    
3. Created <ins>*reverse-proxy*</ins> using <ins>*http server*</ins> to efficiently direct incoming traffic to intended service inside container.    
4. Provided unique <ins>*authenticated and protected*</ins> endpoint, for <ins>*each port*</ins> defined in dockerfile, that points to service running, binded to that port, inside container.    
5. Created <ins>*websocket server*</ins> by upgrading incoming requests to http server (http/https) to (ws/wss), to maintain <ins>*full-duplex*</ins> communication between terminal inside container and browser-terminal on client.   
6. Created <ins>*cronjob service*</ins> to cleanup intended images and containers automatically, it removes:     
    a. Containers and their images after 15 +~ 2 minutes, from docker and database.   
    b. Old base images after 30 minutes of creation.     
    c. Prune corrupted containers/images every minute.   

---

## Installation     

1. Fork this repository.   
2. Clone the repository to your local environment.    
3. In server and client folders, create a ```.env``` file and paste contents from ```.env.example``` in it, change ```.env``` file accordingly.   
4. For local development run ```docker compose -f docker-compose.dev.yml up --build``` in terminal opened in root folder where ```docker-compose.dev.yml``` is at.     
Note: 
    1. You need **docker** for this setup, install from here : [Install Docker Guide](https://docs.docker.com/engine/install/)    
    2. This project uses caddy local authority which issues SSL certificates for local development, hence you need to setup it up locally, get root ssl certificates from caddy container, go to files (inside container) => /data/caddy/pki/authorities/local/root.crt, now save/download it and setup certificate management for your operating system, once you are done, go to your ```hosts``` file, for windows, find it: ```c:\Windows\System32\Drivers\etc\hosts``` here, for mac find it: ```/etc/hosts``` here, and add this in it:      

    ```sh
    
    # you can use some other name as well instead of devbox, just change it everywhere, it basically binds localhost -> devbox.localhost
    127.0.0.1 devbox.localhost
    127.0.0.1 server.devbox.localhost
    ```       

    You can actually use ```.example```, ```.test``` or ```.invalid``` as well instead of ```.localhost``` as well, since they do not resolve in dns outside of local environment.   
    Now you are all set, it should be accessible on devbox.localhost    


## Other Features    
1. **Guest Mode** - Use app in guest mode, your data stays at your browser, create configurations, store them, though can not deploy environments, data is volatile since clearing site data results in local data storage deletion.    
2. **Robust Authentication** - <ins>*Google signin*</ins>, *Email signin with verification* using <ins>**Resend**</ins> service.    
3. Download your configurations in a click.    
4. Recovery features like reset password and forgot password are implemented.     

---

## Image Gallery    
*Docker configuration*:     
![Docker configuration](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740087953/Screenshot_2025-02-21_030437_w9on5w.png "Docker configuration")
      
*Active services*:     
![Active services](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096523/Screenshot_2025-02-21_053826_kj8jrd.png "Active services")
      
*Terminal access*:     
![Terminal access](https://res.cloudinary.com/dubrgx4b1/image/upload/v1740096525/Screenshot_2025-02-21_053755_lzaddy.png "Terminal access")