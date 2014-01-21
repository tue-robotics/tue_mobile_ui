#!/usr/bin/env python
######
####	Rein Appeldoorn '13
##
#

from SimpleHTTPServer import *
import BaseHTTPServer
import glob
import roslib
import os
import sys

############################
## Index.html constructor ##
############################

#index = open('index.html','w')

#index.write(open('src/top.html').read())

# Load the main modules
#for main_module in glob.glob("src/main_modules/*.html"):
#    index.write(open(main_module).read())

#index.write(open('src/middle.html').read())

# Load the sidebar modules
#for sidebar_module in glob.glob("src/sidebar_modules/*.html"):
#    index.write(open(sidebar_module).read())

#index.write(open('src/bottom.html').read())
#index.close()

############################
## The simple html server ##
############################

os.chdir(roslib.packages.get_pkg_dir('amigo_mobile_ui'))

#PORT
sys.argv[1] = '8000'

HandlerClass = SimpleHTTPRequestHandler
ServerClass = BaseHTTPServer.HTTPServer

BaseHTTPServer.test(HandlerClass, ServerClass)
