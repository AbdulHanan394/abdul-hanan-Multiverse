export default function CompassRose({
	className = "",
	marked = false,
}: {
	className?: string;
	marked?: boolean;
}) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			viewBox="-56 -56 112 112"
			fill="none"
			stroke="currentColor"
		>
			<circle r="37" strokeWidth="1" />
			<circle r="32" opacity=".55" strokeWidth=".7" />
			{Array.from({ length: 32 }, (_, i) => i * 11.25).map((angle) => (
				<path
					key={angle}
					d={angle % 45 === 0 ? "M0 -30V-37" : "M0 -34V-37"}
					transform={`rotate(${angle})`}
					strokeWidth=".8"
				/>
			))}
			{[45, 135, 225, 315, 0, 90, 180, 270].map((d, i) => (
				<g key={d} transform={`rotate(${d})`}>
					<path
						d={i < 4 ? "M0 -26L5 0H-5Z" : "M0 -43L7 0H-7Z"}
						fill="currentColor"
						strokeWidth=".55"
					/>
					<path
						d={i < 4 ? "M0 -26V0H5Z" : "M0 -43V0H7Z"}
						fill="#122126"
						strokeWidth=".55"
					/>
				</g>
			))}
			<circle r="4" fill="#102025" />
			<circle r="1.5" fill="currentColor" />
			{marked &&
				["N", "E", "S", "W"].map((v, i) => (
					<text
						key={v}
						x={[0, 50, 0, -50][i]}
						y={[-46, 3, 53, 3][i]}
						stroke="none"
						fill="currentColor"
						textAnchor="middle"
						fontSize="7"
					>
						{v}
					</text>
				))}
		</svg>
	);
}
