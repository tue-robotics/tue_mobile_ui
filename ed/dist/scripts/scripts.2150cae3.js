!function(){function a(a){this.object=a,this.target=new THREE.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-(1/0),this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25;var b,c,d=this,e=1e-6,f=0,g=0,h=1,i=new THREE.Vector3,j=!1;this.getPolarAngle=function(){return c},this.getAzimuthalAngle=function(){return b},this.rotateLeft=function(a){g-=a},this.rotateUp=function(a){f-=a},this.panLeft=function(){var a=new THREE.Vector3;return function(b){var c=this.object.matrix.elements;a.set(c[0],c[1],c[2]),a.multiplyScalar(-b),i.add(a)}}(),this.panUp=function(){var a=new THREE.Vector3;return function(b){var c=this.object.matrix.elements;a.set(c[4],c[5],c[6]),a.multiplyScalar(b),i.add(a)}}(),this.pan=function(a,b,c,e){if(d.object instanceof THREE.PerspectiveCamera){var f=d.object.position,g=f.clone().sub(d.target),h=g.length();h*=Math.tan(d.object.fov/2*Math.PI/180),d.panLeft(2*a*h/e),d.panUp(2*b*h/e)}else d.object instanceof THREE.OrthographicCamera?(d.panLeft(a*(d.object.right-d.object.left)/c),d.panUp(b*(d.object.top-d.object.bottom)/e)):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")},this.dollyIn=function(a){d.object instanceof THREE.PerspectiveCamera?h/=a:d.object instanceof THREE.OrthographicCamera?(d.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom*a)),d.object.updateProjectionMatrix(),j=!0):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")},this.dollyOut=function(a){d.object instanceof THREE.PerspectiveCamera?h*=a:d.object instanceof THREE.OrthographicCamera?(d.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/a)),d.object.updateProjectionMatrix(),j=!0):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")},this.update=function(){var d=new THREE.Vector3,k=(new THREE.Quaternion).setFromUnitVectors(a.up,new THREE.Vector3(0,0,1)),l=k.clone().inverse(),m=new THREE.Vector3,n=new THREE.Quaternion;return function(){var a=this.object.position;d.copy(a).sub(this.target),d.applyQuaternion(k),b=Math.atan2(d.x,d.y),c=Math.atan2(Math.sqrt(d.x*d.x+d.y*d.y),d.z),b+=g,c+=f,b=Math.max(this.minAzimuthAngle,Math.min(this.maxAzimuthAngle,b)),c=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,c)),c=Math.max(e,Math.min(Math.PI-e,c));var o=d.length()*h;return o=Math.max(this.minDistance,Math.min(this.maxDistance,o)),this.target.add(i),d.x=o*Math.sin(c)*Math.sin(b),d.z=o*Math.cos(c),d.y=o*Math.sin(c)*Math.cos(b),d.applyQuaternion(l),a.copy(this.target).add(d),this.object.lookAt(this.target),this.enableDamping===!0?(g*=1-this.dampingFactor,f*=1-this.dampingFactor):(g=0,f=0),h=1,i.set(0,0,0),j||m.distanceToSquared(this.object.position)>e||8*(1-n.dot(this.object.quaternion))>e?(m.copy(this.object.position),n.copy(this.object.quaternion),j=!1,!0):!1}}()}var b,c=500;THREE.OrbitControls=function(d,e){function f(a,b){var c=s.domElement===document?s.domElement.body:s.domElement;r.pan(a,b,c.clientWidth,c.clientHeight)}function g(){return 2*Math.PI/60/60*s.autoRotateSpeed}function h(){return Math.pow(.95,s.zoomSpeed)}function i(a){if(s.enabled!==!1){if(a.preventDefault(),a.button===s.mouseButtons.ORBIT){if(s.enableRotate===!1)return;D=C.ROTATE,t.set(a.clientX,a.clientY)}else if(a.button===s.mouseButtons.ZOOM){if(s.enableZoom===!1)return;D=C.DOLLY,z.set(a.clientX,a.clientY)}else if(a.button===s.mouseButtons.PAN){if(s.enablePan===!1)return;D=C.PAN,w.set(a.clientX,a.clientY)}D!==C.NONE&&(document.addEventListener("mousemove",j,!1),document.addEventListener("mouseup",k,!1),s.dispatchEvent(F))}}function j(a){if(s.enabled!==!1){a.preventDefault();var b=s.domElement===document?s.domElement.body:s.domElement;if(D===C.ROTATE){if(s.enableRotate===!1)return;u.set(a.clientX,a.clientY),v.subVectors(u,t),r.rotateLeft(2*Math.PI*-v.x/b.clientWidth*s.rotateSpeed),r.rotateUp(2*Math.PI*v.y/b.clientHeight*s.rotateSpeed),t.copy(u)}else if(D===C.DOLLY){if(s.enableZoom===!1)return;A.set(a.clientX,a.clientY),B.subVectors(A,z),B.y>0?r.dollyIn(h()):B.y<0&&r.dollyOut(h()),z.copy(A)}else if(D===C.PAN){if(s.enablePan===!1)return;x.set(a.clientX,a.clientY),y.subVectors(x,w),f(y.x,y.y),w.copy(x)}D!==C.NONE&&s.update()}}function k(){s.enabled!==!1&&(document.removeEventListener("mousemove",j,!1),document.removeEventListener("mouseup",k,!1),s.dispatchEvent(G),D=C.NONE)}function l(a){if(s.enabled!==!1&&s.enableZoom!==!1&&D===C.NONE){a.preventDefault(),a.stopPropagation();var b=0;void 0!==a.wheelDelta?b=a.wheelDelta:void 0!==a.detail&&(b=-a.detail),b>0?r.dollyOut(h()):0>b&&r.dollyIn(h()),s.update(),s.dispatchEvent(F),s.dispatchEvent(G)}}function m(a){if(s.enabled!==!1&&s.enableKeys!==!1&&s.enablePan!==!1)switch(a.keyCode){case s.keys.UP:f(0,s.keyPanSpeed),s.update();break;case s.keys.BOTTOM:f(0,-s.keyPanSpeed),s.update();break;case s.keys.LEFT:f(s.keyPanSpeed,0),s.update();break;case s.keys.RIGHT:f(-s.keyPanSpeed,0),s.update()}}function n(a){var d=new CustomEvent("onlongpress",{detail:a.touches[0]});if(b=setTimeout(function(){window.dispatchEvent(d)},c),s.enabled!==!1){switch(a.touches.length){case 1:if(s.enableRotate===!1)return;D=C.TOUCH_ROTATE,t.set(a.touches[0].pageX,a.touches[0].pageY);break;case 2:if(s.enableZoom===!1)return;D=C.TOUCH_DOLLY;var e=a.touches[0].pageX-a.touches[1].pageX,f=a.touches[0].pageY-a.touches[1].pageY,g=Math.sqrt(e*e+f*f);z.set(0,g);break;case 3:if(s.enablePan===!1)return;D=C.TOUCH_PAN,w.set(a.touches[0].pageX,a.touches[0].pageY);break;default:D=C.NONE}D!==C.NONE&&s.dispatchEvent(F)}}function o(a){if(b&&clearTimeout(b),s.enabled!==!1){a.preventDefault(),a.stopPropagation();var c=s.domElement===document?s.domElement.body:s.domElement;switch(a.touches.length){case 1:if(s.enableRotate===!1)return;if(D!==C.TOUCH_ROTATE)return;u.set(a.touches[0].pageX,a.touches[0].pageY),v.subVectors(u,t),r.rotateLeft(2*Math.PI*v.x/c.clientWidth*s.rotateSpeed),r.rotateUp(2*Math.PI*v.y/c.clientHeight*s.rotateSpeed),t.copy(u),s.update();break;case 2:if(s.enableZoom===!1)return;if(D!==C.TOUCH_DOLLY)return;var d=a.touches[0].pageX-a.touches[1].pageX,e=a.touches[0].pageY-a.touches[1].pageY,g=Math.sqrt(d*d+e*e);A.set(0,g),B.subVectors(A,z),B.y>0?r.dollyOut(h()):B.y<0&&r.dollyIn(h()),z.copy(A),s.update();break;case 3:if(s.enablePan===!1)return;if(D!==C.TOUCH_PAN)return;x.set(a.touches[0].pageX,a.touches[0].pageY),y.subVectors(x,w),f(y.x,y.y),w.copy(x),s.update();break;default:D=C.NONE}}}function p(){b&&clearTimeout(b),s.enabled!==!1&&(s.dispatchEvent(G),D=C.NONE)}function q(a){a.preventDefault()}var r=new a(d);this.domElement=void 0!==e?e:document,Object.defineProperty(this,"constraint",{get:function(){return r}}),this.getPolarAngle=function(){return r.getPolarAngle()},this.getAzimuthalAngle=function(){return r.getAzimuthalAngle()},this.enabled=!0,this.center=this.target,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT};var s=this,t=new THREE.Vector2,u=new THREE.Vector2,v=new THREE.Vector2,w=new THREE.Vector2,x=new THREE.Vector2,y=new THREE.Vector2,z=new THREE.Vector2,A=new THREE.Vector2,B=new THREE.Vector2,C={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},D=C.NONE;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom;var E={type:"change"},F={type:"start"},G={type:"end"};this.update=function(){this.autoRotate&&D===C.NONE&&r.rotateLeft(g()),r.update()===!0&&this.dispatchEvent(E)},this.reset=function(){D=C.NONE,this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(E),this.update()},this.dispose=function(){this.domElement.removeEventListener("contextmenu",q,!1),this.domElement.removeEventListener("mousedown",i,!1),this.domElement.removeEventListener("mousewheel",l,!1),this.domElement.removeEventListener("DOMMouseScroll",l,!1),this.domElement.removeEventListener("touchstart",n,!1),this.domElement.removeEventListener("touchend",p,!1),this.domElement.removeEventListener("touchmove",o,!1),document.removeEventListener("mousemove",j,!1),document.removeEventListener("mouseup",k,!1),window.removeEventListener("keydown",m,!1)},this.domElement.addEventListener("contextmenu",q,!1),this.domElement.addEventListener("mousedown",i,!1),this.domElement.addEventListener("mousewheel",l,!1),this.domElement.addEventListener("DOMMouseScroll",l,!1),this.domElement.addEventListener("touchstart",n,!1),this.domElement.addEventListener("touchend",p,!1),this.domElement.addEventListener("touchmove",o,!1),window.addEventListener("keydown",m,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,Object.defineProperties(THREE.OrbitControls.prototype,{object:{get:function(){return this.constraint.object}},target:{get:function(){return this.constraint.target},set:function(a){console.warn("THREE.OrbitControls: target is now immutable. Use target.set() instead."),this.constraint.target.copy(a)}},minDistance:{get:function(){return this.constraint.minDistance},set:function(a){this.constraint.minDistance=a}},maxDistance:{get:function(){return this.constraint.maxDistance},set:function(a){this.constraint.maxDistance=a}},minZoom:{get:function(){return this.constraint.minZoom},set:function(a){this.constraint.minZoom=a}},maxZoom:{get:function(){return this.constraint.maxZoom},set:function(a){this.constraint.maxZoom=a}},minPolarAngle:{get:function(){return this.constraint.minPolarAngle},set:function(a){this.constraint.minPolarAngle=a}},maxPolarAngle:{get:function(){return this.constraint.maxPolarAngle},set:function(a){this.constraint.maxPolarAngle=a}},minAzimuthAngle:{get:function(){return this.constraint.minAzimuthAngle},set:function(a){this.constraint.minAzimuthAngle=a}},maxAzimuthAngle:{get:function(){return this.constraint.maxAzimuthAngle},set:function(a){this.constraint.maxAzimuthAngle=a}},enableDamping:{get:function(){return this.constraint.enableDamping},set:function(a){this.constraint.enableDamping=a}},dampingFactor:{get:function(){return this.constraint.dampingFactor},set:function(a){this.constraint.dampingFactor=a}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(a){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!a}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(a){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!a}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(a){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!a}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(a){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!a}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.constraint.enableDamping},set:function(a){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.constraint.enableDamping=!a}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.constraint.dampingFactor},set:function(a){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.constraint.dampingFactor=a}}})}(),function(a,b){a.SceneRenderer=b(a.THREE)}(this,function(a){function b(a){if(!a||!a.canvas||!a.robot)throw new Error("Unspecified canvas or robot");this.canvas=a.canvas,this.robot=a.robot,window.SceneRenderer=this}function c(a){for(var b=0,c=5381;b<a.length;c=(c<<5)+c+a.charCodeAt(b++));return 0>c&&(c=-c),b=c%f.length,f[b]}function d(b,c){for(var d=0;d<b.length;d++)c.push((new a.Vector3).fromArray(b[d]))}function e(b,c){for(var d=0;d<b.length;d++){var e=b[d];c.push(new a.Face3(e[0],e[1],e[2]))}}b.prototype.init=function(){function b(){try{var a=document.createElement("canvas");return!(!window.WebGLRenderingContext||!a.getContext("webgl")&&!a.getContext("experimental-webgl"))}catch(b){return!1}}var c=this.canvas.offsetWidth,d=this.canvas.offsetHeight;this.camera=new a.PerspectiveCamera(75,c/d,.1,1e3),this.raycaster=new a.Raycaster,this.camera.position.x=0,this.camera.position.y=-3,this.camera.position.z=3,this.camera.up=new a.Vector3(0,0,1);var e=this.scene=new a.Scene;e.add(new a.AmbientLight(4210752));var f=new a.DirectionalLight(16777215);f.position.set(3,12,8),e.add(f);var g;g=b()?new a.WebGLRenderer({canvas:this.canvas,antialias:!0}):new a.CanvasRenderer({canvas:this.canvas}),this.renderer=g,g.setClearColor(15790320);var h=new a.OrbitControls(this.camera,g.domElement);h.enableDamping=!0,h.dampingFactor=.25,h.enableZoom=!0,h.rotateSpeed=.1,window.addEventListener("resize",this.onWindowResize,!1)},b.prototype.setSize=function(a,b){this.camera.aspect=a/b,this.camera.updateProjectionMatrix(),this.renderer.setSize(a,b)},b.prototype.pickingRay=function(b,c){this.raycaster.setFromCamera(new a.Vector2(b,c),this.camera);var d=this.raycaster.intersectObjects(this.scene.children);if(0===d.length)return null;var e=d[0].object.userData;return e},b.prototype.start=function(){function b(){f._token=requestAnimationFrame(b),f.renderer.render(g,f.camera)}for(var f=this,g=this.scene,h=this.robot,i=new a.Texture,j=new a.Geometry,k=640,l=480,m=850,n=4e3,o=0,p=k*l;p>o;o++){var q=new a.Vector3;q.x=o%k,q.y=Math.floor(o/k),j.vertices.push(new a.Vector3(q))}var r=new a.ShaderMaterial({uniforms:{map:{type:"t",value:0,texture:i},width:{type:"f",value:k},height:{type:"f",value:l},nearClipping:{type:"f",value:m},farClipping:{type:"f",value:n}},vertexShader:document.getElementById("vs").textContent,fragmentShader:document.getElementById("fs").textContent,depthWrite:!1}),s=new a.Points(j,r);s.position.x=0,s.position.y=0,s.position.z=10,g.add(s),setInterval(function(){h.head.getImage(640,function(a,b){var c=new Image;c.src=b,i.image=c,i.needsUpdate=!0})},100),this.robot.ed.watch({add:function(b){var f=new a.Geometry;d(b.vertices,f.vertices),e(b.faces,f.faces),f.computeFaceNormals(),f.computeVertexNormals(!0);var h=new a.MeshPhongMaterial({color:c(b.id),shading:a.FlatShading,shininess:0,emissive:131586}),i=new a.Mesh(f,h);i.position.fromArray(b.position),i.quaternion.fromArray(b.quaternion),g.add(i),b.userdata=i,i.userData=b},update:function(a,b){var c=a.userdata=b.userdata;c.userData=a;var f=c.geometry;a.position!==b.position&&c.position.fromArray(a.position),a.quaternion!==b.quaternion&&c.quaternion.fromArray(a.quaternion);var g=a.vertices!==b.vertices,h=a.faces!==b.faces;g&&(f.vertices=[],d(a.vertices,f.vertices)),h&&(f.faces=[],e(a.faces,f.faces)),(g||h)&&(f.computeFaceNormals(),f.computeVertexNormals(!0),f.verticesNeedUpdate=!0,f.elementsNeedUpdate=!0,f.normalsNeedUpdate=!0)},remove:function(a){console.log("remove",a);var b=a.userdata;g.remove(b)}}),f._token=null,b()},b.prototype.stop=function(){cancelAnimationFrame(this._token)};var f=[10066329,10066278,10066227,10053273,10053222,10053171,10040217,10040166,10040115,6723993,6723942,6723891,6710937,6710886,6710835,6697881,6697830,6697779,3381657,3381606,3381555,3368601,3368550,3368499,3355545,3355494,3355443];return b}),angular.module("EdGuiApp",["angularCircularNavigation","ui.bootstrap-slider"]),angular.module("EdGuiApp").run(function(){FastClick.attach(document.body)}),angular.module("EdGuiApp").provider("robot",function(){this.setUrl=function(a){this.url=a},this.$get=function(){var a=window.r=new API.Robot;return a.connect(),a}}),angular.module("EdGuiApp").directive("ngWebgl",["robot",function(a){return{restrict:"E",template:"<canvas></canvas>",scope:{entitySelection:"&onEntitySelection"},controllerAs:"vm",controller:function(){},link:function(b,c){function d(a){console.log(a);var c=a.clientX/f.innerWidth()*2-1,d=2*-(a.clientY/f.innerHeight())+1,e=h.pickingRay(c,d);e&&b.entitySelection({entity:e,event:a})}function e(){h.setSize(g.innerWidth(),g.innerHeight())}window.addEventListener("onlongpress",function(a){d(a.detail)},!1),c.on("touchstart",function(a){a.preventDefault(),b.entitySelection({entity:null,event:a})}),c.on("$destroy",function(){console.log("ngWebgl: element is destroyed")}),b.$on("$destroy",function(){console.log("ngWebgl: scope is destroyed")});var f=c.children(),g=c.parent(),h=new SceneRenderer({canvas:f.get(0),robot:a});h.init(),e(),window.addEventListener("resize",e,!1),h.start(),c.on("dblclick",function(a){a.preventDefault(),d(a)}),c.on("mousedown",function(a){a.preventDefault(),b.entitySelection({entity:null,event:a})})}}}]),angular.module("EdGuiApp").directive("ngTeleopCanvas",function(){return{restrict:"E",template:"<canvas></canvas>",scope:{percentageChanged:"&onPercentageChanged"},controllerAs:"vm",controller:function(){},link:function(a,b){function c(){j.width=l.width(),j.height=l.width()}function d(a,b){m={x:a,y:b},o=!0,g()}function e(a,b){m&&(n={x:a,y:b},g())}function f(){m=!1,n=!1,o=!1,g(),a.percentageChanged({px:0,py:0})}function g(){h(),i(m,n)}function h(){k.fillStyle="#4D4D4D",k.clearRect(0,0,j.width,j.height)}function i(a,b){var c,d;a&&(k.save(),k.translate(a.x,a.y),c=60,d=k.createRadialGradient(0,0,0,0,0,2*c),d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.4,"rgba(0,0,0,0)"),d.addColorStop(.45,"rgba(0,0,0,1)"),d.addColorStop(.55,"rgba(0,0,0,1)"),d.addColorStop(.6,"rgba(0,0,0,0)"),d.addColorStop(1,"rgba(0,0,0,0)"),k.fillStyle=d,k.fillRect(-2*c,-2*c,4*c,4*c),k.restore()),b&&(k.save(),k.translate(b.x,b.y),c=45,d=k.createRadialGradient(0,0,0,0,0,c),d.addColorStop(0,"rgba(0,0,0,1)"),d.addColorStop(.9,"rgba(0,0,0,1)"),d.addColorStop(1,"rgba(0,0,0,0)"),k.fillStyle=d,k.fillRect(-c,-c,2*c,2*c),k.restore())}b.on("$destroy",function(){console.log("ngTeleopCanvas: element is destroyed")}),a.$on("$destroy",function(){console.log("ngTeleopCanvas: scope is destroyed")});var j=b.children()[0],k=j.getContext("2d"),l=b.parent();c(),window.addEventListener("resize",c,!1);var m,n,o=!1;setInterval(function(){if(o){if(!n||!m)return;var b=n.x-m.x,c=n.y-m.y,d=-c/j.height,e=b/j.width;a.percentageChanged({px:e,py:d})}},100),b.on("mousedown",function(a){d(a.offsetX,a.offsetY)}),b.on("touchstart",function(a){d(a.originalEvent.touches[0].offsetX,a.originalEvent.touches[0].offsetY)}),b.on("mousemove",function(a){e(a.offsetX,a.offsetY)}),b.on("touchmove",function(a){e(a.originalEvent.touches[0].offsetX,a.originalEvent.touches[0].offsetY)}),b.on("mouseup",function(){f()}),b.on("mouseleave",function(){f()}),b.on("touchend",function(){f()})}}}),angular.module("EdGuiApp").controller("MainCtrl",["$scope","$interval","robot",function(a,b,c){function d(){setTimeout(function(){c.ed.query(d)},100)}a.entitySelection=function(b){a.selectedEntityEvent=b,a.$digest()},c.ed.query(d)}]),angular.module("EdGuiApp").controller("ConnectionCtrl",["$scope","robot",function(a,b){a.connection=b.status,b.on("status",function(b){a.$apply(function(){a.connection=b})})}]),angular.module("EdGuiApp").controller("CircularmenuCtrl",["$scope","robot",function(a,b){a.actionList=[{name:"inspect",icon:"camera",color:"red"},{name:"pick-up",icon:"hand-grab-o",color:"blue"},{name:"navigate-to",icon:"arrows-alt",color:"green"},{name:"place",icon:"hand-lizard-o",color:"red"}],a.options={items:[]},a.$watch("selectedEntityEvent",function(c){console.log(c);var d=document.getElementById("action-menu");return c.entity?(d.style.left=c.event.pageX+"px",d.style.top=c.event.pageY+"px",d.style.opacity=1,d.style.zIndex=1,a.options.content=c.entity.id,a.options.items=a.actionList.map(function(d){return{cssClass:"fa fa-"+d.icon,background:d.color,onclick:function(e){b.actionServer.doAction(d.name,c.entity.id),a.entitySelection({event:e,entity:null})}}}),void(a.options.isOpen=!0)):(a.options.isOpen=!1,d.style.opacity=0,void(d.style.zIndex=-1))})}]),angular.module("EdGuiApp").controller("SidebarCtrl",["$scope","$timeout","robot",function(){}]),angular.module("EdGuiApp").controller("TeleopCtrl",["$scope","$timeout","robot",function(a,b,c){function d(){b(function(){c.head.getImage(230,function(b){a.kinect_image=b,d()})},1e3)}d(),a.teleopBase=function(a){c.base.sendTwist(a.py,0,-a.px)},a.teleopHead=function(a){if(0==a.px&&0==a.py)c.head.cancelGoal();else{var b=1.5;c.head.sendPanTiltGoal(-b*a.px,-b*a.py)}}}]),angular.module("EdGuiApp").run(["$templateCache",function(a){"use strict";a.put("views/main.html",'<div class="container-fluid"> <div class="row"> <div class="col-xs-9 col-sm-9 col-md-9 main" ng-include="\'views/scene.html\'"> </div> <div ng-controller="CircularmenuCtrl"> <circular id="action-menu" options="options"> </circular> </div> <div id="sidebar" class="col-xs-3 col-sm-3 col-md-3 sidebar" ng-controller="SidebarCtrl"> <!-- Nav tabs --> <div id="main-tabs"> <ul class="nav nav-tabs" role="tablist"> <li class="active"> <a href="#teleop" role="tab" data-toggle="tab"> <icon class="fa fa-arrows"></icon> Teleop </a> </li> <li><a href="#editor" role="tab" data-toggle="tab"> <i class="fa fa-building"></i> Editor </a> </li> </ul> </div> <div class="tab-content"> <div class="tab-pane active" id="teleop" ng-controller="TeleopCtrl"> <div ng-include="\'views/tabs/teleop.html\'" class="tab"> </div> </div> <div class="tab-pane" id="editor"> <div ng-include="\'views/tabs/editor.html\'" class="tab"> </div> </div> </div> </div> </div> </div>'),a.put("views/scene.html",'<script id="vs" type="x-shader/x-vertex">uniform sampler2D map;\n\n  uniform float width;\n  uniform float height;\n  uniform float nearClipping, farClipping;\n\n  varying vec2 vUv;\n\n  const float XtoZ = 1.11146; // tan( 1.0144686 / 2.0 ) * 2.0;\n  const float YtoZ = 0.83359; // tan( 0.7898090 / 2.0 ) * 2.0;\n\n  void main() {\n\n    vUv = vec2( position.x / width, 1.0 - ( position.y / height ) );\n\n    vec4 color = texture2D( map, vUv );\n    float depth = ( color.r + color.g + color.b ) / 3.0;\n\n    // Projection code by @kcmic\n\n    float z = ( 1.0 - depth ) * (farClipping - nearClipping) + nearClipping;\n\n    vec4 pos = vec4(\n      ( position.x / width - 0.5 ) * z * XtoZ,\n      ( position.y / height - 0.5 ) * z * YtoZ,\n      - z + 1000.0,\n      1.0);\n\n    gl_PointSize = 2.0;\n    gl_Position = projectionMatrix * modelViewMatrix * pos;\n\n  }</script> <script id="fs" type="x-shader/x-fragment">uniform sampler2D map;\n\n  varying vec2 vUv;\n\n  void main() {\n\n    vec4 color = texture2D( map, vUv );\n    gl_FragColor = vec4( color.r, color.g, color.b, smoothstep( 8000.0, -8000.0, gl_FragCoord.z / gl_FragCoord.w ) );\n\n  }</script> <ng-webgl on-entity-selection="entitySelection({entity: entity, event: event})">'),a.put("views/tabs/editor.html",'<div class="panel panel-default"> <div class="panel-heading"> Editor </div> <div class="panel-body"> Editor body </div> </div>'),a.put("views/tabs/teleop.html",'<div class="panel panel-default" id="kinect-view"> <div class="panel-heading"> Robot\'s view </div> <div class="panel-body"> <img src="{{kinect_image}}" alt="..." style="width: 100%"> </div> </div> <div class="panel panel-default"> <div class="panel-heading"> Robot Teleop </div> <div class="panel-body nav nav-tabs"> <div> <ul class="nav nav-tabs"> <li class="active"> <a href="#teleop-base" role="tab" data-toggle="tab"> <icon class="fa fa-arrows"></icon> Base </a> </li> <li> <a href="#teleop-head" role="tab" data-toggle="tab"> <icon class="fa fa-smile-o"></icon> Head </a> </li> <li> <a href="#teleop-body" role="tab" data-toggle="tab"> <icon class="fa fa-male"></icon> Body </a> </li> <li> <a href="#teleop-speech" role="tab" data-toggle="tab"> <icon class="fa fa-volume-up"></icon> Speech </a> </li> <li> <a href="#teleop-ears" role="tab" data-toggle="tab"> <icon class="fa fa-microphone"></icon> Ears </a> </li> </ul> </div> <div class="tab-content"> <div class="tab-pane active" id="teleop-base" ng-include="\'views/tabs/teleop_tabs/base.html\'"> </div> <div class="tab-pane" id="teleop-head" ng-include="\'views/tabs/teleop_tabs/head.html\'"> </div> <div class="tab-pane" id="teleop-body" ng-include="\'views/tabs/teleop_tabs/body.html\'"> </div> <div class="tab-pane" id="teleop-speech" ng-include="\'views/tabs/teleop_tabs/speech.html\'"> </div> <div class="tab-pane" id="teleop-ears" ng-include="\'views/tabs/teleop_tabs/ears.html\'"> </div> </div> </div> </div>'),a.put("views/tabs/teleop_tabs/base.html",'<ng-teleop-canvas on-percentage-changed="teleopBase({px: px, py: py})">'),a.put("views/tabs/teleop_tabs/body.html",'<h5>Body pose board</h5> <div> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> </div> <hr> <h5>Specific joint set-points</h5> <div class="form-group"> <select class="form-control" id="joint-name"> <option>shoulder_yaw_joint</option> <option>shoulder_pitch_joint</option> <option>shoulder_roll_joint</option> <option>elbow_pitch_joint</option> <option>elbow_roll_joint</option> <option>wrist_pitch_joint</option> <option>wrist_yaw_joint</option> <option>torso_joint</option> </select> <br> <slider ng-model="sliders.sliderValue" min="testOptions.min" step="testOptions.step" max="testOptions.max" value="testOptions.value"></slider> <br> <button class="btn btn-primary">Go!</button> </div>'),a.put("views/tabs/teleop_tabs/ears.html",'<h5>Enter the text the robot should hear</h5> <form role="form"> <div class="form-group"> <input type="text" class="form-control continue" placeholder="Enter the text and press <enter> ..."> </div> </form> <!-- <ul id="hear-log" class="list-group"></ul> -->'),a.put("views/tabs/teleop_tabs/head.html",'<ng-teleop-canvas on-percentage-changed="teleopHead({px: px, py: py})">'),a.put("views/tabs/teleop_tabs/speech.html",'<h5>Sound board</h5> <div> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> <button type="button" class="btn btn-primary">Apple</button> <button type="button" class="btn btn-primary">Samsung</button> <button type="button" class="btn btn-primary">Sony</button> </div> <hr> <h5>Text to speech</h5> <div class="form-group"> <input type="text" class="form-control continue" placeholder="Enter the text and press <enter> ..."> </div> <!-- <ul id="hear-log" class="list-group"></ul> -->')}]);