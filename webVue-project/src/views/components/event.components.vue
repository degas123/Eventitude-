<template>
  <div class="eventDetales" v-on:click="redirect()" id="event">
    <div v-if="Event_id">Event id: {{ Event_id }}</div>
    <div>Event name: {{ Name }}</div>
    <div v-if="description">Description: {{ description }}</div>
    <div v-if="location">Location: {{ location }}</div>
    <div v-if="Start">Start date: {{ new Date(Start).toUTCString() }}</div>
    <div v-if="Close_registration">Close registration: {{ new
      Date(Close_registration).toUTCString() }}</div>
    <div v-if="number_attending">number of people attending {{ number_attending }}</div>
    <div v-if="max_attendees">Max attendees: {{ max_attendees }}</div>
    <div v-if="creator_id">creater user id: {{ creator_id }}</div>
    <div v-if="creatorName">creator Name: {{ creatorName }}</div>



  </div>

</template>
<script>

export default {
  props: {
    Event_id: Number,
    Name: String,
    description: String,
    location: String,
    Start: Number,
    Close_registration: Number,
    number_attending: Number,
    max_attendees: Number,
    creator_id: Number,
    creatorName: String,
    // qestions ??
    //   object as seprat  cpmonenets ?

  }

}

</script>

<style scoped>
#event {
  /* border: 5px solid lime; */
  padding: 10px;
  text-align: center;
}

/* .eventDetales {
  border: 5px, solid, black;
  padding: 10px;
  margin: 5px;
} */
</style>
