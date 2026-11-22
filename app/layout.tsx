import type { Metadata } from "next";
import "./globals.css";
import WorldFrame from "@/components/worlds/WorldFrame";
import "./worlds.css";
import "./arcade.css";
import "./portfolio-editions.css";

import { socials } from "@/content/profile";
const base =
	process.env.SITE_URL ||
	"https://the-code-corsair-abdul-hanan.nurturingtanager32.chatgpt.site";
export const metadata: Metadata = {
	metadataBase: new URL(base),
	title: {
		default: "Abdul Hanan — The Code Corsair",
		template: "%s · Abdul Hanan",
	},
	description:
		"Explore Abdul Hanan’s full-stack and AI engineering portfolio, from contextual retrieval and computer vision to logistics platforms.",
	openGraph: {
		type: "website",
		title: "Abdul Hanan — The Code Corsair",
		images: [
			{
				url: "/art/hero.webp",
				width: 1983,
				height: 793,
				alt: "A lantern-lit sailing ship under a moonlit sky",
			},
		],
	},
	twitter: { card: "summary_large_image", images: ["/art/hero.webp"] },
	icons: { icon: "/compass.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
	const person = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Abdul Hanan",
		jobTitle: "Full Stack Software Engineer",
		url: base,
		sameAs: Object.values(socials),
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: "University of Central Punjab",
		},
	};
	return (
		<html lang="en">
			<body>
				<a className="skip" href="#main">
					Skip to content
				</a>
				<WorldFrame>{children}</WorldFrame>
				<script type="application/ld+json">
					{JSON.stringify(person).replace(/</g, "\\u003c")}
				</script>
				{process.env.ANALYTICS_SCRIPT_URL && (
					<script defer src={process.env.ANALYTICS_SCRIPT_URL} />
				)}
			</body>
		</html>
	);
}
