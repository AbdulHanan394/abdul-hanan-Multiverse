import CompassRose from "@/components/CompassRose";
export default function Missing() {
	return (
		<main id="main" className="wrap lost">
			<CompassRose />
			<p className="eyebrow">404 · Off the chart</p>
			<h1>Uncharted waters.</h1>
			<p>This destination is missing from the voyage map.</p>
			<a href="/#fleet" className="btn primary">
				Return to the fleet
			</a>
		</main>
	);
}
