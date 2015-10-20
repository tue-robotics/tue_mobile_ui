#!/usr/bin/env python
import rospy
import sys
import os
import roslib
import socket

DEFAULT_PORT = 8000

os.chdir(roslib.packages.get_pkg_dir('tue_mobile_ui'))


# frist try to create a twisted server
def create_twisted_server(port, index_names):
    from twisted.web import static, server
    from twisted.internet import reactor

    print('using TwistedServer')

    root = static.File('.')
    root.index_names = index_names
    root.contentTypes['.woff'] = 'application/font-woff'
    factory = server.Site(root)

    print("Serving HTTP on 0.0.0.0 port %d ...: " % port)
    reactor.listenTCP(port, factory)

    def shutdown():
        rospy.loginfo('KeyboardInterrupt received, closing the server...')
        if reactor.running:
            reactor.stop()
    rospy.on_shutdown(shutdown)
    reactor.run()


# if that fails, create a create a SimpleHTTPRequestHandler
def create_simple_server(port):
    import SimpleHTTPServer
    import SocketServer

    print('using SimpleHTTPServer')

    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", port), Handler)

    print("Serving HTTP on 0.0.0.0 port %d ...: " % port)

    def shutdown():
        rospy.loginfo('KeyboardInterrupt received, closing the server...')
        httpd.shutdown()
    rospy.on_shutdown(shutdown)

    try:
        httpd.serve_forever()
    # except KeyboardInterrupt:
    except KeyboardInterrupt:
        shutdown()

if __name__ == '__main__':
    rospy.init_node('webserver', anonymous=True, disable_signals=True)



    try:
        port = rospy.get_param('~port', DEFAULT_PORT)
        index_names = rospy.get_param('~index_names', ['index.html'])
        print('using port %d from parameter server' % port)
        print('using index names: %s from parameter server' % index_names)
    except socket.error:
        print('no parameter server running, getting port from argv')
        index_names = ['index.html']
        if len(sys.argv) > 1 and sys.argv[1].isdigit():
            port = int(sys.argv[1])
        else:
            port = DEFAULT_PORT

    try:
        create_twisted_server(port, index_names)
    except ImportError:
        create_simple_server(port)
