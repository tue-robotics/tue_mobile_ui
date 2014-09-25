// (function() {

// Demo of the "cameras/orbit" node type, which orbits the eye about a point of interest

// Point SceneJS to the bundled plugins
SceneJS.setConfigs({
  pluginPath:"../utils/bower_components/scenejs/plugins"
});

var scene;
var clientQueryMeshes;

/**
 * Orbiting camera node type
 *
 * Usage example
 * -------------
 *
 * someNode.addNode({
 *      type: "cameras/orbit",
 *      eye:{ x: y:0 },
 *      look:{ y:0 },
 *      yaw: 340,,
 *      pitch: -20,
 *      zoom: 350,
 *      zoomSensitivity:10.0,
 * });
 *
 * The camera is initially positioned at the given 'eye' and 'look', then the distance of 'eye' is zoomed out
 * away from 'look' by the amount given in 'zoom', and then 'eye' is rotated by 'yaw' and 'pitch'.
 *
 */
SceneJS.Types.addType("ed_camera", {

    construct:function (params) {

        var lookat = this.addNode({
            type:"lookAt",

            // A plugin node type is responsible for attaching specified
            // child nodes within itself
            nodes:params.nodes
        });

        var yaw = params.yaw || 0;
        var pitch = params.pitch || 0;
        var zoom = params.zoom || 10;
        var minPitch = params.minPitch;
        var maxPitch = params.maxPitch;
        var zoomSensitivity = params.zoomSensitivity || 1.0;

        var lastX;
        var lastY;
        var dragging = false;

        var eye = params.eye || { x:0, y:0, z:0 };
        var look = params.look || { x:0, y:0, z:0};

        lookat.set({
            eye:{ x:eye.x, y:eye.y, z:-zoom },
            look:{ x:look.x, y:look.y, z:look.z },
            up:{ x:0, y:1, z:0 }
        });

        update();

        var canvas = this.getScene().getCanvas();

        canvas.addEventListener('mousedown', mouseDown, true);
        canvas.addEventListener('mousemove', mouseMove, true);
        canvas.addEventListener('mouseup', mouseUp, true);
        canvas.addEventListener('touchstart', touchStart, true);
        canvas.addEventListener('touchmove', touchMove, true);
        canvas.addEventListener('touchend', touchEnd, true);
        canvas.addEventListener('mousewheel', mouseWheel, true);
        canvas.addEventListener('DOMMouseScroll', mouseWheel, true);

        function mouseDown(event) {
            lastX = event.clientX;
            lastY = event.clientY;
            dragging = true;
        }

        function touchStart(event) {
            lastX = event.targetTouches[0].clientX;
            lastY = event.targetTouches[0].clientY;
            dragging = true;
        }

        function mouseUp() {
            dragging = false;
        }

        function touchEnd() {
            dragging = false;
        }

        function mouseMove(event) {
            var posX = event.clientX;
            var posY = event.clientY;
            actionMove(posX, posY);
        }

        function touchMove(event) {
            var posX = event.targetTouches[0].clientX;
            var posY = event.targetTouches[0].clientY;
            actionMove(posX, posY);
        }

        function actionMove(posX, posY) {
            if (dragging) {

                yaw -= (posX - lastX) * 0.1;
                pitch -= (posY - lastY) * 0.1;

                update();

                lastX = posX;
                lastY = posY;
            }
        }

        function mouseWheel(event) {
            var delta = 0;
            if (!event) event = window.event;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                if (window.opera) delta = -delta;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta) {
                if (delta < 0) {
                    zoom -= zoomSensitivity;
                } else {
                    zoom += zoomSensitivity;
                }
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.returnValue = false;
            update();

        }

        function update() {

            if (minPitch != undefined && pitch < minPitch) {
                pitch = minPitch;
            }

            if (maxPitch != undefined && pitch > maxPitch) {
                pitch = maxPitch;
            }

            var eye = [0, 0, zoom];
            var look = [0, 0, 0];
            var up = [0, 1, 0];

            // TODO: These references are to private SceneJS math methods, which are not part of API

            var eyeVec = SceneJS_math_subVec3(eye, look, []);
            var axis = SceneJS_math_cross3Vec3(up, eyeVec, []);

            var pitchMat = SceneJS_math_rotationMat4v(pitch * 0.0174532925, axis);
            var yawMat = SceneJS_math_rotationMat4v(yaw * 0.0174532925, up);

            var eye3 = SceneJS_math_transformPoint3(pitchMat, eye);
            eye3 = SceneJS_math_transformPoint3(yawMat, eye3);

            lookat.setEye({x:eye3[0], y:eye3[1], z:eye3[2] });
        }
    },

    setLook: function(l) {


    },

    destruct:function () {
        // TODO: remove mouse handlers
    }
});

function calculateNormals (vertices, triangles) {

    var normals = new Float32Array(vertices.length);

    for(var i = 0; i < vertices.length; i += 3) {
      normals[i] = 1;
      normals[i + 1] = 0;
      normals[i + 2] = 0;
    }

    // for (var i = 0; i < indices.length; i++) {
    //     var j0 = indices[i][0];
    //     var j1 = indices[i][1];
    //     var j2 = indices[i][2];

    //     var v1 = positions[j0];
    //     var v2 = positions[j1];
    //     var v3 = positions[j2];

    //     v2 = SceneJS_math_subVec4(v2, v1, [0, 0, 0, 0]);
    //     v3 = SceneJS_math_subVec4(v3, v1, [0, 0, 0, 0]);

    //     var n = SceneJS_math_normalizeVec4(SceneJS_math_cross3Vec4(v2, v3, [0, 0, 0, 0]), [0, 0, 0, 0]);

    //     if (!nvecs[j0]) nvecs[j0] = [];
    //     if (!nvecs[j1]) nvecs[j1] = [];
    //     if (!nvecs[j2]) nvecs[j2] = [];

    //     nvecs[j0].push(n);
    //     nvecs[j1].push(n);
    //     nvecs[j2].push(n);
    // }

    // var normals = new Array(positions.length);

    // // now go through and average out everything
    // for (var i = 0; i < nvecs.length; i++) {
    //     var count = nvecs[i].length;
    //     var x = 0;
    //     var y = 0;
    //     var z = 0;
    //     for (var j = 0; j < count; j++) {
    //         x += nvecs[i][j][0];
    //         y += nvecs[i][j][1];
    //         z += nvecs[i][j][2];
    //     }
    //     normals[i] = [-(x / count), -(y / count), -(z / count)];
    // }
    return normals;
}

function handleMeshQueryResult(msg) {
  // console.log(entity_ids)

  for (var i = 0; i < msg.entity_ids.length; i++) {
    var id = msg.entity_ids[i]
    var n = scene.getNode(id);

    // Remove the mesh ...
    n.removeNode(id + "-mesh");

    var r = 0.0;
    var g = 0.3;
    var b = 1.0;

    // ... and replace it by the received one
    n.addNode(
        {
          type:"material",
          color:{ r: r, g: g, b: b },
          id: id + "-mesh",

          nodes:[
              {
                type: "geometry",
                primitive: "triangles",
                positions: new Float32Array(msg.meshes[i].vertices),
                indices: new Uint16Array(msg.meshes[i].triangles),
                normals: calculateNormals(msg.meshes[i].vertices, msg.meshes[i].triangles)
              }
          ]
        }
      )
  }
}

function edUpdate(msg) {

  // list of entity ids of which we must query the mesh
  var q_mesh_entity_ids = [];

  for (var i = 0; i < msg.entities.length; i++) {
    var e = msg.entities[i];
      //console.log(e.id + " " + e.pose.position.x);

    var n = scene.getNode("world").getNode(e.id);

    // For some reason, the scenejs matrices are transposed compared to GL
    matrix = SceneJS_math_newMat4FromQuaternion([e.pose.orientation.x, e.pose.orientation.y, e.pose.orientation.z, e.pose.orientation.w]);
    matrix[12] = e.pose.position.x;
    matrix[13] = e.pose.position.y;
    matrix[14] = e.pose.position.z;

    // console.log(e.id + " " + matrix);

    if (n) {
      // TODO: update position
    } else {

      scene.getNode("world").addNode(
        {
          type: "matrix",
          id: e.id,
          elements: matrix,

          nodes: [
            {
            type:"material",
            color:{ r:1.0, g:0.0, b:0.0 },
            id: e.id + "-mesh",

            nodes:[
                {
                  type: "prims/box",
                  xSize: 0.1,
                  ySize: 0.1,
                  zSize: 0.1
                  // primitive: "triangles",
                  // positions:new Float32Array([0, 0, 0, 0, 0, 0.1, 0, 0.1, 0]),
                  // indices:new Uint16Array([0, 1, 2]),
                  // normals:new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0])
                }
              ]
            }
          ]
        }
      );

      q_mesh_entity_ids.push(e.id);
    }
  }

  if (q_mesh_entity_ids.length > 0) {
    var req = new ROSLIB.ServiceRequest({
      entity_ids: q_mesh_entity_ids
    });
    clientQueryMeshes.callService(req, function(result) {
      handleMeshQueryResult(result);
    });
  }
}

$(document).ready(function () {

  // Create scene
  scene = SceneJS.createScene({
    nodes:[
      // Mouse-orbited camera,
      // implemented by plugin at http://scenejs.org/api/latest/plugins/node/cameras/orbit.js
      {
        type:"ed_camera",
        yaw:40,
        pitch:-20,
        zoom:10,
        zoomSensitivity:10.0,
        eye:{ x:5, y:0, z:10 },
        look:{ x:4.9, y:0, z:0 },
        up:{ x:0, y:0, z:1 },

        nodes:[

          // Default material
          {
            type:"material",
            color:{ r:0.3, g:0.3, b:1.0 },
            id: "world"
          }
        ]
      }
    ]
  });

    // Connecting to ROS.
  var rosUrl = 'ws://' + window.location.hostname + ':9090';
  ros = new ROSLIB.Ros({
    url : rosUrl
  });

  console.log("ROS: Connecting to " + rosUrl);

  var mapListener = new ROSLIB.Topic({
    ros : ros,
    name : '/ed/gui/entities',
    messageType : 'ed_gui_server/EntityInfos'
  });
  mapListener.subscribe(function(message) {
    edUpdate(message);
  });

    // get the last measurements for an object
  clientQueryMeshes = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/query_meshes',
      serviceType : 'ed_gui_server/QueryMeshes'
  });

});

//})();
