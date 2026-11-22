"use client";
import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Feather } from "lucide-react";
import { logbook } from "@/content/profile";
export default function Captain() {
	const [page, setPage] = useState(0);
	return (
		<section id="captain" className="section captain">
			<div className="wrap split">
				<div>
					<p className="eyebrow">
						<Feather size={16} /> The Captain
					</p>
					<h2>
						Every Great Voyage
						<br />
						<em>Begins with a Vision.</em>
					</h2>
					<h3 className="sub">Meet the Engineer Behind the Helm.</h3>
					<p className="copy">
						I’m Abdul Hanan, a software engineer in Lahore. I build web
						applications, backend services, and AI assistants. My work ranges
						from dispatch and moving platforms to systems that help people study
						and retrieve knowledge.
					</p>
					<p className="copy">
						I studied software engineering at the University of Central Punjab.
						Across projects, I follow the same question from the first screen to
						the database: what does the person using this actually need?
					</p>
				</div>
				<div className="logbook">
					<div className="book-top">
						<BookOpen size={22} />
						<span>Captain’s logbook</span>
					</div>
					<div className="paper-page" key={page} aria-live="polite">
						<h3>{logbook[page][0]}</h3>
						<p>{logbook[page][1]}</p>
						<i>Abdul Hanan</i>
					</div>
					<div className="book-foot">
						<button
							type="button"
							aria-label="Previous logbook page"
							disabled={page === 0}
							onClick={() => setPage(page - 1)}
						>
							<ChevronLeft size={18} />
						</button>
						<span>
							Page {page + 1} of {logbook.length}
						</span>
						<button
							type="button"
							aria-label="Next logbook page"
							disabled={page === logbook.length - 1}
							onClick={() => setPage(page + 1)}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
