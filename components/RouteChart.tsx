import { destinations } from "@/content/profile";
const stops = [
	[38, 95],
	[78, 55],
	[137, 72],
	[185, 37],
	[244, 64],
	[288, 116],
	[358, 86],
	[404, 46],
];
function coast(x: number, y: number, r: number) {
	return (
		Array.from({ length: 72 }, (_, i) => {
			const a = (i * Math.PI) / 36,
				edge =
					r *
					(1 +
						0.19 * Math.sin(a * 3 + x) +
						0.16 * Math.cos(a * 5 + y) +
						0.1 * Math.cos(a * 7));
			return `${i ? "L" : "M"}${(x + edge * Math.cos(a)).toFixed(1)} ${(y + edge * Math.sin(a) * 0.55).toFixed(1)}`;
		}).join(" ") + "Z"
	);
}
export default function RouteChart({
	active,
	close,
}: {
	active: string;
	close: () => void;
}) {
	const pos = Math.max(
		0,
		destinations.findIndex(([id]) => id === active),
	);
	return (
		<svg
			className="route-chart"
			viewBox="0 0 440 145"
			aria-label="Interactive chart of the voyage"
		>
			<g fill="#243d3b" stroke="#6d7a62" strokeWidth=".7">
				{[
					[76, 30, 28],
					[163, 94, 31],
					[260, 28, 46],
					[338, 112, 36],
					[14, 128, 27],
				].map(([x, y, r]) => (
					<g key={x}>
						<path d={coast(x, y, r + 5)} fill="none" opacity=".5" />
						<path d={coast(x, y, r)} />
						<path d={coast(x, y, r * 0.65)} fill="none" />
					</g>
				))}
			</g>
			<polyline
				points={stops.map((s) => s.join(",")).join(" ")}
				fill="none"
				stroke="#8d886d"
				strokeDasharray="3 5"
			/>
			<polyline
				points={stops
					.slice(0, pos + 1)
					.map((s) => s.join(","))
					.join(" ")}
				fill="none"
				stroke="#e2c68d"
				strokeWidth="1.8"
			/>
			{destinations.map(([id, label], i) => (
				<a
					href={`/#${id}`}
					key={id}
					aria-label={`Sail to ${label}`}
					onClick={close}
				>
					<title>{label}</title>
					<g transform={`translate(${stops[i].join(" ")})`}>
						<circle r="14" fill="transparent" />
						{pos === i ? (
							<g stroke="#f0d7a2" strokeLinejoin="round" fill="#c6a66b">
								<path d="M-8 4H9L5 8H-5Z" />
								<path d="M0 1V-12L-7 1ZM3-8V1H8Z" />
							</g>
						) : (
							<circle
								r="3.8"
								fill={i <= pos ? "#d9bd82" : "#12292c"}
								stroke="#cfb57e"
							/>
						)}
					</g>
				</a>
			))}
		</svg>
	);
}
