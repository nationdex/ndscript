export class NDScriptError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NDScriptError";
	}
}
