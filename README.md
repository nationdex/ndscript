# NDScript

NDScript is a modern DSL (Domain Specific Language) package for NationDex built with TypeScript and ForgeScript.

Inspired by DexScript, NDScript allows administrators and developers to easily perform runtime operations on countries, regimes, specials, rarities, and more using a clean scripting syntax.

---

## Features

- UPDATE commands
- CREATE commands
- DELETE commands
- VIEW commands
- FILTER commands
- Variables
- Conditions
- Saved scripts
- Runtime logging
- Type parsing
- Installer system
- Error handling
- Recursive execution protection

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

---

## Variables

```ndscript
LET rare = 0.2

UPDATE > COUNTRY > India > RARITY > $rare
```

---

## Conditions

```ndscript
IF true

UPDATE > COUNTRY > India > RARITY > 0.2

ENDIF
```

---

## Filters

```ndscript
FILTER > COUNTRY > RARITY > 0.2
```

---

## Saved Scripts

```ndscript
SAVE event1 = UPDATE > COUNTRY > India > RARITY > 0.2

RUN event1
```

---

## Installation

NDScript includes a built-in installer runtime.

Installer path:

```txt
NDScript/installer/installer.ts
```

---

## Project Structure

```txt
NDScript/
└── package/
    ├── commands/
    │   ├── filter.ts
    │   └── global.ts
    │
    ├── parser/
    │   └── parser.ts
    │
    ├── runtime/
    │   └── context.ts
    │
    ├── utils/
    │   ├── errors.ts
    │   └── types.ts
    │
    └── index.ts
```

---

## Runtime Example

```ts
import { NDScriptParser } from "./package"

const parser = new NDScriptParser()

await parser.execute(`
LET rare = 0.2

UPDATE > COUNTRY > India > RARITY > $rare
`)
```

---

## Current Status

NDScript is currently in active development.

Current version:
```txt
v0.1.0-alpha
```

---

## Goals

- Full NationDex integration
- ForgeScript command support
- Mass operations
- Advanced filters
- Runtime permissions
- Script files
- Database execution
- Discord installer UI

---

## License

MIT License

---

## Credits

- Inspired by DexScript
- Built for NationDex
- Developed with TypeScript + ForgeScript
