const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getMonth = () => {
    const date = new Date();
    return monthNames[date.getMonth()];
};

const getPast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const past = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = monthNames[past.getMonth()];
      const year = past.getFullYear();
      months.push(month);
      console.log(month, year);
    }
    
    return months;
}

module.exports = {
    getMonth,
    getPast12Months
}