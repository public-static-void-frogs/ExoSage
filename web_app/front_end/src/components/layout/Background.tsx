import { ShootingStars } from "../ui/ShootingStarts";
import { StarsBackground } from "../ui/StarsBackground";

export const Background = () => {
  if (process.env.NEXT_PUBLIC_BACKGROUND_ENABLED !== "true") return null;

  return (
    <>
      <ShootingStars starColor="#FFFFFF" />
      <StarsBackground starDensity={0.0005} allStarsTwinkle />

      <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-b from-transparent to-black/50" />
    </>
  );
};
