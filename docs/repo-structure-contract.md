# Repo structure contract

Status: Active

## Canonical contract sources

1. `OliverCode/docs/RULES.md` ("Project structure")
2. `OliverCode/docs/CONTRACT.md`

## Profile

This repo uses the GitHub Project backlog profile. Its backlog is the GitHub Project named
in `docs/backlog-config.json`, read and written by the `backlog` skill.

## Required structure

1. Root docs:
- `README.md`
- `CLAUDE.md`
- `docs/repo-structure-contract.md`
2. Backlog:
- `docs/backlog-config.json` — the `backlog` skill's config for this repo's Project

## Backlog and evidence paths

1. Active backlog source: the GitHub Project named in `docs/backlog-config.json`
2. Story catalog source: the GitHub Project's issue list
3. Acceptance test matrix source: `N/A (each issue carries AC/test evidence directly)`

## Branches

This repo works on `main`.

## Enforcement

1. `bash scripts/validate.sh`, which runs the parser tests with the Node built-in runner
2. `.githooks/pre-commit` runs that command before every commit, and `.githooks/commit-msg` requires a story number

## Contract exceptions

- hooks: the repo is one 1,137-line HTML file, and the template's 578-line pre-commit gate suite would be larger than the app. Its own pre-commit runs the tests and the shared commit-msg hook runs unchanged. Expires 2027-05-11
- managed-files: the shared scaffold (quality baseline, structure check, size and duplication scripts, workflow) is not installed, for the same reason. Expires 2027-05-11
- size: no size baseline, because the repo has one app file and the audit's own size check reports it. Expires 2027-05-11
