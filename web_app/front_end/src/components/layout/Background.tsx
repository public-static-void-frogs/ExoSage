import { ShootingStars } from "../ui/ShootingStarts";
import { StarsBackground } from "../ui/StarsBackground";

export const Background = () => {
  if (process.env.NEXT_PUBLIC_BACKGROUND_ENABLED !== "true") {
    return null;
  }

  return (
    <>
      <ShootingStars starColor="#FFFFFF" />
      <StarsBackground starDensity={0.0005} allStarsTwinkle />
    </>
  );
};
