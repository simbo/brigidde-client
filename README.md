***DEPRECATED REPOSITORY***

**The sources of this client repository are meanwhile integrated in the
[server repository](https://github.com/simbo/brigidde).**


brigidde-client
===============

> Chatbot client for [brigidde](https://github.com/simbo/brigidde) using angular, pug, stylus,…

---

## Development Usage

**Requirements:** `docker` with `docker-compose`

The client expects [brigidde server](https://github.com/simbo/brigidde)
running at `localhost:3000`, which can be customized via `.env`.

Install dependencies:  
`docker-compose run --rm app yarn`

Copy env file and customize according your needs:  
`cp .env-sample .env`

Start and manage webpack dev server using *docker-compose*:  
`docker-compose up -d`

With running service, open client in your browser:  
[localhost:9000](http://localhost:9000/)

View webpack log:  
`docker logs -f brigidde-client_app`

Open container shell:  
`docker-compose run --rm -p 9000:9000 app sh -l`
