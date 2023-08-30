import moment from "moment";



const _groupData = (
   arr: [],
   dateKey: string,
   sumKey: string,
   groupBy: 'day' | "month" | 'year',
   dateFormate: string = 'DD-MMM'
) => {
   // const { arr, dateKey, sumKey, groupBy = 'day', dateFormate = 'DD-MMM', } = arg


   const data = arr.reduce(
      (acc: any, cur: any) => {
         const y = cur[sumKey]
         const curDate: any = moment(new Date(cur[dateKey]), "YYYY-MM-DD")
            .startOf(groupBy)
            .add(0, "days");
         acc[curDate]
            ? (acc[curDate].y += y)
            : (acc[curDate] = {
               x: moment(curDate).format(dateFormate),
               y,
            });
         return acc;
      },
      {}
   );

   return data
}
export default _groupData

