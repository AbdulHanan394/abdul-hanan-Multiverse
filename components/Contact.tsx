"use client";
import { useState } from "react";
import { Bird, Mail, Download, ScrollText } from "lucide-react";
import { worlds, type WorldId } from "@/content/worlds";
import WorldIcon from "./worlds/WorldIcon";
import { socials } from "@/content/profile";
import useConfig from "./useConfig";
export default function Contact({ world = "corsair" }: { world?: WorldId }) {
	const cfg = useConfig(),
		[status, setStatus] = useState(""),
		[sending, setSending] = useState(false),
		[success, setSuccess] = useState(false);
	async function send(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (sending) return;
		const form = e.currentTarget;
		if (!cfg?.contact) {
			const fields = new FormData(form);
			const brief = [
				fields.get("projectType"),
				fields.get("message"),
				fields.get("name"),
				fields.get("email"),
			].join("\n\n");
			try {
				await navigator.clipboard.writeText(brief);
				setStatus("Inquiry copied. Paste it into your LinkedIn message.");
			} catch {
				setStatus(brief);
			}
			return;
		}
		setSending(true);
		setSuccess(false);
		setStatus("Sealing your message…");
		try {
			const r = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.fromEntries(new FormData(form))),
			});
			const data = await r.json();
			if (!r.ok || !data.accepted)
				throw Error(data.error || "Delivery could not be confirmed.");
			setSuccess(true);
			setStatus("Your message was accepted by the email provider.");
			form.reset();
		} catch (err) {
			setStatus(
				err instanceof Error ? err.message : "Delivery is unavailable.",
			);
		} finally {
			setSending(false);
		}
	}
	return (
		<section id="contact" className="section contact">
			<div className="wrap split">
				<div>
					<p className="eyebrow">
						<WorldIcon id={world} size={17} /> {worlds[world].contact}
					</p>
					<h2>
						{world === "corsair" ? (
							<>
								Every Legendary Voyage Begins with <em>a Conversation.</em>
							</>
						) : (
							"Let’s build something together."
						)}
					</h2>
					<p className="deck">
						{world === "corsair"
							? "Have a Vision Worth Building? Let’s Set Sail."
							: "Tell me about your project."}
					</p>
					<div className="socials">
						{Object.entries(socials).map(([name, url]) => (
							<a key={name} href={url}>
								{name}
							</a>
						))}
					</div>
					{cfg?.email && (
						<a className="text-btn" href={`mailto:${cfg.email}`}>
							<Mail size={16} />
							{cfg.email}
						</a>
					)}
					{cfg?.resume && (
						<a className="text-btn" href={cfg.resume} download>
							<Download size={16} /> Download résumé
						</a>
					)}
				</div>
				<form className="contact-form" onSubmit={send}>
					<div className="form-row">
						<label>
							Name
							<input
								name="name"
								autoComplete="name"
								required
								minLength={2}
								maxLength={100}
							/>
						</label>
						<label>
							Email
							<input
								name="email"
								type="email"
								autoComplete="email"
								required
								maxLength={254}
							/>
						</label>
					</div>
					<label>
						Project type
						<select name="projectType" required defaultValue="">
							<option value="" disabled>
								Select a project type
							</option>
							{[
								"Web application",
								"AI system",
								"Backend engineering",
								"Other",
							].map((v) => (
								<option key={v}>{v}</option>
							))}
						</select>
					</label>
					<label>
						Message
						<textarea
							name="message"
							rows={4}
							required
							minLength={10}
							maxLength={3000}
						/>
					</label>
					<label className="honeypot" aria-hidden="true">
						Website
						<input name="website" tabIndex={-1} autoComplete="off" />
					</label>
					{cfg?.contact ? (
						<button type="submit" className="btn primary" disabled={sending}>
							<Bird size={16} />
							{sending ? "Sending…" : "Send message"}
						</button>
					) : (
						<div className="delivery-state">
							<p>
								{cfg
									? "Email delivery is offline. Copy your inquiry and send it on LinkedIn."
									: "Checking email delivery…"}
							</p>
							<button type="submit" className="btn primary" disabled={!cfg}>
								Copy inquiry
							</button>{" "}
							<a href={socials.LinkedIn} className="btn ghost">
								Contact on LinkedIn
							</a>
						</div>
					)}
					<div aria-live="polite" className={success ? "sealed" : ""}>
						{success && <ScrollText size={20} />}
						{status}
					</div>
				</form>
			</div>
		</section>
	);
}
