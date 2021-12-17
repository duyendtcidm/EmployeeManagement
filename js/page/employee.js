$(document).ready(function() {
    // 
    new EmployeePage();
});

class EmployeePage {
    TitlePage = " Dánh sách nhân viên";
    formMode = null;
    employeeIdSelected = null;
    employeeCodeSelected = null;
    constructor() {
        this.loadData();
        this.initEvents();
    }

    loadData() {
        // remove old data
        $('table#employeesTable tbody').empty();
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees",
            async: false,
            success: function(employees) {
                for (const employee of employees) {
                    let trHTML = $(`<tr>
                    <td class="d-table--checkbox">
                                    <input type="checkbox">
                                </td>
                    <td class="text-align-left">${employee.EmployeeCode}</td>
                    <td class="text-align-left">${employee.EmployeeName}</td>
                    <td class="text-align-left">${employee.GenderName || ""}</td>
                    <td class="text-align-center">${CommonJs.formatDate(employee.DateOfBirth) || ""}</td>
                    <td class="text-align-left">${employee.IdentityNumber || ""}</td>
                    <td class="text-align-left">${employee.PositionName || ""}</td>
                    <td class="text-align-left">${employee.DepartmentName || ""}</td>
                    <td class="text-align-left">${employee.BankAccountNumber || ""}</td>
                    <td class="text-align-left">${employee.BankName || ""}</td>
                    <td class="text-align-left table-function">${employee.BankBranchName || ""}</td>
                    <td class="text-align-left">
                        <div class="d-table--functions-contain">
                            <div class="function-display">
                                <div class="edit--button" employeeId="${employee.EmployeeId}">Sửa</div>
                                <div tabindex="-1" class="edit-dropdown"></div>
                            </div>
                            <div class="d-table--functions">
                                <div id="function-delete" class="d-table__function-tiem d-table__function--delete" employeeCode="${employee.EmployeeCode}" employeeId="${employee.EmployeeId}">Xóa</div>
                            </div>
                        </div>
                    </td>
                </tr>`);
                    trHTML.data('employeeId', employee.EmployeeId)
                    trHTML.data('data', employee);
                    $('table#employeesTable tbody').append(trHTML);

                }
            }
        });
        // $('.d-table--functions').hide();
        // $('table#employeesTable tbody table-function').
        $('#loader').hide();;
    }

    initEvents() {
        // Refresh data
        $('#refreshPage').click(this.loadPage.bind(this));
        // Add new employee
        $('#addEmployee').click(this.addEmployee.bind(this));
        // Check EmployeeCode - Name - Department when hover save-add button
        $('#saveAdd').mouseenter(this.checkInputData.bind(this));
        // Save employee
        $('#saveAdd').click(this.saveDataEmployee.bind(this));
        // Update employee
        // Load form emp-information
        var elements = $('.edit--button');
        for (var i = 0; i < elements.length; i++) {
            $(elements[i]).click(this.openForm.bind(this));
        }

        // Delete employee
        // Delete toast-msg notice
        var deleteNotices = $('.d-table__function--delete');
        for (var i = 0; i < deleteNotices.length; i++) {
            $(deleteNotices[i]).click(this.deleteEmployeeNotice.bind(this));
        }
        // $('#function-delete').click(this.deleteEmployeeNotice.bind(this));
        // $('table#employeesTable').on('click', '.d-table__function--delete', this.deleteEmployeeNotice.bind(this));
        // Delete
        $("#delete-btn").click(this.deleteEmployee.bind(this));
        // Cancel deleting
        $("#delete-cancel").click(this.cancelDelete);
        // Close popup
        $('.popup--close').click(this.popupDlgClose);
    }

    loadPage() {
        var page = this;
        $('#loader').show();
        // $('table#employeesTable tbody').empty();
        setTimeout(function() {
            page.loadData();
        }, 1000);
    }

    addEmployee() {
        // clean form
        $('input').val("");
        // Get data from form
        // load new Employee Code
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
            async: false,
            success: function(response) {
                $('#txtEmployeeCode').val(response);
                $('#txtEmployeeCode').focus();
                // $('#txtEmployeeCode').addClass('d__input-focus');;

            }
        });
        $('#popup-dlg').show();
    }

    checkInputData() {
        var page = this;
        let inputs = $("input[fieldName]");
        for (let input of inputs) {
            if (input.getAttribute("fieldName") == 'EmployeeCode') {
                let inputCode = input.value.trim();
                if (inputCode == '') {
                    $('#invalidCode').show();
                    $('#invalidCode').fadeOut(3000);
                }
            } else if (input.getAttribute("fieldName") == 'EmployeeName') {
                let inputName = input.value;
                if (inputName == '') {
                    $('#invalidName').show().trim();
                    $('#invalidName').fadeOut(3000);
                }
            } else if (input.getAttribute("fieldName") == 'DepartmentName') {
                let inputDepartment = input.value;
                if (inputDepartment == '') {
                    $('#invalidDepartment').show();
                    $('#invalidDepartment').fadeOut(3000);
                }
            }
        }
        // const inputDepartment = inputs[DepartmentName];
    }

    saveDataEmployee() {
        debugger;
        var page = this;
        // let DepartmentId = null;
        // Get data from form
        let inputs = $("input[fieldName]");
        let employee = {};
        for (const input of inputs) {
            let fieldName = input.getAttribute("fieldName");
            let value = input.value.trim();
            if (value) {
                employee[fieldName] = value
            }
        }
        employee.DepartmentId = $('.department--contain').attr('value');
        console.log(employee);
        $.ajax({
            type: "POST",
            url: 'http://amis.manhnv.net/api/v1/Employees',
            async: false,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {},
        });
        // Reload table
        page.loadData();
        $('#popup-dlg').hide();
    }

    openForm(sender) {
        this.employeeIdSelected = $(sender.target).attr("employeeId");
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIdSelected}`,
            async: false,
            success: function(employee) {
                console.log(employee);
                // Binding data into form
                // 1. Get data by attribute: fieldName
                // let inputs = $("input[fieldName]");
                // // 2. Build form by selected input[]
                // for (const input of inputs) {
                //     let fieldName = input.getAttribute("fieldName");
                //     let value = employee[fieldName];
                //     if (value) {
                //         input.value = value;
                //     } else {
                //         input.value = null;
                //     }

                // }
                $('#txtEmployeeCode').val(employee.EmployeeloyeeCode);
                $('#txtFullName').val(employee.EmployeeloyeeName);
                $('#dtDob').val();
                $($('input[name="Gender"]')[employee.Gender]).prop("checked", true)
                $('#txtPosition').val(employee.employeeloyeePosition);
                $('#txtIdentify').val(employee.IdentityNumber);
                $('#txtIdentityDate').val();
                $('#txtIdentityPlace').val();
                $('#cbxDepartment').data('value', employee.DepartmentId);
                $('#txtAddress').val(employee.Address);
                $('#txtPhoneNumber').val(employee.PhoneNumber);
                $('#txtTelePhoneNumber').val(employee.TelephoneNumber);
                $('#txtEmail').val(employee.Email);
                $('#txtBankAccountNumber').val(employee.BankAccountNumber);
                $('#txtBankName').val(employee.BankName);
                $('#txtBankBranchName').val(employee.BankBranchName);
                $('#popup-dlg').show();
            }
        });
    }

    updateDataEmployee() {
        this.employeeIdSelected = $(sender.target).attr("employeeId");

    }

    // Display notification before delete
    deleteEmployeeNotice(sender) {
        // debugger;
        this.employeeIdSelected = $(sender.target).attr("employeeId");
        // this.employeeCodeSelected = $(sender.target).attr("employeeCode");
        $('.delete-toast-msg').show();
        // $('.delete-toast-msg span').show();
        $('.d-table--functions').hide();

    }

    // Delete employee
    deleteEmployee() {
        var page = this;

        $.ajax({
            type: "DELETE",
            async: false,
            url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeIdSelected}`,
            success: function(response) {}
        });
        page.loadData();
        $('.delete-toast-msg').hide();
    }

    popupDlgClose() {
        $('#popup-dlg').hide();
    }

    cancelDelete() {
        $('.delete-toast-msg').hide();
    }
}