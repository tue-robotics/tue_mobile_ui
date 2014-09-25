// (function() {

// Demo of the "cameras/orbit" node type, which orbits the eye about a point of interest

// Point SceneJS to the bundled plugins
SceneJS.setConfigs({
  pluginPath:"../utils/bower_components/scenejs/plugins"
});

var scene;
var clientQueryMeshes;

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

function handleMeshQueryResult(entity_ids, msg) {
  // console.log(entity_ids)

  for (var i = 0; i < msg.meshes.length; i++) {
    var id = entity_ids[i]
    var n = scene.getNode(id);

    // Remove the mesh ...
    n.removeNode(id + "-mesh");

    // ... and replace it by the received one
    n.addNode(
        {
          type:"material",
          color:{ r:0.0, g:0.3, b:1.0 },
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

    console.log(matrix);

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
      handleMeshQueryResult(q_mesh_entity_ids, result);
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
        type:"cameras/orbit",
        yaw:40,
        pitch:-20,
        zoom:10,
        zoomSensitivity:10.0,
        eye:{ x:0, y:0, z:10 },
        look:{ x:0, y:0, z:0 },

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
