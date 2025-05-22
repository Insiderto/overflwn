import { Badge } from "@/components/ui/badge.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { OverflowContainer } from "../lib/overflow-container.tsx";
import { Button } from "./components/ui/button";

const codeDemo = `
import { OverflowContainer } from "overflow-container";

const tags = [
  "#react", "#typescript", "#opensource", "#webdev", "#saas",
  "#uiux", "#css", "#frontend", "#demo", "#overflow"
];

export default function Demo() {
  return (
    <div style={{ maxWidth: 400 }}>
      <OverflowContainer
        renderHiddenElements={hidden => (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            +{hidden.length} more
          </div>
        )}
      >
        {tags.map(tag => (
          <span key={tag} style={{
            padding: '0.2em 0.7em',
            margin: '0 0.3em 0.3em 0',
            background: '#eee',
            borderRadius: '999px',
            display: 'inline-block',
            fontSize: '0.95em',
          }}>{tag}</span>
        ))}
      </OverflowContainer>
    </div>
  );
}`;

function App() {
	// Dark mode logic - set dark mode as default
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("theme");
			if (stored) return stored === "dark";
			// Set dark mode as default instead of using system preference
			return true;
		}
		return true;
	});
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [darkMode]);

	// Demo tags
	const tags = [
		"#react",
		"#typescript",
		"#opensource",
		"#webdev",
		"#saas",
		"#uiux",
		"#css",
		"#frontend",
		"#demo",
		"#overflow",
	];

	// Live demo container width
	const [containerWidth, setContainerWidth] = useState(400);

	// Copy to clipboard helper
	const [copied, setCopied] = useState<string | null>(null);
	function copy(text: string, key: string) {
		navigator.clipboard.writeText(text);
		setCopied(key);
		setTimeout(() => setCopied(null), 1200);
	}

	return (
		<div
			className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-6 gap-6 relative w-full"
			style={{ overflowY: "hidden" }}
		>
			{/* Light/Dark mode button in top right */}
			<div className="fixed top-4 right-4 z-50">
				<Button
					onClick={() => setDarkMode((d) => !d)}
					variant="outline"
					size="sm"
					aria-label="Toggle dark mode"
				>
					{darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
				</Button>
			</div>
			{/* Header */}
			<div className="w-full max-w-5xl flex flex-col gap-2 items-center">
				<h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
					OverflowContainer <span className="text-primary">Demo</span>
				</h1>
				<p className="text-base md:text-lg text-muted-foreground text-center max-w-xl">
					<b>OverflowContainer</b> automatically fits as many items as possible
					and hides the rest behind a customizable indicator. Perfect for tags,
					menus, avatars, and more. Fully compatible with dark mode and custom
					rendering.
				</p>
			</div>

			{/* Live Demo (now before install/code) */}
			<section className="w-full max-w-5xl bg-card rounded-xl shadow p-6 flex flex-col gap-3 items-center mb-6 gradient-border">
				<h2 className="font-semibold text-lg mb-2">Live Demo</h2>
				{/* Controls for resizing */}
				<div className="flex flex-row items-center gap-3 mb-3 w-full max-w-md">
					<Slider
						min={200}
						max={800}
						value={[containerWidth]}
						onValueChange={(value) => setContainerWidth(value[0])}
					/>
					<span className="text-xs w-12 text-right text-muted-foreground">
						{containerWidth}px
					</span>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setContainerWidth(240)}
					>
						Small
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setContainerWidth(400)}
					>
						Medium
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setContainerWidth(600)}
					>
						Large
					</Button>
				</div>
				<div className="w-full flex flex-col items-center">
					<div
						className="border border-muted rounded-lg p-4 bg-background transition-all duration-200"
						style={{ maxWidth: containerWidth, width: "100%" }}
					>
						<OverflowContainer
							className={"items-center"}
							renderHiddenElements={(hidden) => (
								<Badge>+{hidden.length} more</Badge>
							)}
							gap={10}
						>
							{tags.map((tag) => (
								<Badge key={tag}>{tag}</Badge>
							))}
						</OverflowContainer>
					</div>

					<div
						className="border border-muted rounded-lg p-4 bg-background transition-all duration-200"
						style={{ maxWidth: containerWidth, width: "100%" }}
					>
						<OverflowContainer
							className={"items-center"}
							renderHiddenElements={(hidden) => (
								<Popover>
									<PopoverTrigger>
										<Button variant="outline">
											Click to see {hidden.length} more{" "}
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className="flex flex-col gap-1">{hidden}</div>
									</PopoverContent>
								</Popover>
							)}
							gap={10}
						>
							{tags.map((tag) => (
								<Button key={tag}>{tag}</Button>
							))}
						</OverflowContainer>
					</div>
				</div>
			</section>

			<section className="w-full max-w-5xl bg-card rounded-xl shadow p-6 flex flex-col gap-3 gradient-border">
				<h2 className="font-semibold text-lg mb-1">Install</h2>
				<div className="flex gap-2 flex-wrap flex-col">
					<div className="flex gap-2  ">
						<pre className="bg-muted rounded px-3 py-1 text-sm select-all">
							npm install overflow-container
						</pre>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => copy("npm install overflow-container", "npm")}
						>
							{copied === "npm" ? "Copied!" : "Copy"}
						</Button>
					</div>
					<div className="flex gap-2  ">
						<pre className="bg-muted rounded px-3 py-1 text-sm select-all">
							yarn add overflow-container
						</pre>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => copy("yarn add overflow-container", "yarn")}
						>
							{copied === "yarn" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>
			</section>

			<section className="w-full max-w-5xl bg-card rounded-xl shadow p-6 flex flex-col gap-3 gradient-border">
				<h2 className="font-semibold text-lg mb-1">Usage Example</h2>
				<div className="relative">
					<Highlight theme={themes.duotoneDark} code={codeDemo} language="tsx">
						{({ style, tokens, getLineProps, getTokenProps }) => (
							<pre
								style={{
									...style,
									padding: "1rem",
									borderRadius: "0.375rem",
									overflow: "auto",
								}}
								className="text-xs md:text-sm"
							>
								{tokens.map((line, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={i}
										{...getLineProps({ line })}
										style={{ display: "flex" }}
									>
										<span
											style={{
												userSelect: "none",
												opacity: 0.5,
												marginRight: "1rem",
												textAlign: "right",
												minWidth: "1.5rem",
											}}
										>
											{i + 1}
										</span>
										<span>
											{line.map((token) => (
												<span
													key={token.content}
													{...getTokenProps({ token })}
												/>
											))}
										</span>
									</div>
								))}
							</pre>
						)}
					</Highlight>
					<Button
						size="sm"
						variant="secondary"
						className="absolute top-2 right-2"
						onClick={() =>
							copy(
								'import { OverflowContainer } from "overflow-container";\n\nconst tags = [\n  "#react", "#typescript", "#opensource", "#webdev", "#saas",\n  "#uiux", "#css", "#frontend", "#demo", "#overflow"\n];\n\nexport default function Demo() {\n  return (\n    <div style={{ maxWidth: 400 }}>\n      <OverflowContainer\n        renderHiddenElements={hidden => (\n          <div style={{ color: \'#888\', fontStyle: \'italic\' }}>\n            +{hidden.length} more\n          </div>\n        )}\n      >\n        {tags.map(tag => (\n          <span key={tag} style={{\n            padding: \'0.2em 0.7em\',\n            margin: \'0 0.3em 0.3em 0\',\n            background: \'#eee\',\n            borderRadius: \'999px\',\n            display: \'inline-block\',\n            fontSize: \'0.95em\',\n          }}>{tag}</span>\n        ))}\n      </OverflowContainer>\n    </div>\n  );\n}',
								"usage",
							)
						}
					>
						{copied === "usage" ? "Copied!" : "Copy"}
					</Button>
				</div>
			</section>

			<footer className="w-full max-w-5xl text-center text-xs text-muted-foreground mt-8">
				OverflowContainer &copy; {new Date().getFullYear()} —{" "}
				<a href="#" className="underline">
					GitHub
				</a>
			</footer>
		</div>
	);
}

export default App;
