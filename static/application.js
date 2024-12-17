import {Application} from "stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = true
window.Stimulus   = application

import GreetingsController from "./controllers/greetings_controller.js";
application.register("greetings", GreetingsController)

export { application }
