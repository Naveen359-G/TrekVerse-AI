---
name: pnpm audit behavior
description: Non-obvious audit behavior when checking nested manifests in this workspace.
---

Running `pnpm audit --fix` from nested directories, including unused skill template directories, audits the ancestor workspace lockfile and writes overrides to the shared workspace configuration. Its success message may say overrides were added to package.json even when that file is unchanged. It can also remove configuration comments while rewriting YAML.

**Why:** Observed while auditing every manifest independently; repeated identical output did not represent separate dependency graphs or separate fixes.

**How to apply:** Still enumerate manifests with a pruned filesystem walk. Identify the actual lockfile owner for each one, inspect the resulting configuration diff, retain supply-chain safeguards and useful comments, and check direct declarations as well as the resolved lockfile.
