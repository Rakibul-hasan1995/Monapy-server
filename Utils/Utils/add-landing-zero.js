exports._addLeadingZeros = (num, totalLength) => {
   return String(num).padStart(totalLength, '0');
 }