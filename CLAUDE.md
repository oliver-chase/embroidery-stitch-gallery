# Stitch Gallery agent rules

Global rules in `~/.claude/CLAUDE.md` apply. Repo specifics:

- The app is one file, `stitch-gallery.html`, with inline CSS and JavaScript, no build step and no external library. A change keeps it that way
- The live backlog is the GitHub Project that `docs/backlog-config.json` names. File and groom it with the `backlog` skill
- The pre-commit hook runs `bash scripts/validate.sh`, the parser tests, which need no install
- Stories closed as not planned stay closed unless the owner reopens them: EXP, JEF, VP3, HUS and XXX parsers, zip browsing, fabric rendering, quality checks, format conversion, USB copy and the mm and inch toggle
