import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
	name: "ndscript",
	aliases: ["nds"],
	description: "Run NDScript against NationDex data.",
	usage: "<script lines>",
	type: "messageCreate",
	code: `
  $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];
    $err[You need **Manage Server** permissions to use NDScript.]
  ]

  $let[args;$trim[$removeCommandTrigger]]
  $onlyIf[$get[args]!=;
    $err[Usage: $get[prefix]ndscript <script lines>]
  ]

  $jsonLoad[result;$runNDScript[$get[args]]]
  $let[output;$if[$env[result;success];$arrayJoin[$env[result;logs];\\n];$env[result;error]]]

  $sendMessage[$channelID;
    $disableAllMentions
    $reply
    $addContainer[
      $addTextDisplay[$cropText[$get[output];0;3900]]
    ;$if[$env[result;success];#57F287;#ED4245]]
  ]
  `,
});
