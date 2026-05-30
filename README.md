# NDScript

NDScript is a ForgeScript extra for [Project NationDex 2026](https://github.com/nationdex/bot). It provides a small DSL for administrators and developers to perform runtime operations on NationDex data using a clean scripting syntax.

Inspired by DexScript, NDScript integrates with NationDex through ForgeDB (`nationsData`) and the standard PND26 extra loader.

---

## Installation

1. Build this package:

```bash
npm install
npm run build
```

2. Register it in the NationDex bot (`src/config/extra.ts`):

```ts
export const extras: NationDexExtra[] = [
  {
    name: 'NDScript',
    location: 'file:../ndscript',
    path: 'dist',
    enabled: true,
  },
];
```

For a published package, use a GitHub or npm location instead of `file:`.

3. Install and start the bot:

```bash
npm run extras
npm run dev
```

---

## Usage

### Slash command

`/ndscript script:<lines>`

Requires **Manage Server** permission. Output is ephemeral.

### Prefix command

```
ndscript UPDATE > COUNTRY > India > RARITY > 0.2
```

Alias: `nds`

---

## Example Syntax

```ndscript
UPDATE > COUNTRY > India > RARITY > 0.2
```

```ndscript
CREATE > COUNTRY > Atlantis
```

```ndscript
DELETE > COUNTRY > France
```

```ndscript
VIEW > COUNTRY > Germany
```

```ndscript
LET rare = 0.2
UPDATE > COUNTRY > India > RARITY > $rare
```

```ndscript
IF true
UPDATE > COUNTRY > India > RARITY > 0.2
ENDIF
```

```ndscript
FILTER > COUNTRY > RARITY > 0.2
```

```ndscript
SAVE event1 = UPDATE > COUNTRY > India > RARITY > 0.2
RUN event1
```

---

## Supported models

| NDScript model | NationDex target |
|----------------|------------------|
| `COUNTRY` / `NATION` | Entries in `nationsData.nations` |
| Property aliases | `RARITY`, `CLASS`, `NAME`, `ATTACK`, `HEALTH`, etc. |

Saved scripts persist in the `ndscript` global variable.

---

## Project structure

```txt
src/
├── lib/                 NDScript parser and NationDex data layer
├── functions/           ForgeScript bridge ($runNDScript)
├── commands/prefix/     Prefix command
└── slash/ndscript/      Slash command
dist/                    Compiled extra (loaded by PND26)
variables.json           Default ForgeDB keys for saved scripts
```

---

## Development

```bash
npm run build
npm run typecheck
npm run check
```

---

## License

MIT License
