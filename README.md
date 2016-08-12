## Description

PM2 module to monitor a MySQL server with Keymetrics

## Install

`pm2 install pm2-mysql`

## Configure

- `host` (Defaults to `localhost`) : Set the hostname/ip of your mysql server
- `port` (Defaults to `3306`): Set the port of your mysql server
- `user` (Defaults to `root`): Set the user of your mysql server
- `password` (Defaults to `none`): Set the password of your mysql server

#### How to set these values ?

 After having installed the module you have to type :
`pm2 set pm2-mysql:<key> <value>`

e.g: 
- `pm2 set pm2-mysql:port 3307` (set the mysql port to 3307)
- `pm2 set pm2-mysql:password keppo` (use `keppo` as password for your mysql server)

## Uninstall

`pm2 uninstall pm2-mysql`