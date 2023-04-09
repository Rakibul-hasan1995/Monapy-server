
exports.DateFormate = (isoDate, formate = 'DD-MMM-YY') => {

  const date = new Date(isoDate);  // 2009-11-10
  const month = date.toLocaleString('default', { month: 'long' });
  console.log(month);
  return month




  // var d = new Date(date),
  //   month = d.toLocaleString('en-us', { month: 'short' }),
  //   day = '' + d.getDate(),
  //   year = d.getFullYear();


  // if (day.length < 2)
  //   day = '0' + day;

  // return [day, month, year].join('-');
}