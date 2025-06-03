import { Badge } from "@/components/ui/badge.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import "./scrollbar.css";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { OverflowContainer } from "../lib/overflow-container.tsx";
import { Button } from "./components/ui/button";

const codeDemo = `
import { OverflowContainer } from "overflwn";
import { Badge } from "your-ui-library"; // or use your own Badge component
import { Tooltip } from "your-ui-library"; // optional for tooltip functionality

const tags = [
  "#react", "#typescript", "#opensource", "#webdev", "#saas",
  "#uiux", "#css", "#frontend", "#demo", "#overflow"
];

export default function Demo() {
  return (
    <div style={{ maxWidth: 400 }}>
      <OverflowContainer
        className="items-center"
        gap={10}
        renderHiddenElements={(hidden, hiddenIndexes) => (
          <Tooltip content={hiddenIndexes.map(i => <Badge key={tags[i]}>{tags[i]}</Badge>)}>
            <Badge>+{hidden.length} more</Badge>
          </Tooltip>
        )}
      >
        {tags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
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
			className="min-h-screen bg-background text-foreground flex flex-col items-center py-6 gap-6 relative w-full"
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
			<div className="w-full px-12 flex flex-col gap-2 items-start">
				<h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-left">
					overflwn
				</h1>
				<p className="text-base md:text-lg text-muted-foreground text-left max-w-xl">
					<b>overflwn</b> automatically fits as many items as possible and hides
					the rest behind a customizable indicator. Perfect for tags, menus,
					avatars, and more.
				</p>

				{/* Advantages */}
				<div className="flex flex-col gap-2 mt-2">
					<div className="flex items-center gap-2">
						<Badge variant="secondary">2.66 kB │ gzip: 0.96 kB</Badge>
						<span className="text-sm text-muted-foreground">
							Tiny bundle size
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">Pure React</Badge>
						<span className="text-sm text-muted-foreground">
							No dependencies, just clean React code
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">Universal</Badge>
						<span className="text-sm text-muted-foreground">
							Works with any UI library or framework
						</span>
					</div>
				</div>
			</div>

			{/* Two column layout - Demo on left, Code on right */}
			<div className="w-full px-12 flex flex-col md:flex-row gap-8">
				{/* Left column - Demo */}
				<div className="w-full md:w-1/2 flex flex-col gap-6">
					{/* Live Demo */}
					<section className="w-full bg-card rounded-xl shadow p-8 flex flex-col gap-3 items-center">
						<h2 className="font-semibold text-lg mb-2">Live Demo</h2>
						{/* Controls for resizing */}
						<div className="flex flex-row items-center gap-3 mb-3 w-full">
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
						<div className="w-full flex flex-col items-center gap-4">
							<div
								className="border border-muted rounded-lg p-4 bg-background transition-all duration-200"
								style={{ width: `${containerWidth}px` }}
							>
								<OverflowContainer
									className={"items-center"}
									renderHiddenElements={(hidden, hiddenIndexes) => (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<Badge>+{hidden.length} more</Badge>
												</TooltipTrigger>
												<TooltipContent className="flex flex-col px-0">
													{hiddenIndexes.map((e) => (
														<Badge key={`tooltip-${tags[e]}`}>{tags[e]}</Badge>
													))}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
									gap={10}
								>
									{tags.map((tag, index) => (
										<Badge key={`tag-${index}-${tag}`}>{tag}</Badge>
									))}
								</OverflowContainer>
							</div>

							<div
								className="border border-muted rounded-lg p-4 bg-background transition-all duration-200"
								style={{ width: `${containerWidth}px` }}
							>
								<OverflowContainer
									className={"items-center"}
									renderHiddenElements={(hidden) => (
										<Popover>
											<PopoverTrigger>
												<Button variant="outline" asChild>
													<span>Click to see {hidden.length} more</span>
												</Button>
											</PopoverTrigger>
											<PopoverContent>
												<div className="flex flex-col gap-1">{hidden}</div>
											</PopoverContent>
										</Popover>
									)}
									gap={10}
								>
									{tags.map((tag, index) => (
										<Button key={`btn-${index}-${tag}`}>{tag}</Button>
									))}
								</OverflowContainer>
							</div>
						</div>
					</section>

					{/* Install */}
					<section className="w-full bg-card rounded-xl shadow p-8 flex flex-col gap-3">
						<h2 className="font-semibold text-lg mb-1">Install</h2>
						<div className="flex gap-2 flex-wrap flex-col">
							<div className="flex gap-2">
								<pre className="bg-muted rounded px-3 py-1 text-sm select-all">
									npm install overflwn
								</pre>
								<Button
									size="sm"
									variant="secondary"
									onClick={() => copy("npm install overflow-container", "npm")}
								>
									{copied === "npm" ? "Copied!" : "Copy"}
								</Button>
							</div>
							<div className="flex gap-2">
								<pre className="bg-muted rounded px-3 py-1 text-sm select-all">
									yarn add overflwn
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
				</div>

				{/* Right column - Code */}
				<div className="w-full md:w-1/2">
					<section className="w-full h-full bg-card rounded-xl shadow p-8 flex flex-col gap-3">
						<h2 className="font-semibold text-lg mb-1">Usage Example</h2>
						<div className="relative h-full">
							<Highlight
								theme={themes.duotoneDark}
								code={codeDemo}
								language="tsx"
							>
								{({ style, tokens, getLineProps, getTokenProps }) => (
									<pre
										style={{
											...style,
											padding: "1rem",
											borderRadius: "0.375rem",
											overflow: "auto",
											height: "calc(100% - 2rem)", // Make code area fill available space
										}}
										className="text-xs md:text-sm custom-scrollbar"
									>
										{tokens.map((line, i) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: This is a static code display
												key={`line-${i}`}
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
													{line.map((token, j) => (
														<span
															key={`token-${i}-${j}-${token.content}`}
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
										'import { OverflowContainer } from "overflwn";\n\nconst tags = [\n  "#react", "#typescript", "#opensource", "#webdev", "#saas",\n  "#uiux", "#css", "#frontend", "#demo", "#overflow"\n];\n\nexport default function Demo() {\n  return (\n    <div style={{ maxWidth: 400 }}>\n      <OverflowContainer\n        renderHiddenElements={(hidden, hiddenIndexes) => (\n          <div style={{ color: \'#888\', fontStyle: \'italic\' }}>\n            +{hidden.length} more\n          </div>\n        )}\n      >\n        {tags.map(tag => (\n          <span key={tag} style={{\n            padding: \'0.2em 0.7em\',\n            margin: \'0 0.3em 0.3em 0\',\n            background: \'#eee\',\n            borderRadius: \'999px\',\n            display: \'inline-block\',\n            fontSize: \'0.95em\',\n          }}>{tag}</span>\n        ))}\n      </OverflowContainer>\n    </div>\n  );\n}',
										"usage",
									)
								}
							>
								{copied === "usage" ? "Copied!" : "Copy"}
							</Button>
						</div>
					</section>
				</div>
			</div>

			<footer className="w-full px-12 text-center text-xs text-muted-foreground mt-8">
				overflwn &copy; {new Date().getFullYear()} by Rafael Kamaltinov —{" "}
				<a href="https://github.com/Insiderto/overflwn" className="underline">
					GitHub
				</a>
				{" — "}
				<a
					href="https://github.com/Insiderto/overflwn/blob/master/LICENSE"
					className="underline"
				>
					MIT License
				</a>
			</footer>
		</div>
	);
}

export default App;
