import { getContext, setContext } from "svelte";

let userKey = Symbol("is-current-user");

export function setIsCurrentUser(value: boolean): void {
	setContext(userKey, value);
}

export function isCurrentUser(): boolean {
	return getContext(userKey) as boolean;
}
