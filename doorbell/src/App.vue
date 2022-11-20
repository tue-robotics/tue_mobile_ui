<template>
  <div className="App">
    <div :className="'App-status ' + this.status" />
    <p className="App-intro">
      <DoorBell :ros="autoRos.ros"/>
    </p>
  </div>
</template>

<script>
import AutoRos from 'auto-ros'
import DoorBell from './components/Doorbell.vue'
import { hostname } from 'os';

// Private variables
const host = hostname() || 'localhost';
const defaultUrl = `ws://${host}:9090`;

export default {
  name: 'App',
  components: {
    DoorBell
  },
  data () {
    return {
      autoRos: new AutoRos(),
      status: 'connecting'
    }
  },
  mounted () {
    this.autoRos.on('status', this.onStatus.bind(this))
    this.autoRos.connect(defaultUrl)
  },
  methods: {
    onStatus () {
      this.status = this.autoRos.status
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.App {
  text-align: center;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-intro {
  font-size: large;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.App-status {
  background-color: yellow;
}

.App-status::before {
  content: 'connecting';
}


.App-status.connected {
  background-color: green;
}

.App-status.connected::before {
  content: 'connected';
}

.App-status.closed {
  background-color: red;
}

.App-status.closed::before {
  content: 'closed';
}
</style>
