const dateFns = require('date-fns')

const sevenDays = () => {
    const now = new Date();
    let days = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayStr = day.toISOString();
        days.push(dateFns.format(new Date(dayStr), 'yyyy-MM-dd'));
    }

    return days;
};

module.exports = sevenDays;