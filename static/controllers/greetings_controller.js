import {Controller} from "stimulus"

// Connects to data-controller="greetings"
export default class extends Controller {
  connect() {
    this.element.innerHTML = "<h1 class='text-3xl'>Hello from Stimulus Greetings Controller</h1>"
  }
}
