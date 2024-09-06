(Inspired by Bruno Simon's 3JS template)

At its most basic, we have:
- Scene
- Objects
- Camera
- Renderer
---

```javascript
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```

**Scene**:
```javascript
const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');
```
(Selecting canvas element with class="webgl")

For our object, we'll need a mesh consisting of a *geometry* and a *material*. e.g. red default cube:
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```
(In this case, the argument passed to the basic material constructor is itself an object {} containing all our options. See 3JS docs for details)

**Aspect Ratio** and **Camera**:
```javascript
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

// FOV, aspect, (clipping): near, far:
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);
```

**Orbit Controls:**
```javascript
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
```
(Orbit controls are optional, but pretty standard for most 3JS demos.)

**Renderer**:
```javascript
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```
If the pixel ratio of our device is 1, we set it at 1. Otherwise, capped at 2. Some high-DPI retina-displays might go as high as 3 or 4, but that will hinder performance.
The canvas for our WebGLRenderer is the reference we created above.

**Resize Event Listener:**
```javascript
window.addEventListener('resize', () => {

// Update sizes
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

// Update camera
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();

// Update renderer
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```
Important to update camera projection matrix when properties of camera that affect projection (i.e. aspect ratio) change.

**Animation**:
```javascript
const clock = new THREE.Clock();
const tick = () => {

// For animation (e.g. position.x * elapsedTime):
const elapsedTime = clock.getElapsedTime();

// Update controls
controls.update();

// Render frame
renderer.render(scene, camera);

// Call tick on next frame
window.requestAnimationFrame(tick);
}

// Start
tick();
```
---

# Debug GUI:

**Types of parameters:**

**Range (with optional parameters):**
```js
gui.add(mesh.position, 'y').min(-2).max(2).step(0.1).name('elevation');
```
**Can modify custom properties using an object:**
```js
const customObj = {
	someVar: 3
};
gui.add(customObj, 'someVar');
```

**Checkbox (boolean property):**
```js
gui.add(mesh, 'visible');
```
**Color (one approach):**
Use a debug object to store the color value before it's modified by 3JS shader/render code:
```js
const debugObj = {};
debugObj.color = '#ff0000';
const material = new THREE.MeshBasicMaterial({ color: debugObj.color });

gui.addColor(debugObj, 'color').onChange(() =>
{
	material.color.set(debugObj.color);
});
```
**Functions:**
```js
debugObj.someFunction = () =>
{
	console.log('function triggered');
};

gui.add(debugObj, 'someFunction');
```
**Folders:**
```js
const geomTweaks = gui.addFolder('Geometry Tweaks');
// Close by default:
geomTweaks.close();

geomTweaks.add(mesh.position, 'y');
...
```
**GUI Setup:**
```js
const gui = new GUI({
	width: 300,
	title: 'A Debug UI',
	closeFolders: true
})
// If you want to close by default:
gui.close();
```
---

# Workflow Tools: 

Need a "build tool" or "bundler" to optimize, cache break, run a local server for testing. (In the past, just opened index.html in browser, but browsers limit functionality of this approach for security.)

Many options: Webpack, Parcel, Vite, etc. I like **Vite**.

Need **Node.js** and **npm** to manage dependencies. Funny tidbit from Wikipedia:
```
Although "npm" is commonly understood to be an abbreviation of "Node Package Manager", it is officially a recursive backronym for "npm is not an acronym".
```
```
npm init -y
```
Create a package.json with minimal information to run Node.js project

package.json and package-lock.json enable project sharing. (Don't share or modify 'node-modules', this folder contains dependencies.) To install dependencies according to package.json:
```
npm i
```
package-lock is optional; If present, specifies exact versions of dependencies with no tolerance.
```
npm install vite
npm install three
```
In package.json,
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
```
Then to run local server we just call
```
npm run dev
```
---
# Vite Config

We'll need to install vite restart plugin:
```
npm install vite-plugin-restart
```
Then, an example vite.config.js moving forward:
```javascript
import restart from 'vite-plugin-restart'  

export default {
	root: 'src/',
	publicDir: '../static/',
	server:
	{
		host: true,	
		open: true
	},
	build:
	{
		outDir: '../dist',	
		emptyOutDir: true,
		sourcemap: true
	
	},
	plugins:
	[
		restart({ restart: [ '../static/**', ] }) 
	],
}
```
Config exported as an object which Vite will use to set up development environment.
- Root defines source file directory (js, css, index.html)
- publicDir specifies static assets folder (textures, models, images); served as if available in root folder
- Server settings:
	- host: true means development server will be accessible to other devices on local network, not just localhost (Useful for mobile/VR headset testing)
	- open option controls whether browser should open automatically when server starts (I like this; optional)
- Build settings:
	- outDir, specifies build directory, one level up from src/ (root)
	- emptyOutDir, will empty old files from dist/ on build
	- Source maps help with debugging by mapping minified code back to source
- Plugins: restart will reset server if any file in static/ is modified

We'll end up with a project structure that looks something like this:
```
\node_modules
\src
	html
	js
	css
\static
	models
	textures
	svg
package.json
vite.config.js
```


