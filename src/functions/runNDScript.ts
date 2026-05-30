import {
	ArgType,
	ForgeFunction,
	FunctionManager,
	NativeFunction,
} from "@tryforge/forgescript";
import { NDScriptParser } from "../lib/parser";

FunctionManager.add(
	new NativeFunction({
		name: "$runNDScript",
		description: "Executes NDScript against NationDex data and returns JSON output.",
		output: ArgType.Json,
		unwrap: true,
		brackets: true,
		args: [
			{
				name: "code",
				description: "The NDScript source to execute.",
				type: ArgType.String,
				required: true,
				rest: false,
			},
		],
		async execute(_ctx, [code]) {
			const parser = new NDScriptParser();
			const result = await parser.execute(code);
			return this.successJSON(result);
		},
	}),
);

export default new ForgeFunction({
	name: "runNDScript",
	params: [
		{
			name: "code",
			type: "String",
			required: true,
		},
	],
	code: `
  $return[$runNDScript[$env[code]]]
  `,
});
