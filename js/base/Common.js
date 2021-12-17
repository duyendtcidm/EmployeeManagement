class CommonJs {
    // Display inform of date : day/month/year
    // param : date
    static formatDate(date) {
        if (date) {
            const newDate = new Date(date);
            let day = newDate.getDate();
            day = day < 10 ? `0${day}` : day;
            let month = newDate.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            let year = newDate.getFullYear();
            return `${day}/${month}/${year}`;
        } else
            return "";
    }

    static formatCurrency(money) {
        if (money) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money)
        } else
            return "";
    }
}