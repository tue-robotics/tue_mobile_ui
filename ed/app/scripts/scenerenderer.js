(function (root, factory) {
  root.SceneRenderer = factory(root.THREE);
}(this, function (THREE) {

  function SceneRenderer(options) {
    if (!options || !options.canvas || !options.robot) {
      throw new Error('Unspecified canvas or robot');
    }

    this.canvas = options.canvas;
    this.robot = options.robot;

    window.SceneRenderer = this; // TODO: remove this debug statement
  }

  SceneRenderer.prototype.init = function () {
    var contW = this.canvas.offsetWidth;
    var contH = this.canvas.offsetHeight;

     // Camera
    this.camera = new THREE.PerspectiveCamera(75, contW/contH, 0.1, 1000);

    // For interaction via click
    this.raycaster = new THREE.Raycaster();

    this.camera.position.x = 0;
    this.camera.position.y = -3;
    this.camera.position.z = 3;

    this.camera.up = new THREE.Vector3(0, 0, 1);

    // Scene
    var scene = this.scene = new THREE.Scene();

    // Lights
    scene.add(new THREE.AmbientLight(0x404040));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(3, 12, 8);
    scene.add(light);

    function webglAvailable() {
      try {
        var canvas = document.createElement('canvas');
        return !!( window.WebGLRenderingContext && (
          canvas.getContext( 'webgl' ) ||
          canvas.getContext( 'experimental-webgl' ) )
        );
      } catch (e) {
        return false;
      }
    }

    var renderer;
    if (webglAvailable()) {
      renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    } else {
      renderer = new THREE.CanvasRenderer({canvas: this.canvas});
    }
    this.renderer = renderer;

    renderer.setClearColor(0xf0f0f0);

    var cameraControls = new THREE.OrbitControls(this.camera, renderer.domElement);
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.25;
    cameraControls.enableZoom = true;
    cameraControls.rotateSpeed = 0.1;

    window.addEventListener('resize', this.onWindowResize, false);
  };

  SceneRenderer.prototype.setSize = function(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  SceneRenderer.prototype.pickingRay = function(x, y) {
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length === 0) {
      return null;
    }

    // the only objects are from ed
    var obj = intersects[0].object.userData;
    return obj;
  };

  SceneRenderer.prototype.start = function () {
    var self = this;
    var scene = this.scene;
    var robot = this.robot;

    /* START RENDER KINECT */

    var texture = new THREE.Texture();

    var geometry = new THREE.Geometry();
    var width = 640, height = 480;
    var nearClipping = 850/*850*/, farClipping = 4000/*4000*/;
    for ( var i = 0, l = width * height; i < l; i ++ ) {

      var position = new THREE.Vector3();
      position.x = ( i % width );
      position.y = Math.floor( i / width );

      geometry.vertices.push( new THREE.Vector3( position ) );

    }

    var material = new THREE.ShaderMaterial( {

      uniforms: {

        "map": { type: "t", value: 0, texture: texture },
        "width": { type: "f", value: width },
        "height": { type: "f", value: height },
        "nearClipping": { type: "f", value: nearClipping },
        "farClipping": { type: "f", value: farClipping }

      },
      vertexShader: document.getElementById( 'vs' ).textContent,
      fragmentShader: document.getElementById( 'fs' ).textContent,
      depthWrite: false

    } );

    var mesh = new THREE.Points( geometry, material );
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 10;
    scene.add( mesh );

    setInterval(function() {
      robot.head.getImage(640, function(rgb, depth) {
        var texture_image = new Image();
        texture_image.src = depth;

        texture.image = texture_image;
        texture.needsUpdate = true;
      });
    }, 100);

    /* END RENDER KINECT */

    this.robot.ed.watch({
      add: function (obj) {
        //console.log('add', obj);
        var geometry = new THREE.Geometry();

        convertVertices(obj.vertices, geometry.vertices);
        convertFaces(obj.faces, geometry.faces);

        geometry.computeFaceNormals();
        geometry.computeVertexNormals(true);

        var material = new THREE.MeshPhongMaterial({
          color: stringToColor(obj.id),
          shading: THREE.FlatShading,
          shininess: 0,
          emissive: 0x020202
        });

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.fromArray(obj.position);
        mesh.quaternion.fromArray(obj.quaternion);

        scene.add(mesh);

        obj.userdata = mesh;
        mesh.userData = obj;
      },
      update: function (newObj, oldObj) {
        var mesh = newObj.userdata = oldObj.userdata;
        mesh.userData = newObj;
        var geometry = mesh.geometry;

        // position update

        if (newObj.position !== oldObj.position) {
          mesh.position.fromArray(newObj.position);
        }
        if (newObj.quaternion !== oldObj.quaternion) {
          mesh.quaternion.fromArray(newObj.quaternion)
        }

        // geometry update

        var vupdate = newObj.vertices !== oldObj.vertices;
        var fupdate = newObj.faces !== oldObj.faces

        if (vupdate) {
          // console.log('update vertices', newObj, oldObj);
          geometry.vertices = [];
          convertVertices(newObj.vertices, geometry.vertices);
        }
        if (fupdate) {
          // console.log('update faces', newObj, oldObj);
          geometry.faces = [];
          convertFaces(newObj.faces, geometry.faces);
        }

        if (vupdate || fupdate) {
          geometry.computeFaceNormals(); // modifies .faces
          geometry.computeVertexNormals(true); // modifies .normals

          geometry.verticesNeedUpdate = true;
          geometry.elementsNeedUpdate = true;
          geometry.normalsNeedUpdate = true;
        }
      },
      remove: function (obj) {
        console.log('remove', obj);
        var mesh = obj.userdata;
        scene.remove(mesh);
      }
    });

    self._token = null;
    function render() {
      self._token = requestAnimationFrame(render);
      self.renderer.render(scene, self.camera);
    }
    render();
  }

  SceneRenderer.prototype.stop = function() {
    cancelAnimationFrame(this._token);
  };

  /**
   * Private functions
   */

  var COLORS = [0x999999, 0x999966, 0x999933,
                0x996699, 0x996666, 0x996633,
                0x993399, 0x993366, 0x993333,
                0x669999, 0x669966, 0x669933,
                0x666699, 0x666666, 0x666633,
                0x663399, 0x663366, 0x663333,
                0x339999, 0x339966, 0x339933,
                0x336699, 0x336666, 0x336633,
                0x333399, 0x333366, 0x333333];

  function stringToColor(str) {
    for (var i = 0, hash = 5381; i < str.length; hash = ((hash << 5) + hash) + str.charCodeAt(i++)) ;

    if (hash < 0)
      hash = -hash;

    i = hash % COLORS.length;
    return COLORS[i];
  }

  function convertVertices(vertices, threeVertices) {
    for (var i = 0; i < vertices.length; i++) {
      threeVertices.push(
        (new THREE.Vector3()).fromArray(vertices[i])
      );
    }
  }

  function convertFaces(faces, threeFaces) {
    for (var j = 0; j < faces.length; j++) {
      var face = faces[j];
      threeFaces.push(new THREE.Face3(face[0], face[1], face[2]));
    }
  }

  return SceneRenderer;
}));
