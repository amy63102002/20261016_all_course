import { Composition } from "remotion";
import { PROMO_FRAMES, Promo } from "./Promo";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={1920} height={1080} />
  );
};
