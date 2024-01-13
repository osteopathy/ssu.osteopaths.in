import type { SVGAttributes } from 'svelte/elements';

export type Attrs = SVGAttributes<SVGSVGElement>;

export interface IconProps extends Attrs {
  class?: string;
}
