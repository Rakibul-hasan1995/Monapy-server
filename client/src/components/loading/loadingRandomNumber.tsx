import * as React from "react";

const LoadingRandomNumber = ({ length = 10000 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomCount: any = Math.floor(Math.random() * length); // Generate a random count number
      setCount(randomCount);
    }, 100);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{count}</>;
};

export default LoadingRandomNumber;

// // eslint-disable-next-line react-refresh/only-export-components
// export const randomNumber = () => {
//   let i = 0;
//   setInterval(() => {
//     const randomCount: any = Math.floor(Math.random() * length); // Generate a random count number
//     console.log(i)
//     i = randomCount;
//   }, 100);
//   return i
// };
