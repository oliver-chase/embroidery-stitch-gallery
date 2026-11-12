# HoopView

Embroidery files contain the actual stitch design, but your computer usually shows them as generic file icons. A folder with hundreds of `.dst` or `.pes` files gives you no way to see what each design looks like.

**HoopView turns that folder into a visual gallery.** It reads the stitch data directly in your browser and shows real previews, organized using the same folder structure already on your computer.

You install nothing, run no server and upload no file. The entire application is one HTML file, and embroidery files are parsed in memory on your computer.

HoopView is a viewer. It has no accounts and never modifies your files, and the few things it keeps in your browser are listed under "What it remembers".

## What you can do

### Browse your existing folders

The sidebar mirrors your actual folder structure. Expand and collapse folders, see how many designs each contains, and move through the hierarchy without reorganizing your files.

Click a folder in the sidebar or a folder tile in the grid to open it. Breadcrumbs let you jump back to any parent folder. On a window 700 pixels wide or narrower, such as a phone, the folder list opens from the **Folders** button and closes when you pick a folder.

### See the actual designs

HoopView draws the **real needle path** from each embroidery file.

It handles jump and trim stitches so each design renders as separate stitch paths.

For `.pes` files, it also reads the embedded thread colors and uses those colors in the preview. `.dst` files contain no color information, so each color block gets a stand-in thread color that you can recolor.

### Step through a folder

With a design open, press the left and right arrow keys to move to the previous or next design in the folder, and Esc to close. The arrows pause while the slider, speed menu or a text field has focus, since those use the arrow keys too.

### Watch it sew

Open a design and press **Play** to watch it stitch in order, as the machine would. Drag the slider to jump to any point, and pick 1x to 20x speed. The finished color blocks dim, the current block stays bold with a dot at the needle, and a line under the slider tells you which color block and stitch you are on.

### Recolor a design

Open a design and click a colored dot under the slider to choose a color block. Then click a thread from the palette, or use **Custom** to pick any color. This is the quickest way to give a `.dst` design real colors. **Reset colors** puts the original colors back.

Tick **Show jumps** to draw the travel moves between stitch runs as dashed red lines. Recolors work during playback.

Recoloring changes only how HoopView draws the design. Your `.dst` and `.pes` files are never modified, and the new colors are forgotten when you close the preview. To get a recolored design into a stitch file, change the thread in your embroidery software.

### What it remembers

HoopView keeps nothing of yours: no accounts, no favorites, no tags and no saved recolors.

For speed it keeps four small things in your browser, and losing any of them costs nothing:

* each design's thumbnail and size
* the last folder you opened
* your sort choice
* your machine speed for run-time estimates

**Clear cache** in the header removes the thumbnails and the last folder. Clearing your browser's site data removes all four, and HoopView works as before the next time you open a folder.

### Check a design's details

Click a design to see its stitch count, color changes, number of thread colors, jumps, size in millimeters, thread length and an estimated run time.

* **Run time** is the stitch count at your machine speed, plus 20 seconds for each color change. The default is 1,000 stitches per minute. Change **Machine speed** under the preview and HoopView remembers it
* **Thread length** counts real stitches and leaves out the travel between sections
* `.dst` files have color-change codes but no thread colors, so Colors reads "not in file"
* Trims are not counted separately yet, so run time can read a few seconds short for designs with many trims

### Sort a folder

Use the **Sort** menu above the grid to order designs by name, largest or smallest file, or newest or oldest. It applies to folders and search results, and HoopView remembers your choice. Name sorting puts `Flower_2` before `Flower_10`.

File size and date come from the file listing, so sorting works on cloud-only files without downloading them. While you sort by size or date, each card also shows its file size and date. A file whose details cannot be read sorts last.

### Find a design fast

Type in the search box (or press `/`) to search every folder at once. Every word you type must appear in the file name or its folder path. Each result shows its folder, and clicking the folder opens it. Press `Esc` to clear the search.

### Pick up where you left off

In Chrome and Edge, HoopView remembers the last folder you opened. Next time, click **Reopen** on the start screen and approve read access.

Each design's thumbnail and size are cached in your browser, so a folder you have already viewed appears without reading any files.

### Keep everything local

Nothing is uploaded anywhere. Stitch data is read and rendered in your browser, in memory.

HoopView also handles cloud-backed folders. It reads only the file names while it scans, and it reads a design's contents only when that design's card comes near the screen. If a file in OneDrive, iCloud, or Dropbox has not been downloaded to your computer, opening it can trigger a download. It waits up to 30 seconds for each file and draws four cards at a time (a size or date sort reads 12 file sizes at a time). A file that has not arrived by then is marked **cloud-only**, and the rest of the page keeps working. The first time you open a large cloud-only folder, thumbnails appear as the files finish downloading.

The folder structure is scanned once when you open it, so moving between folders afterward is fast.

---

## Usage

1. Download `hoopview.html` from [the repository](https://github.com/oliver-chase/hoopview/blob/main/hoopview.html) with the Download raw file button.
2. Open it in **Chrome or Edge**, which have the best folder support.
3. Click **Choose Folder…** and select your top-level embroidery folder, or drag the folder onto the page.
4. Browse the folder tree or folder tiles. Click a design to see a larger preview.

If your embroidery files are stored in the cloud, make the folder available offline first. For example, in OneDrive, right-click the folder and choose **Always keep on this device**.

---

## Supported formats

| Format | Support                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `.dst` | Tajima commercial format. Stitch data is supported; the format does not contain thread colors, so previews use stand-in colors. |
| `.pes` | Brother / Babylock format. Embedded thread colors are read from the standard PEC thread palette.                             |

Files in eleven more formats appear with a **can't preview** placeholder and a "preview not supported yet" note: `.jef`, `.exp`, `.vp3`, `.hus`, `.xxx`, `.sew`, `.pec`, `.vip`, `.shv`, `.pcs` and `.emd`. Other file types are left out.

---

## How it works

Everything runs from a single HTML file with inline CSS and JavaScript. There is no server, build process, or external library.

* A hand-written binary parser reads DST and PEC/PES stitch data directly
* A folder-tree model preserves the real folder structure
* The File System Access API reads folder and file names without immediately reading every file's contents. Stitch data is read only when needed, which prevents cloud-backed folders from stalling during the initial scan
* Each design is drawn to an HTML canvas, scaled to fit the preview, and colored using its embedded thread palette when one is available, or stand-in colors when it has none
* Cards render only near the visible part of the page. Cards that scroll far away release their canvas, so a folder of thousands of designs stays light
* Drag-and-drop provides a fallback when live folder access is unavailable

---

## Known limits

* Folder selection works best in Chromium-based browsers such as Chrome and Edge
* Firefox and Safari fall back to a standard file picker and do not provide the same live folder-tree access. They have not been tested

The result is a simple workflow: **point HoopView at an existing embroidery folder, and immediately see the designs inside it without changing, uploading, or reorganizing your files.**

---

## Tests

HoopView needs nothing installed. The tests are for anyone changing the file readers. They use the test runner built into Node, so install Node 18 or newer from nodejs.org first. They need no packages.

```bash
bash scripts/validate.sh
```

After cloning, run `git config core.hooksPath .githooks` once, so the pre-commit hook runs these tests before every commit. Each commit message also needs a story number, such as `(#53)`.

The tests load the readers straight out of `hoopview.html` and check them against sample designs they build from known stitches, so they contain no one's real designs. They cover stitch positions, jumps, color changes, the thread palette, the flipped DST axis and the coordinate limits of both formats.

---

## More documents

* [Catalog](docs/CATALOG.md) lists the scripts and config files and what each does
* [Sharing](docs/SHARING.md) records whether the repo is meant to be shared and what is still open
* [Structure contract](docs/repo-structure-contract.md) records how this repo follows OliverCode and where it differs on purpose
* [Backlog config](docs/backlog-config.json) names the owner's GitHub Project and is not needed to use HoopView

### Folders

* `scripts/` holds the validation command
* `tests/` holds the parser tests
* `.githooks/` holds the commit hooks
* `docs/` holds the catalog, sharing record, structure contract, accepted audit rows, audit ledger and backlog config
