"use client";
import { usePathname } from "next/navigation";
import { isWorld, worlds, worldPath } from "@/content/worlds";
import { Navigation } from "../Navigation";
import CompassRose from "../CompassRose";
import WorldIcon from "./WorldIcon";
export default function WorldFrame({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname(),
		value = pathname.split("/")[2] || "",
		id = pathname.startsWith("/worlds/") && isWorld(value) ? value : "corsair",
		w = worlds[id];
	return (
		<div className="world-shell" data-world={id}>
			<Navigation world={id} />
			{children}
			<footer>
				<div className="wrap footer-inner">
					<a href={worldPath(id) + "#arrival"} className="brand">
						{id === "corsair" ? <CompassRose /> : <WorldIcon id={id} />}
						<span>{w.name}</span>
					</a>
					<small>Abdul Hanan · Software Engineer</small>
					<a href={worldPath(id) + "#arrival"}>
						{id === "corsair" ? "Return to deck" : "Back to top"}
					</a>
				</div>
			</footer>
		</div>
	);
}
