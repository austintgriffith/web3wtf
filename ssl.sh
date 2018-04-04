#!/bin/bash
sudo certbot certonly --standalone -d web3.wtf -d js.web3.wtf
sudo cp /etc/letsencrypt/live/web3.wtf/privkey.pem .
sudo cp /etc/letsencrypt/live/web3.wtf/fullchain.pem .
