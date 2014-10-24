# TU/e Mobile UI

### A collection of web applications to control robots from the TU/e

## [Amigo Mobile UI](amigo_mobile_ui)
With this app you can easily teleoperate the robot. It offers touch-based driving, various poses and various interfaces that are needed for robotcup.

## [ED](ed)
This contains the GUI for the world model (ED). It can be used to edit entities in the word model of give high level tasks to the robot.

### Use
To launch the webserver, run one of the robot specific launch files in the [launch](launch) folder. This will launch all the nesecary nodes.
```
$ roslaunch tue_mobile_ui amigo.launch
```

Pre-built files can be found in each `dist` folder and the source files can be found in the `app` folder.

### Contributing
See the [documentation for contributors](CONTRIBUTING.md).
