"use strict";

app.component("sortButton", {
    templateUrl: "components/sort-button.html",
    controller: "SortButtonController",
    bindings: {
        change: "&"
    }
});


app.controller("SortButtonController", function ($log) {

    $log.debug("SortButtonController()");

    this.state = 0;

    this.icons = [
        "sort", "keyboard_arrow_up", "keyboard_arrow_down"
    ];


    this.nextState = () => {
        this.state = (this.state + 1) % this.icons.length;
        this.change({ sort: this.state });
    };

});
