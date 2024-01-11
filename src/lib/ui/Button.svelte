<script context="module">
  import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none [-webkit-tap-highlight-color:transparent;]",
	variants: {
		variant: {
			default:
				"bg-layer-12 text-layer-0 hover:bg-layer-12/90",
			destructive:
				"bg-rose-500/10 text-rose-600 hover:bg-rose-500/15",
			outline: "border border-layer-5 bg-transparent shadow-sm text-layer-13 hover:bg-layer-2",
			secondary:"bg-layer-3 text-layer-12 hover:bg-layer-3/70",
			ghost: "hover:bg-layer-3 hover:text-layer-12",
			link: "text-layer-11 underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];
</script>

<script lang="ts">
	import { type Snippet } from "svelte"
  import { type HTMLButtonAttributes } from 'svelte/elements';

  type Props = HTMLButtonAttributes & {
    children:Snippet;
    variant?: Variant;
    size?: Size;
  }
	let { children, ...props } = $props<Props>();
</script>

<button type="button" {...props}>
	{@render children()}
</button>
