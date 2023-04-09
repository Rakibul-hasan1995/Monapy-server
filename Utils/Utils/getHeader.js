export function _getHeader() {
   let name = "access_token=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for (let i = 0; i < ca.length; i++) {
     let c = ca[i];
     // eslint-disable-next-line eqeqeq
     while (c.charAt(0) == ' ') {
       c = c.substring(1);
     }
     // eslint-disable-next-line eqeqeq
     if (c.indexOf(name) == 0) {
       // return c.substring(name.length, c.length);
       let axiosConfig = {
         headers: {
           'Content-Type': 'application/json;charset=UTF-8',
           "Access-Control-Allow-Origin": "*",
           'access_token': c.substring(name.length, c.length)
         }
       };
       return axiosConfig
     }
   }
   return "";
 }