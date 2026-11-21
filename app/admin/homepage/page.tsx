import { getHeroImage } from "@/lib/db";
import { HeroEditor } from "./HeroEditor";

export const dynamic = "force-dynamic";

export default async function HomepageAdmin() {
  return <HeroEditor initialHero={await getHeroImage()} />;
}
