interface TableProps {
  value: string;
  width: number;
  height: number;
}

const RandersImage: React.FC<TableProps> = ({
  value,
  width = 70,
  height = 30,
}: TableProps) => {
  if (!value) {
    return <></>;
  }
  return (
    <img
      src={value || ""}
      alt="Design"
      height={height}
      width={width}
      loading="lazy"
      style={{ borderRadius: 5, width, height }}
      // quality={100}
      // property="lazy"
      // blurDataURL="data:..." //automatically provided
      // placeholder="blur" // Optional blur-up while loading
    />
  );
};
export default RandersImage;
