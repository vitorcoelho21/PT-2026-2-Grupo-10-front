interface EstrelaAvaliacaoProps {
  preenchida: boolean;
  className?: string;
}

export default function EstrelaAvaliacao({ preenchida, className = "h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12" }: EstrelaAvaliacaoProps) {
  return (
    <svg
      viewBox="253 191 145 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M303.277 241.012L261.958 240.784C257.028 240.757 254.974 247.079 258.979 249.955L292.54 274.058C294.338 275.349 295.088 277.658 294.392 279.759L281.408 318.985C279.858 323.666 285.236 327.573 289.209 324.653L322.503 300.182C324.286 298.872 326.714 298.872 328.497 300.182L361.791 324.653C365.764 327.573 371.142 323.666 369.592 318.985L356.608 279.759C355.912 277.658 356.662 275.349 358.46 274.058L392.021 249.955C396.026 247.079 393.972 240.757 389.042 240.784L347.723 241.012C345.51 241.024 343.546 239.597 342.873 237.489L330.321 198.122C328.824 193.424 322.176 193.424 320.679 198.122L308.127 237.489C307.454 239.597 305.49 241.024 303.277 241.012Z"
        stroke="#8A38F5"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill={preenchida ? "#8A38F5" : "none"}
      />
    </svg>
  );
}
