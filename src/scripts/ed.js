// (function() {

// Demo of the "cameras/orbit" node type, which orbits the eye about a point of interest

// Point SceneJS to the bundled plugins
SceneJS.setConfigs({
  pluginPath:"../utils/bower_components/scenejs/plugins"
});

var scene;
var clientQueryMeshes;
var entity_poses = {}

var scenejs_canvas_width, scenejs_canvas_height;

var COLORS = [ [ 0.6, 0.6, 0.6],
               [ 0.6, 0.6, 0.4],
               [ 0.6, 0.6, 0.2],
               [ 0.6, 0.4, 0.6],
               [ 0.6, 0.4, 0.4],
               [ 0.6, 0.4, 0.2],
               [ 0.6, 0.2, 0.6],
               [ 0.6, 0.2, 0.4],
               [ 0.6, 0.2, 0.2],
               [ 0.4, 0.6, 0.6],
               [ 0.4, 0.6, 0.4],
               [ 0.4, 0.6, 0.2],
               [ 0.4, 0.4, 0.6],
               [ 0.4, 0.4, 0.4],
               [ 0.4, 0.4, 0.2],
               [ 0.4, 0.2, 0.6],
               [ 0.4, 0.2, 0.4],
               [ 0.4, 0.2, 0.2],
               [ 0.2, 0.6, 0.6],
               [ 0.2, 0.6, 0.4],
               [ 0.2, 0.6, 0.2],
               [ 0.2, 0.4, 0.6],
               [ 0.2, 0.4, 0.4],
               [ 0.2, 0.4, 0.2],
               [ 0.2, 0.2, 0.6],
               [ 0.2, 0.2, 0.4],
               [ 0.2, 0.2, 0.2]
             ];

// ----------------------------------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------------------------------

function handleMeshQueryResult(msg) {

  for (var i = 0; i < msg.entity_ids.length; i++) {
    var id = msg.entity_ids[i]

    // Generate color from hash function
    var iColor = djb2(id) % COLORS.length;
    var r = COLORS[iColor][0];
    var g = COLORS[iColor][1];
    var b = COLORS[iColor][2];

    console.log(id + ": color = " + [r, g, b]);

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

// ----------------------------------------------------------------------------------------------------

function edUpdate(msg) {

  // list of entity ids of which we must query the mesh
  var q_mesh_entity_ids = [];

  // Iterate over all world model entities
  for (var i_entity = 0; i_entity < msg.entities.length; i_entity++) {
    var e = msg.entities[i_entity];

    // Create 4x4 matrix from object pose (transposed compared to OpenGL)
    matrix = SceneJS_math_newMat4FromQuaternion(
      [ e.pose.orientation.x,
        e.pose.orientation.y,
        e.pose.orientation.z,
        e.pose.orientation.w]);

    matrix[12] = e.pose.position.x;
    matrix[13] = e.pose.position.y;
    matrix[14] = e.pose.position.z;

    entity_poses[e.id] = matrix;

    // Get the scenejs node corresponding to the entity
    var n = scene.getNode(e.id);

    if (n) {
      // If it exists, update the pose matrix
      n.parent.setElements(matrix);
    } else {
      // If it does not exist, construct a node and add it to the world node
      scene.getNode("world").addNode(
        {
          type: "matrix",
          elements: matrix
        }).addNode(
        {
          type: "name",
          name: e.id,
          id: e.id,
        }).addNode(
        {
          // Default entity visualization is a red box
          type:"material",
          color:{ r:1.0, g:0.0, b:0.0 },
          id: e.id + "-mesh"
        }).addNode(
        {
          type: "prims/box",
          xSize: 0.1,
          ySize: 0.1,
          zSize: 0.1
        });

      q_mesh_entity_ids.push(e.id);
    }

    if (e.polygon.xs.length > 0) {

      var polySize = e.polygon.xs.length;

      // - - - - - Construct mesh from polygon - - - - -

      // #Vertices = top polygon + bottom polygon + mid section
      var i_bottom = polySize * 3;
      var i_middle = i_bottom + polySize * 3;

      var vertices = new Float32Array(polySize * 3 + polySize * 3 + polySize * 3 * 4);
      var normals = new Float32Array(vertices.length);

      var k = 0;

      // - - - - - - - - - - - Vertices and Normals - - - - - - - - - - - - -

      // Top section
      for(var i = 0; i < polySize; i++) {
        vertices[k]     = e.polygon.xs[i];
        vertices[k + 1] = e.polygon.ys[i];
        vertices[k + 2] = e.polygon.z_max;
        normals[k]     = 0;
        normals[k + 1] = 0;
        normals[k + 2] = 1;
        k += 3;
      }

      // Bottom section
      for(var i = 0; i < polySize; i++) {
        vertices[k]     = e.polygon.xs[i];
        vertices[k + 1] = e.polygon.ys[i];
        vertices[k + 2] = e.polygon.z_min;
        normals[k]     = 0;
        normals[k + 1] = 0;
        normals[k + 2] = -1;
        k += 3;
      }

      // Middle section
      for(var i = 0; i < polySize; i++) {
        var i2 = (i + 1) % polySize;

        // Normal calculation
        var dx = e.polygon.xs[i2] - e.polygon.xs[i];
        var dy = e.polygon.ys[i2] - e.polygon.ys[i];
        var normal = SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3([dx, dy, 0], [0, 0, 1]));

        // Set normals (4 vertices, so 4 times)
        for(var j = 0; j < 12; j += 3) {
          normals[k + j]     = normal[0];
          normals[k + j + 1] = normal[1];
          normals[k + j + 2] = normal[2];
        }

        // Triangle 1
        vertices[k++] = e.polygon.xs[i];
        vertices[k++] = e.polygon.ys[i];
        vertices[k++] = e.polygon.z_min;
        vertices[k++] = e.polygon.xs[i];
        vertices[k++] = e.polygon.ys[i];
        vertices[k++] = e.polygon.z_max;

        // Triangle 1
        vertices[k++] = e.polygon.xs[i2];
        vertices[k++] = e.polygon.ys[i2];
        vertices[k++] = e.polygon.z_min;
        vertices[k++] = e.polygon.xs[i2];
        vertices[k++] = e.polygon.ys[i2];
        vertices[k++] = e.polygon.z_max;
      }

      // - - - - - - - - - - - Triangles - - - - - - - - - - - - -

      var indices = new Uint16Array((polySize - 2) * 3 + (polySize - 2) * 3 + polySize * 2 * 3);

      var l = 0;
      // Top section
      for(var i = 0; i < polySize - 2; i++) {
        indices[l++] = 0;
        indices[l++] = i + 1;
        indices[l++] = i + 2;
      }

      // Bottom section
      for(var i = 0; i < polySize - 2; i++) {
        indices[l++] = polySize;
        indices[l++] = polySize + i + 1;
        indices[l++] = polySize + i + 2;
      }

      // Middle section
      for(var i = 0; i < 4 * polySize; i += 4) {
        // Triangle 1
        indices[l++] = (2 * polySize) + i;
        indices[l++] = (2 * polySize) + i + 1;
        indices[l++] = (2 * polySize) + i + 3;

        // Triangle 2
        indices[l++] = (2 * polySize) + i + 3;
        indices[l++] = (2 * polySize) + i + 2;
        indices[l++] = (2 * polySize) + i;
      }

      // Remove the mesh ...
      var n = scene.getNode(e.id);

      n.removeNode(e.id + "-mesh");

      // ... and replace it by the received one
      n.addNode(
          {
            type:"material",
            color:{ r:0.0, g:0.6, b:0.0 },
            id: e.id + "-mesh",

            nodes:[
                {
                  type: "geometry",
                  primitive: "triangles",
                  positions: vertices,
                  indices: indices,
                  normals: normals
                }
            ]
          }
        );
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

// ----------------------------------------------------------------------------------------------------

function onEntityClick(hit)
{
  var entityId = hit.name;
  console.log("Entity picked: " + entityId);

  // nEntity = scene.getNode(entityId);
  // console.log(entity_poses[entityId]);

  nSelectionBox = scene.getNode("selection-box");

  matrix = entity_poses[entityId];
  matrix[14] = 2;

  nSelectionBox.setElements(matrix);

}

// ----------------------------------------------------------------------------------------------------

$(document).ready(function () {

  // - - - - - Construct scene - - - - - - - - - - - - - - - - - - - - -

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

  scene.getNode("world").addNode(
    {
      type: "matrix",
      id: "selection-box",
      elements: [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 2, 1]
    }).addNode(
    {
      type:"material",
      color:{ r:0.0, g:1.0, b:0.0 },
    }).addNode(
    {
      type: "prims/box",
      xSize: 0.01,
      ySize: 0.01,
      zSize: 2
    });

  // - - - - - Set object pick methods - - - - - - - - - - - - - - - - - - - - -

  scene.on("pick", function (hit) { onEntityClick(hit) } );

  // Called when nothing picked
  // scene.on("nopick", function (hit) { console.log("Nothing picked"); });

  // - - - - - Set canvas size - - - - - - - - - - - - - - - - - - - - -

  // TODO: should be done from html

  // Get the canvas width and height based on which SceneJS draws the scene
  scenejs_canvas_width = $("#canvas-1").width();
  scenejs_canvas_height = $("#canvas-1").height();

  $("#canvas-1").width(800);
  $("#canvas-1").height(800);

  // - - - - - Set ROS connections - - - - - - - - - - - - - - - - - - - - -

  // Connecting to ROS.
  var rosUrl = 'ws://' + window.location.hostname + ':9090';
  ros = new ROSLIB.Ros({
    url : rosUrl
  });

  console.log("ROS: Connecting to " + rosUrl);

  // Construct entity listener
  var entityListener = new ROSLIB.Topic({
    ros : ros,
    name : '/ed/gui/entities',
    messageType : 'ed_gui_server/EntityInfos'
  });
  entityListener.subscribe(function(message) {
    edUpdate(message);
  });

  // Construct client for requesting meshes
  clientQueryMeshes = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/query_meshes',
      serviceType : 'ed_gui_server/QueryMeshes'
  });

});

//})();
