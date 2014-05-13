#!/usr/bin/env python

import rospy
import sys
import os
import roslib
import socket

os.chdir(roslib.packages.get_pkg_dir('amigo_mobile_ui'))

default_port = 8000

# frist try to create a twisted server
def createTwistedServer(port, indexNames):
	from twisted.web import static, server
	from twisted.internet import reactor

	print('using TwistedServer')

	root = static.File('.')
	root.indexNames=indexNames
	root.contentTypes['.woff'] = 'application/font-woff'
	factory = server.Site(root)

	print("Serving HTTP on 0.0.0.0 port %d ...: " % port)
	reactor.listenTCP(port, factory)
	reactor.run()

# if that fails, create a create a SimpleHTTPRequestHandler
def createSimpleHTTPServer(port):
	import SimpleHTTPServer
	import SocketServer

	print('using SimpleHTTPServer')

	Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
	httpd = SocketServer.TCPServer(("", port), Handler)

	print("Serving HTTP on 0.0.0.0 port %d ...: " % port)
	httpd.serve_forever()

if __name__ == '__main__':
	try:
		# rospy.init_node('webserver', anonymous=True)
		try:
			port 	   = rospy.get_param('/amigo_mobile_webserver/port', default_port)
			indexNames = rospy.get_param('/amigo_mobile_webserver/index_names', ['index.html'])
			print('using port %d from parameter server' % port)
			print('using index names: %s from parameter server' % indexNames)
		except socket.error:
			print('no parameter server running, getting port from argv')
			indexNames = ['index.html']
			if len(sys.argv) > 1 and sys.argv[1].isdigit():
				port = int(sys.argv[1])
			else:
				port = default_port

		try:
			createTwistedServer(port, indexNames)
		except ImportError:
			createSimpleHTTPServer(port)
	except KeyboardInterrupt:
		pass
