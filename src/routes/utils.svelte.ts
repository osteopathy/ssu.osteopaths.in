import { getContext, setContext } from "svelte";

let loggedKey = Symbol("is-logged-in");

export function setIsLoggedIn(value: boolean): void {
	setContext(loggedKey, value);
}

export function isLoggedIn(): boolean {
	return getContext(loggedKey) as boolean;
}
