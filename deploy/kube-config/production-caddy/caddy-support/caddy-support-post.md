<!--

YOU MUST USE THIS TEMPLATE TO GET HELP.

The community looks forward to helping you. But most people don't provide enough information, making assistance difficult. If you ignore or skip questions in this template, we will just ask that you fill it out anyway.

This forum uses Markdown. PLEASE ENCLOSE CODE, CONFIG, AND LOGS IN CODE BLOCKS. Code blocks start with three backticks (```) on their own line, and end with ``` on their own line. Please use the preview pane to ensure your post looks nice.

If your post is poorly formatted, it will be hard to read, and others will not want to help.

If you are not asking for help, you do not need to use this template.

Thank you for understanding.

-->
Hello, I'm super new to Caddy and am just trying to get things to work. I've been using nginx and certbot in the past and want to simplify my life using caddy since I hear it's really great!

## NOTE: 
I've changed the name of my actual domain in commands/files/logs below to `redacted.site` to not expose it. I own the domain and have full control of updating the DNS records.

### 1. Caddy version (`caddy version`):

`v2.0.0 h1:pQSaIJGFluFvu8KDGDODV8u4/QRED/OPyIR+MWYYse8=`

### 2. How I run Caddy:
<!-- Please provide all of the relevant information and **DO NOT REDACT** anything except credentials. This is a rule. We cannot help you otherwise, and yes we mean it! Your exact domain names, etc, are significant. Thank you! -->

Using a docker container inside my Kubernetes Pod. 

```
FROM caddy/caddy:alpine
# I had to add this as my container wouldn't start caddy automatically
RUN caddy start | tee ${WORK_DIR}/caddy.log 
```

OR to debug inside the pod (more recently), I run the following

`caddy run`


#### a. System environment:
<!-- OS, relevant versions, systemd? Docker? etc. -->

DNS Provider

`Namecheap`

Cloud Provider

`DigitalOcean`

Kubernetes version deployed (on DigitalOcean)

`1.17.5-do.0`

System Info from Pod

```
> uname -a
Linux [POD_NAME] 4.19.0-0.bpo.6-amd64 #1 SMP Debian 4.19.67-2+deb10u2~bpo9+1 (2019-11-12) x86_64 Linux`
```

#### b. Command:
<!-- Commands are what you type into a terminal, i.e. the command you use to run Caddy. -->

```
caddy run
```

#### c. Service/unit/compose file:
<!-- If using Docker/systemd/Kubernetes/make etc. -->

Dockerfile relevant contents that is used in the K8 deployment file below

```
FROM caddy/caddy:alpine
# I had to add this as my container wouldn't start caddy automatically
RUN caddy start | tee ${WORK_DIR}/caddy.log 
EXPOSE 9000
```

Kubernetes Deployment config - `deployment.yaml`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: redacted-site
  name: redacted-site-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redacted-site-app
  template:
    metadata:
      labels:
        app: redacted-site-app
    spec:
      containers:
        - name: redacted-site-app
          image: mydockerrepo:redacted-site/caddy
          ports:
            - containerPort: 9000
          imagePullPolicy: Always
```

Kubernetes Loadbalancer config - `loadbalancer.yaml`

```
apiVersion: v1
kind: Service
metadata:
  namespace: redacted-site
  name: loadbalancer
  annotations:
    # service.beta.kubernetes.io/do-loadbalancer-healthcheck-path: "/health"
    # service.beta.kubernetes.io/do-loadbalancer-protocol: "http2"
    # service.beta.kubernetes.io/do-loadbalancer-certificate-id: "9xxxxxxx-8aaa-4bbb-8ccc-c123456789ab"
    # service.beta.kubernetes.io/do-loadbalancer-redirect-http-to-https: "true"
spec:
  type: LoadBalancer
  ports:
    - name: https
      port: 443
      targetPort: 9000
    - name: http
      port: 80
      targetPort: 9000
  selector:
    app: redacted-site-app
```


#### d. My complete Caddyfile or JSON config:

```
{
  acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
  email MY_EMAIL
}
readacted.site
root * /var/www/deploy/app
file_server
```

### 3. The problem I'm having:
<!-- What are you trying to do, and what isn't working? Please describe the issue thoroughly enough so that anyone can reproduce the exact behavior you're seeing. Be as specific as possible. -->

I'm trying to obtain a certificate for my site (redacted.site) and ensure that http and https direct correctly to my web server. I have a docker image with caddy as a part of it. It runs in a kubernetes pod. The kubernetes load balancer directs http (80) and https (443) traffic to my kubernetes pod running this docker container on port 9000.

After my Kubernetes pod is healthy, my service (redacted-site-app) is running inside at port 9000 and ready to serve requests. It consists of an API and a front end that returns html. 

I updated my DNS record for the domain (redacted.site) to point to the load balancer created by the kubernetes config file above. Externally the kubernetes loadbalancer directs port traffic from 80 and 443 to port 9000 in my container. In order to test it, I visited the site over http and my web server seems to serve all http requests correctly. (Note: This test works fine without caddy installed even)

When I run caddy, it starts up fine but it is unable to complete the http challenge as it goes out externally and tries `redacted.site/.well-known/...` , which seems to hit my running web server and returns html instead of caddy handling it (is this expected?). But as a result it fails the challenge and the same with https. They do return 2 different errors (403 and 400) but I don't understand how this works.

Http Challenge  

```
2020/06/17 23:29:51 [ERROR] attempt 1: [redacted.site] Obtain: [redacted.site] error: one or more domains had a problem:
[redacted.site] acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Invalid response from http://redacted.site/.well-known/acme-challenge/uhs0oXpk10iJouLhWa4Pxizr2DIrBqhZ6ppAO-erO2Q [157.230.75.99]: "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><link rel=\"shortcut icon\" href=\"/favicon.ico\"><link rel=\"manifest\" hr", url:
 - retrying in 1m0s (14.83096781s/720h0m0s elapsed)...
```

Https tls-alpn-01
```
2020/06/17 23:29:42 [ERROR] error: one or more domains had a problem:
[redacted.site] acme: error: 400 :: urn:ietf:params:acme:error:malformed :: Server only speaks HTTP, not TLS, url:
 (challenge=tls-alpn-01 remaining=[http-01])
 ```


### 4. Error messages and/or full log output:
<!-- Please **DO NOT REDACT** any information except credentials. -->

```
{"level":"info","ts":1592436577.044735,"msg":"using adjacent Caddyfile"}
{"level":"info","ts":1592436577.0517957,"logger":"admin","msg":"admin endpoint started","address":"tcp/localhost:2019","enforce_origin":false,"origins":["[::1]:2019","127.0.0.1:2019","localhost:2019"]}
{"level":"info","ts":1592436577.0529459,"logger":"http","msg":"server is listening only on the HTTPS port but has no TLS connection policies; adding one to enable TLS","server_name":"srv0","https_port":443}
{"level":"info","ts":1592436577.0535347,"logger":"http","msg":"enabling automatic HTTP->HTTPS redirects","server_name":"srv0"}
{"level":"info","ts":1592436577.0544076,"logger":"tls","msg":"cleaned up storage units"}
{"level":"info","ts":1592436577.0550501,"logger":"http","msg":"enabling automatic TLS certificate management","domains":["redacted.site"]}
{"level":"info","ts":1592436577.0558252,"msg":"autosaved config","file":"/config/caddy/autosave.json"}
{"level":"info","ts":1592436577.056541,"msg":"serving initial configuration"}
2020/06/17 23:29:37 [INFO][redacted.site] Obtain certificate; acquiring lock...
2020/06/17 23:29:37 [INFO][redacted.site] Obtain: Lock acquired; proceeding...
2020/06/17 23:29:37 [INFO][cache:0xc000090b40] Started certificate maintenance routine
2020/06/17 23:29:37 [INFO][redacted.site] Waiting on rate limiter...
2020/06/17 23:29:37 [INFO][redacted.site] Done waiting
2020/06/17 23:29:37 [INFO] [redacted.site] acme: Obtaining bundled SAN certificate given a CSR
2020/06/17 23:29:37 [INFO] [redacted.site] AuthURL: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420567
2020/06/17 23:29:37 [INFO] [redacted.site] acme: use tls-alpn-01 solver
2020/06/17 23:29:37 [INFO] [redacted.site] acme: Trying to solve TLS-ALPN-01
2020/06/17 23:29:37 http: TLS handshake error from 127.0.0.1:48040: EOF
2020/06/17 23:29:42 [INFO] Deactivating auth: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420567
2020/06/17 23:29:42 [ERROR] error: one or more domains had a problem:
[redacted.site] acme: error: 400 :: urn:ietf:params:acme:error:malformed :: Server only speaks HTTP, not TLS, url:
 (challenge=tls-alpn-01 remaining=[http-01])
2020/06/17 23:29:42 [INFO] Unable to deactivate the authorization: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420567
2020/06/17 23:29:44 [INFO] [redacted.site] acme: Obtaining bundled SAN certificate given a CSR
2020/06/17 23:29:44 [INFO] [redacted.site] AuthURL: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420584
2020/06/17 23:29:44 [INFO] [redacted.site] acme: Could not find solver for: tls-alpn-01
2020/06/17 23:29:44 [INFO] [redacted.site] acme: use http-01 solver
2020/06/17 23:29:44 [INFO] [redacted.site] acme: Trying to solve HTTP-01
2020/06/17 23:29:49 [INFO] Deactivating auth: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420584
2020/06/17 23:29:49 [ERROR] error: one or more domains had a problem:
[redacted.site] acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Invalid response from http://redacted.site/.well-known/acme-challenge/uhs0oXpk10iJouLhWa4Pxizr2DIrBqhZ6ppAO-erO2Q [157.230.75.99]: "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><link rel=\"shortcut icon\" href=\"/favicon.ico\"><link rel=\"manifest\" hr", url:
 (challenge=http-01 remaining=[])
2020/06/17 23:29:49 [INFO] Unable to deactivate the authorization: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/66420584
2020/06/17 23:29:51 [ERROR] attempt 1: [redacted.site] Obtain: [redacted.site] error: one or more domains had a problem:
[redacted.site] acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Invalid response from http://redacted.site/.well-known/acme-challenge/uhs0oXpk10iJouLhWa4Pxizr2DIrBqhZ6ppAO-erO2Q [157.230.75.99]: "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><link rel=\"shortcut icon\" href=\"/favicon.ico\"><link rel=\"manifest\" hr", url:
 - retrying in 1m0s (14.83096781s/720h0m0s elapsed)...
^C{"level":"info","ts":1592436594.320533,"msg":"shutting down","signal":"SIGINT"}
2020/06/17 23:29:54 [INFO][cache:0xc000090b40] Stopped certificate maintenance routine
{"level":"info","ts":1592436594.3209422,"logger":"admin","msg":"stopped previous server"}
{"level":"info","ts":1592436594.3209667,"msg":"shutdown done","signal":"SIGINT"}
```

### 5. What I already tried:
<!-- Show us what effort you've put in to solving the problem. Be specific -- people are volunteering their time to help you! Low effort posts are not likely to get good answers! -->

I tried messing with a few port configurations but no luck

I tried searching a bunch of caddy forum posts for 403 errors with http challenges but nothing lists this particular setup or why this happens

I also researched the letsencrypt forum for similar problems and I noticed that some suggested that the web server shouldn't be running but I don't think that makes sense

Caddy is supposed to handle routing to `/.well-known/` but no file paths are created on my web server (writes to a file under .well-known for the certificate challenge) and all requests seem to fall back to my running web server

I also looked into the alternate DNS challenge option but my DNS provider (Namecheap) doesn't support it.

I also understand that let's encrypt requires port 80 and 443 to be exposed but from a DNS perspective, these ports will direct to my single exposed container port/web server based on my config (or maybe I missed a step and I could be wrong)

Any help will be greatly appreciated! Thanks in advance

### 6. Links to relevant resources: