"use client";
export default function ErrorPage({
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<main id="main" className="wrap lost">
			<h1>A change in the tide.</h1>
			<p>This page could not be loaded.</p>
			<button type="button" className="btn primary" onClick={reset}>
				Try again
			</button>{" "}
			<a href="/">Return to deck</a>
		</main>
	);
}
