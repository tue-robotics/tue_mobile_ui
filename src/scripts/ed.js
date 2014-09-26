// (function() {

// Demo of the "cameras/orbit" node type, which orbits the eye about a point of interest

// Point SceneJS to the bundled plugins
SceneJS.setConfigs({
  pluginPath:"../utils/bower_components/scenejs/plugins"
});

var scene;
var clientQueryMeshes;

var REDS =   [ 0.8, 0  , 0.8, 0,   0.8, 0  , 0.8];
var GREENS = [ 0.8, 0.8, 0  , 0,   0.8, 0.8, 0  ];
var BLUES =  [ 0.8, 0.8, 0.8, 0.8, 0,   0,   0  ];

// Hash function
function djb2(str){
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }

  if (hash < 0) {
    hash = -hash;
  }

  return hash;
}

function handleMeshQueryResult(msg) {

  for (var i = 0; i < msg.entity_ids.length; i++) {
    var id = msg.entity_ids[i]

    // Generate color from hash function
    var iColor = djb2(id) % REDS.length;
    var r = REDS[iColor];
    var g = GREENS[iColor];
    var b = BLUES[iColor];

    indices = new Uint16Array(msg.meshes[i].vertices.length / 3);
    for (var j = 0; j < indices.length; j++) {
      indices[j] = j
    }

    var mesh = msg.meshes[i]

    // Calculate normals
    var normals = new Float32Array(msg.meshes[i].vertices.length);
    for(var j = 0; j < mesh.vertices.length; j += 9) {
      p1 = [mesh.vertices[j+0], mesh.vertices[j+1], mesh.vertices[j+2]];
      p2 = [mesh.vertices[j+3], mesh.vertices[j+4], mesh.vertices[j+5]];
      p3 = [mesh.vertices[j+6], mesh.vertices[j+7], mesh.vertices[j+8]];

      v1 = SceneJS_math_subVec3(p1, p2, []);
      v2 = SceneJS_math_subVec3(p1, p3, []);

      var n = SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3(v1, v2));

      normals[j + 0] = n[0];
      normals[j + 1] = n[1];
      normals[j + 2] = n[2];

      normals[j + 3] = n[0];
      normals[j + 4] = n[1];
      normals[j + 5] = n[2];

      normals[j + 6] = n[0];
      normals[j + 7] = n[1];
      normals[j + 8] = n[2];
    }

    // Get the entity scene node
    var n = scene.getNode(id);

    // Remove the mesh ...
    n.removeNode(id + "-mesh");

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
                indices: indices,
                normals: normals
              }
          ]
        }
      );
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
      n.setElements(matrix);
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
        yaw:0,
        pitch: 45,
        zoom:10,
        zoomSensitivity: 0.2,
        minPitch: 1,
        maxPitch: 89,
        yawSensitivity: 0.2,
        pitchSensitivity: 0.2,
        // eye:{ x:5, y:0, z:10 },
        // look:{ x:4.9, y:0, z:0 },
        // up:{ x:0, y:0, z:1 },

        nodes:[
          {
            type:"matrix",
            elements: [1, 0, 0, 0,
                       0, 1, 0, 0,
                       0, 0, 1, 0,
                       0, 0, 0, 1],
            id: "world"
          }
        ]
      }
    ]
  });

  // $("#canvas-1").width($("#canvas-1").height());

  $("#canvas-1").width(800);
  $("#canvas-1").height(800);

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
