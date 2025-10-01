import { Badge } from "@/components/ui/badge.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Highlight, themes } from "prism-react-renderer";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { OverflowContainer } from "../lib/overflow-container.tsx";
import { Button } from "./components/ui/button";
import "./scrollbar.css";

function App() {
	// Dark mode
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("theme");
			if (stored) return stored === "dark";
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

	// Demo data
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

	const [containerWidth, setContainerWidth] = useState(70);
	// Используем useDeferredValue для плавной работы слайдера
	const deferredWidth = useDeferredValue(containerWidth);

	// Copy helper
	const [copied, setCopied] = useState<string | null>(null);
	function copy(text: string, id: string) {
		navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(null), 2000);
	}

	// Code examples
	const codeExamples = {
		tags: `<OverflowContainer
  gap={8}
  renderHiddenElements={(hidden) => (
    <Badge variant="outline">
      +{hidden.length}
    </Badge>
  )}
>
  {tags.map(tag => (
    <Badge key={tag}>{tag}</Badge>
  ))}
</OverflowContainer>`,
		buttons: `<OverflowContainer
  gap={8}
  renderHiddenElements={(hidden) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          +{hidden.length}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1">
          {hidden}
        </div>
      </PopoverContent>
    </Popover>
  )}
>
  {items.map(item => (
    <Button key={item} variant="outline" size="sm">
      {item}
    </Button>
  ))}
</OverflowContainer>`,
		avatars: `<OverflowContainer
  gap={0}
  renderHiddenElements={(hidden) => (
    <Tooltip>
      <TooltipTrigger>
        <div className="w-10 h-10 rounded-full
          bg-muted border-2 flex items-center
          justify-center text-xs">
          +{hidden.length}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        and {hidden.length} more
      </TooltipContent>
    </Tooltip>
  )}
>
  {users.map(user => (
    <Tooltip key={user.id}>
      <TooltipTrigger>
        <Avatar />
      </TooltipTrigger>
    </Tooltip>
  ))}
</OverflowContainer>`,
	};

	// Memoized render functions
	const renderTagsHidden = useCallback(
		(hidden: React.ReactNode[], hiddenIndexes: number[]) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Badge variant="outline">+{hidden.length}</Badge>
					</TooltipTrigger>
					<TooltipContent className="flex flex-wrap gap-1 max-w-xs">
						{hiddenIndexes.map((i) => (
							<Badge key={`tooltip-${tags[i]}`} variant="secondary">
								{tags[i]}
							</Badge>
						))}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
		[],
	);

	const renderButtonsHidden = useCallback(
		(hidden: React.ReactNode[]) => (
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm">
						+{hidden.length}
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col gap-1">{hidden}</div>
				</PopoverContent>
			</Popover>
		),
		[],
	);

	// Code block component
	const CodeBlock = ({ code, id }: { code: string; id: string }) => (
		<div className="relative">
			<Highlight
				theme={darkMode ? themes.nightOwl : themes.github}
				code={code}
				language="tsx"
			>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre
						className={`${className} text-xs p-4 rounded-lg overflow-x-auto`}
						style={style}
					>
						{tokens.map((line, lineIndex) => {
							const lineContent = line.map((token) => token.content).join("");
							return (
								<div
									key={`${lineIndex}-${lineContent}`}
									{...getLineProps({ line })}
								>
									{line.map((token, tokenIndex) => (
										<span
											key={`${tokenIndex}-${token.content}`}
											{...getTokenProps({ token })}
										/>
									))}
								</div>
							);
						})}
					</pre>
				)}
			</Highlight>
			<Button
				variant="ghost"
				size="sm"
				className="absolute top-2 right-2"
				onClick={() => copy(code, id)}
			>
				{copied === id ? "Copied!" : "Copy"}
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Theme toggle */}
			<div className="fixed top-6 right-6 z-50">
				<Button
					onClick={() => setDarkMode((d) => !d)}
					variant="ghost"
					size="icon"
					aria-label="Toggle theme"
				>
					{darkMode ? "☀️" : "🌙"}
				</Button>
			</div>

			{/* Hero */}
			<section className="py-12 px-6">
				<div className="max-w-7xl mx-auto space-y-8">
					<div className="text-center space-y-3">
						<h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
							overflwn
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-light">
							Overflow management for React
						</p>
						<div className="flex items-center justify-center gap-4 pt-2">
							<Button
								variant="outline"
								onClick={() =>
									window.open("https://github.com/Insiderto/overflwn", "_blank")
								}
							>
								GitHub
							</Button>
						</div>
					</div>

					{/* Width control */}
					<div className="flex items-center gap-4 max-w-md mx-auto">
						<span className="text-sm text-muted-foreground min-w-20">
							Width: {deferredWidth}%
						</span>
						<Slider
							min={30}
							max={100}
							step={5}
							value={[containerWidth]}
							onValueChange={(value) => setContainerWidth(value[0])}
							className="flex-1"
						/>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="tags" className="w-full">
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
							<TabsTrigger value="tags">Tags</TabsTrigger>
							<TabsTrigger value="buttons">Buttons</TabsTrigger>
							<TabsTrigger value="avatars">Avatars</TabsTrigger>
						</TabsList>

						{/* Tags tab */}
						<TabsContent value="tags" className="mt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
								<div>
									<h3 className="text-sm font-semibold mb-2">Preview</h3>
									<div
										className="p-6 border border-muted rounded-lg bg-card transition-all duration-200"
										style={{ width: `${deferredWidth}%` }}
									>
										<OverflowContainer
											className="items-center"
											gap={8}
											renderHiddenElements={renderTagsHidden}
										>
											{tags.map((tag) => (
												<Badge key={tag}>{tag}</Badge>
											))}
										</OverflowContainer>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2">Code</h3>
									<CodeBlock code={codeExamples.tags} id="tags" />
								</div>
							</div>
						</TabsContent>

						{/* Buttons tab */}
						<TabsContent value="buttons" className="mt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
								<div>
									<h3 className="text-sm font-semibold mb-2">Preview</h3>
									<div
										className="p-6 border border-muted rounded-lg bg-card transition-all duration-200"
										style={{ width: `${deferredWidth}%` }}
									>
										<OverflowContainer
											className="items-center"
											gap={8}
											renderHiddenElements={renderButtonsHidden}
										>
											{tags.map((tag) => (
												<Button key={tag} variant="outline" size="sm">
													{tag}
												</Button>
											))}
										</OverflowContainer>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2">Code</h3>
									<CodeBlock code={codeExamples.buttons} id="buttons" />
								</div>
							</div>
						</TabsContent>

						{/* Avatars tab - компактный контейнер как в реальных приложениях */}
						<TabsContent value="avatars" className="mt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
								<div>
									<h3 className="text-sm font-semibold mb-2">Preview</h3>
									<div
										className="p-6 border border-muted rounded-lg bg-card transition-all duration-200"
										style={{ width: `${deferredWidth}%` }}
									>
										<OverflowContainer
											as="ul"
											className="items-center"
											gap={0}
											renderHiddenElements={(hidden) => (
												<Tooltip>
													<TooltipTrigger>
														<div className="w-10 h-10 shrink-0 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform cursor-pointer">
															+{hidden.length}
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-xs">
															and {hidden.length} more collaborators
														</p>
													</TooltipContent>
												</Tooltip>
											)}
										>
											{Array.from({ length: 15 }, (_, i) => {
												const userId = `user-${i}`;
												const userName = String.fromCharCode(65 + i);
												const colors = [
													"from-blue-500 to-cyan-500",
													"from-purple-500 to-pink-500",
													"from-orange-500 to-red-500",
													"from-green-500 to-emerald-500",
													"from-yellow-500 to-orange-500",
													"from-indigo-500 to-purple-500",
													"from-pink-500 to-rose-500",
													"from-teal-500 to-green-500",
												];
												return (
													<Tooltip key={userId}>
														<TooltipTrigger>
															<div
																className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br ${colors[i % colors.length]} border-2 border-background flex items-center justify-center text-white text-xs font-bold hover:scale-110 hover:z-10 transition-transform cursor-pointer`}
															>
																{userName}
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-xs">User {userName}</p>
														</TooltipContent>
													</Tooltip>
												);
											})}
										</OverflowContainer>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-semibold mb-2">Code</h3>
									<CodeBlock code={codeExamples.avatars} id="avatars" />
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Features */}
			<section className="py-8 px-6 border-t border-border">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-3 gap-8 text-center">
						<div className="space-y-1">
							<div className="text-3xl font-bold">{"<2kb"}</div>
							<div className="text-xs text-muted-foreground">
								Tiny bundle size
							</div>
						</div>
						<div className="space-y-1">
							<div className="text-3xl font-bold">Zero</div>
							<div className="text-xs text-muted-foreground">Dependencies</div>
						</div>
						<div className="space-y-1">
							<div className="text-3xl font-bold">TS</div>
							<div className="text-xs text-muted-foreground">
								TypeScript native
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Install */}
			<section className="py-8 px-6">
				<div className="max-w-2xl mx-auto text-center">
					<div className="flex items-center justify-center gap-2">
						<code className="px-4 py-2 bg-muted rounded-lg text-sm font-mono">
							npm install overflwn
						</code>
						<Button
							variant="outline"
							size="sm"
							onClick={() => copy("npm install overflwn", "install")}
						>
							{copied === "install" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-6 px-6 border-t border-border text-center text-xs text-muted-foreground">
				<a
					href="https://github.com/Insiderto/overflwn/blob/master/LICENSE"
					className="hover:text-foreground transition-colors"
				>
					MIT License
				</a>
				{" · "}
				<a
					href="https://github.com/Insiderto/overflwn"
					className="hover:text-foreground transition-colors"
				>
					GitHub
				</a>
				{" · "}
				Made by Rafael Kamaltinov
			</footer>
		</div>
	);
}

export default App;
