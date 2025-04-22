import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  image?: string;
  name: string;
  fill?: boolean;
  className?: string;
}

export default function ProfileImage({
  image,
  name,
  fill = false,
  className = "",
}: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState(image || "/pfp.png");

  const handleError = () => {
    setImgSrc("/pfp.png");
  };

  return (
    <div className={`imageWrapper ${className}`}>
      <Image
        src={imgSrc}
        alt={`${name}'s profile`}
        width={fill ? undefined : 100}
        height={fill ? undefined : 100}
        fill={fill}
        onError={handleError}
        className="profileImage"
        unoptimized
      />
    </div>
  );
}
