# javascript-time-tracker
simple npm server for how long you should take a break

# Why?
There are times where I'd go long study or work session in programming classes and it messes up how long I should take a break as if I followed the pomorodo techinque.
This program is designed to work with that.

# How?
NPM, which is JavaScript without Browser, enabled me to have client and server as JavaScript to run simple code with http server.

# version 0.0.1
First usuable but simple program
It simply tells you how long you should have a break based on var ratio = study_length / break in minutes.
When hosting, "/data" will have "start_time current_time end_time" as "0s 0s 0s" this enables "/" to use "/data" to live update via fetch api.

-- needed feature
count down break time, this enables you to know how long until time to study in real time.
