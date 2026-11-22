import {
	Compass,
	Orbit,
	Star,
	Zap,
	Terminal,
	Radio,
	Cog,
	MountainSnow,
} from "lucide-react";
import type { WorldId } from "@/content/worlds";
const icons = {
	corsair: Compass,
	orbital: Orbit,
	frontier: Star,
	marvel: Zap,
	neon: Terminal,
	abyss: Radio,
	clockwork: Cog,
	alpine: MountainSnow,
};
export default function WorldIcon({
	id,
	size = 20,
	className,
}: {
	id: WorldId;
	size?: number;
	className?: string;
}) {
	const Icon = icons[id];
	return <Icon aria-hidden="true" size={size} className={className} />;
}
