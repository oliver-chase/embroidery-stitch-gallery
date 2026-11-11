# Stitch Gallery agent rules

Global rules in `~/.claude/CLAUDE.md` apply. Repo specifics:

- The app is one file, `stitch-gallery.html`, with inline CSS and JavaScript, no build step and no external library. A change keeps it that way
- The live backlog is the `embroidery-stitch-gallery` GitHub Project (`oliver-chase`, Project 22), named in `docs/backlog-config.json`. File and groom it with the `backlog` skill
- Run `bash scripts/validate.sh` before commit. It runs the parser tests with the Node built-in runner and needs no install
- Stories closed as not planned stay closed unless the owner reopens them: EXP, JEF, VP3, HUS and XXX parsers, zip browsing, fabric rendering, quality checks, phone layout, format conversion, USB copy and the mm and inch toggle
