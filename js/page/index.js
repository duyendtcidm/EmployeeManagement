$(document).ready(function() {
    new Department();
});

class Department {
    constructor() {
            this.loadData();
            this.initEvents();
        }
        // Load department's data from API
    loadData() {
        $('.d-combobox-contain input').empty();
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Departments",
            success: function(response) {
                for (const department of response) {
                    const trHTML = $(`<div class="d-combobox-item" value="${department.DepartmentId}">${department.DepartmentName}</div>`);
                    $('.department-list').append(trHTML);
                }
            }
        });
    }

    initEvents() {
        // Display department list when press dropdown button
        $('#deparment-dropdown').on('click', this.departmentDisplay);
        // Display value on input when choose item in department list
        $('.department-list').on('click', '.d-combobox-item', this.departValueDisplay);
        // press key down and key up to choose department
        $(".d-combobox-contain").on('keydown', 'input', this.inputComboboxOnKeyDown);
        // $(".d-combobox-contain").on('keyup', 'input', this.inputComboboxOnKeyUp);
    };

    inputComboboxOnKeyDown() {
        // Get all element of department list:
        let items = $(this).parent().siblings().children();
        // check item that hovered
        let itemHoverred = items.filter('.d-combobox-item-focus');


        switch (event.keyCode) {
            case 13: // Enter key:
                // 1 item has been hovered -> assign value to input
                if (itemHoverred.length == 1) {
                    // Get text & value of item
                    itemHoverred = itemHoverred[0];
                    let text = itemHoverred.textContent;
                    let value = itemHoverred.getAttribute('value');

                    // Assign text to input
                    let hoveredParent = itemHoverred.parentElement;
                    let inputParent = $(hoveredParent).siblings();
                    $(inputParent).children('input').val(text);
                    // $(inputParent).children('input').val(text);
                    debugger;

                    // Assign value to department-contain
                    let parentComboboxElement = $(hoveredParent).parent();
                    parentComboboxElement.attr('value', value);
                    // parentComboboxElement.data('value', value);

                    // hide combobox:
                    $(hoveredParent).hide();
                }
                break;

            case 40: // arrow down key
                // 1 item has been hovered -> choose next siblings
                if (itemHoverred.length > 0) {
                    let nextElement = itemHoverred.next();
                    nextElement.addClass('d-combobox-item-focus');
                    itemHoverred.removeClass('d-combobox-item-focus');
                } else {
                    // None of items hovered -> choose first item
                    let firstItem = items[0];
                    firstItem.classList.add('d-combobox-item-focus');
                }
                // Display current item:
                $(this).siblings('.d-combobox-data').show();
                break;
            case 38: // arrow up key
                // 1 item has been hovered -> choose previous siblings
                if (itemHoverred.length > 0) {
                    let prevElement = itemHoverred.prev();
                    prevElement.addClass('d-combobox-item-focus');
                    itemHoverred.removeClass('d-combobox-item-focus');
                } else {
                    // None of items hovered -> choose last item
                    let lastItem = items[items.length - 1];
                    lastItem.classList.add('d-combobox-item-focus');
                }
                // Display current item:
                $(this).siblings('.d-combobox-data').show();
                break;

            default:

                break;
        }

    }

    departmentDisplay() {

        // Get current input text;
        const inputCurrText = $(this).siblings('input').val()
            // input-text != null -> set background for item has value = input-text
            // else focus on first item
        let dropdownParent = this.parentElement;
        let dropdownGrandpa = $(dropdownParent).parent();
        // let itemParent = $(dropdownGrandpa).children('department-list');
        let itemParent = $(dropdownParent).siblings();
        const items = $(itemParent).children();
        if (inputCurrText != '') {
            for (const item of items) {
                if (item.innerText == inputCurrText) {
                    for (const diffItem of items) {
                        if (item != diffItem) {
                            diffItem.classList.remove('d-combobox-item-focus');
                        }
                    }
                    item.classList.add('d-combobox-item-focus');
                }
            }
            $(this).siblings('input').addClass('d__input-invalid-focus')
        } else {
            $(items[0]).addClass('d-combobox-item-focus');
        }
        $('.content--department .department-list').toggle();
    }

    departValueDisplay() {
        // Get text & value from item
        const text = this.textContent;
        const value = this.getAttribute('value');
        // Assign text for input
        let parentItemElement = this.parentElement;
        let parentItemSibling = $(parentItemElement).siblings();
        $(parentItemSibling).children('input').val(text);
        //Assign value for combobox department
        // debugger;
        let grandpaItemElement = $(parentItemElement).parent();
        grandpaItemElement.attr('value', value);
        // Hide items department
        $(parentItemElement).hide();
    }

}