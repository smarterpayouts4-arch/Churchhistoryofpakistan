# Triple-check content report — 2026-09-23

## Caption restores

The four Family Archive `caption` fields below now match the verbatim caption text in `reference/facebook-page/INVENTORY.md`. Editorial context, references, and press framing remain in their separate fields.

| ID | Before SHA-256 | After SHA-256 | Short diff |
|---|---|---|---|
| `fb-bashir-jewan-hyderabad-1980` | `fb7514dccc350c57dbb6ba36bd6f5a6b0ffd479a028d7e65700cfd812a47291f` | `1cb9bc8b9b0846454809389e044c34893b6a84a163494039e320726277fd6254` | Removed appended summary/transcription note; restored full inventory close including Kaleem John / Deputy Moderator / Senior Bishops wording. |
| `fb-mrs-samuel-pervaiz` | `031cf050756fe24ee0b06d620fe61b8c39959cbc4d5c230d422ba4dbbbfdea7f` | `834c6e437c708e37f5f6fee5448bbd2bbf4e38646a4bd29df12d5665168f687a` | Restored exact spacing, service wording, Hunter Memorial detail, Matriculation wording, and closing appreciation. |
| `fb-bishops-couple` | `968f77352787d55bb0d495f1312f76b310ed88ffd62e847a7c07ae351d728287` | `4bbadd614adc09a06d6dd59c87daa63047626891a851f0bdd892a70c00c777a9` | Replaced condensed constitutional summary with the full inventory caption, including numbered reform/reorganisation sections. |
| `fb-sewak-bm-augustine` | `60889eab804fdb7d2596092ab193548b753d0100ef8e4c78d2118b4fb40e6467` | `e9c13162659c4e77559ce33848d51b81c5687f336603667bbb55e829b3426eb5` | Replaced paraphrased summary with exact death-anniversary, rest-in-peace, family, and Christ Church wording. |

## Sources and attribution fixes

- Marked `https://copldc.org/about-us/` as **URL unreachable as of 2026-09-23** in the live Sources register; no replacement URL was invented or confirmed.
- The Lahore 1887 homepage timeline entry now attributes the statement to the Diocese of Lahore source, states that the URL is unreachable, and routes its Source link to `/sources` rather than exposing a dead homepage link.
- Replaced the Sources-page phrase “public display name pending confirmation” with the confirmed public name **Javed Qadir Bakhsh**.
- Labeled the homepage Executive Committee and father/Moderator connection copy as curator-provided CMS copy so it is not presented as an uncited institutional source.

## CSS / blockers

- No interview `max-height: 520px` rule was present in `src/components/home/Home.module.css`; no design-owned CSS was changed.
- Remaining content blockers: the Lahore source still needs a curator-confirmed replacement URL; permission-needed cathedral placeholders remain intentionally unchanged; production auth/security, contribution/legal setup, and other audit handoff items remain outside this content pass.
