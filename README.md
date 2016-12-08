## Description

PM2 module to monitor a MySQL server with Keymetrics

## Install

`pm2 install pm2-mysql`

## Requirements

This module requires a MySQL install (tested against v5.6).

### Slow Queries

To be able to display Slow Queries you first need to activate slow_query_log in MySQL via :
Edit /etc/mysql/my.cnf and add : 
slow_query_log = '1'

and you need to set the log file path to a file your pm2 user has read access to : 
slow_query_log_file = '/var/log/mysql/slow-queries.log'

### General Query Log

To be able to display the slow queries, you need to enable the General Query Log via :
general_log = '1'

and you need to set the log file path to a file your pm2 user has read access to : 
general_log_file = '/var/log/mysql/general.log'


## Configure

- `host` (Defaults to `localhost`) : Set the hostname/ip of your mysql server
- `port` (Defaults to `3306`): Set the port of your mysql server
- `user` (Defaults to `root`): Set the user of your mysql server
- `password` (Defaults to `none`): Set the password of your mysql server
- `refreshRate` (Defaults to 1000): Set the stats refresh rate (in milliseconds)
- `dbDiskName` (Defaults to "sda"): Sets the name of the disk used by the database (used to fetch io stats)
- `slowQueriesLog` (Defaults to "/var/log/mysql/slow-queries.log"): log file to fetch slow queries from

#### How to set these values ?

 After having installed the module you have to type :
`pm2 set pm2-mysql:<key> <value>`

e.g: 
- `pm2 set pm2-mysql:port 3307` (set the mysql port to 3307)
- `pm2 set pm2-mysql:password keppo` (use `keppo` as password for your mysql server)

## Uninstall

`pm2 uninstall pm2-mysql`