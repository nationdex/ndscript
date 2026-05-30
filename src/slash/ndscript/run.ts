import { ApplicationCommand } from "@tryforge/forgescript";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
} from "discord.js";

export default new ApplicationCommand({
	data: {
		type: ApplicationCommandType.ChatInput,
		name: "ndscript",
		description: "Run NDScript against NationDex data.",
		integration_types: [ApplicationIntegrationType.GuildInstall],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: "script",
				description: "NDScript lines to execute.",
				required: true,
			},
		],
	},
	code: `
  $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];
    $err[You need **Manage Server** permissions to use NDScript.;true]
  ]

  $let[script;$option[script]]
  $jsonLoad[result;$runNDScript[$get[script]]]
  $let[output;$if[$env[result;success];$arrayJoin[$env[result;logs];\\n];$env[result;error]]]

  $interactionReply[
    $ephemeral
    $addContainer[
      $addTextDisplay[$cropText[$get[output];0;3900]]
    ;$if[$env[result;success];#57F287;#ED4245]]
  ]
  `,
});
