<template>
  <div>
    <button className="doorbell" v-on:click='handleClick'></button>
  </div>
</template>

<script>
import ROSLIB from 'roslib'

export default {
  name: 'DoorBell',
  props: {
    ros: {
      type: Object,
      required: true
    },
    tts_topic: {
      type: String,
      default: 'text_to_speech/input'
    },
    message_topic: {
      type: String,
      default: 'message_from_ros'
    }
  },
  data () {
    return {
      ttsTopic: new ROSLIB.Topic({
        ros: this.ros,
        name: this.tts_topic,
        messageType: 'std_msgs/String'
      }),
      messageTopic: new ROSLIB.Topic({
        ros: this.ros,
        name: this.message_topic,
        messageType: 'std_msgs/String'
      })
    }
  },
  methods: {
    handleClick: function() {
      console.log('doorbell');
      this.ttsTopic.publish({
        data: 'doorbell',
      })
      this.messageTopic.publish({
        data: 'There is someone at your door'
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.doorbell {
    width: 300px;
    height: 500px;
    background-image: url('~@/assets/doorbell.png');
    background-size: cover;
}
</style>
