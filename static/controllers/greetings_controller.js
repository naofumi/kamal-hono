import {Controller} from "stimulus"

// Connects to data-controller="accordion"
export default class extends Controller {
  connect() {
    alert("Howdy!")
  }
}
