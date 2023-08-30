import moment from "moment";

export const getLast30DaysData = (dataArray: any) => {
   const currentDate = moment();
   const thirtyDaysAgo = moment().subtract(30, "days");

   const last30DaysData = dataArray.filter((item: { x: moment.MomentInput }) => {
      const itemDate = moment(item.x);
      return (
         itemDate.isSameOrAfter(thirtyDaysAgo) &&
         itemDate.isSameOrBefore(currentDate)
      );
   });
   return last30DaysData;
};

export const getCurrentMonthData = (dataArray: any) => {
   const currentYear = moment().year(); // Get the current year
   const currentMonth = moment().month(); // Get the current month (0-indexed)

   const currentMonthYearData = dataArray.filter(
      (item: { x: moment.MomentInput }) => {
         const itemYear = moment(item.x).year(); // Get the year of the item
         const itemMonth = moment(item.x).month(); // Get the month of the item (0-indexed)
         return itemYear === currentYear && itemMonth === currentMonth;
      }
   );

   return currentMonthYearData;
};
