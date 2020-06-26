server {
  listen 9005 default_server;

  server_name comical.site;
  root /var/www/deploy/app/build;

  location / {
      proxy_pass http://localhost:9000;
      #proxy_http_version 1.1;
      #proxy_set_header Upgrade $http_upgrade;
      #proxy_set_header Connection 'upgrade';
      #proxy_set_header Host $host;
      #proxy_cache_bypass $http_upgrade;
  }

  location ^~ /.well-known/acme-challenge/  {
    allow all;
    root  /var/www/deploy/app/;
  }
}
