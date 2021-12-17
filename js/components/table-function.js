$(document).ready(function() {
    new TblFunct();
});

class TblFunct {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        // Display menu when click dropdown button
        $('.edit-dropdown').click(this.showMenu);
        // Undisplay menu when move out of menu
        $('.d-table--functions').mouseleave(this.undisplayMenu);
    }

    showMenu(sender) {
        let dropDownParent = $(sender.target).parent();
        let funcItemParent = $(dropDownParent).siblings();
        $(funcItemParent).show();
    }

    undisplayMenu() {
        $('.d-table--functions').hide();
    }
}