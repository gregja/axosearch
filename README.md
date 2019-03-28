# axosearch
Tool for searching components into Axoloti patches (2 versions : PHP &amp; NodeJS)
-------------------------

A small project for helping the Axoloti users.
It's written in 2 versions :
- one version in PHP
- one version in NodeJS

The scripts are very simple, there'no need of external libraries, components or packages.
The PHP and NodeJS scripts works identically, with 2 modes of searching described below :

- You can search the patches containing a name or a component name (for example "lfo" or "square"), it's the mode "all code".

- You can search the patches where a component name is plugged (for example "lfo/square"), it's the mode "type attribute only".

-------------------------
For using the PHP script :

To use the PHP script, install it in a "htdocs" repository of your WAMP, MAMP or LAMP server.
Before to use it, you must personalize the path of your working repository, in the variable $search_path, which is declared in the beginning of the script :

 $search_path = '/home/gregja/axoloti/axoloti-factory/patches/';

After that, you can launch the script in your browser, like for example :

http://localhost/you_repository/axosearch.php

-------------------------

For using the NodeJS script :

You must install NodeJS on your computer (the script has been tested on NodeJS v10).

You must personalize the path in the variable search_path, which is declared in the beginning of the script :

var search_path = "D:/Documents/jstests/games/3draids"

Launch the script with the command :

node axosearch.js

After that, you can launch the script in your browser, like for example :

http://localhost:8081/

If the port 8081 is yet used on your computer, you can change it into the script (cf. "port" variable)
