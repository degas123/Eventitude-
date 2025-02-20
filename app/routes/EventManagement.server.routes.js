const Events = require("../controllers/EventManagement.server.controllers"),
        auth = require("../../lib/middleware");

    module.exports= function(app){
    app.route("/events").post(auth.isAuthenticated,Events.createEvents);

    app.route("/event/:event_id")
        .get(Events.get_event);

    app.route("/event/:event_id")
        .patch(auth.isAuthenticated, Events.updateEvent);

    app.route("/event/:event_id")
        .post(auth.isAuthenticated,Events.register);    

    app.route("/event/:event_id")
        .delete(auth.isAuthenticated,Events.deleteEvent);    
    
    app.route("/search")
        .get(Events.searchEvents);    
}   