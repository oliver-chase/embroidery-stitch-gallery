# Stitch Gallery

Embroidery files contain the actual stitch design, but your computer usually shows them as generic file icons. A folder with hundreds of `.dst` or `.pes` files gives you no way to see what each design looks like.

**Stitch Gallery turns that folder into a visual gallery.** It reads the stitch data directly in your browser and shows real previews, organized using the same folder structure already on your computer.

There is nothing to install, no server to run, and no file upload. The entire application is one HTML file, and embroidery files are parsed in memory on your computer.

## What you can do

### Browse your existing folders

The sidebar mirrors your actual folder structure. Expand and collapse folders, see how many designs each contains, and move through the hierarchy without reorganizing your files.

Click a folder in the sidebar or a folder tile in the grid to open it. Breadcrumbs let you jump back to any parent folder.

### See the actual designs

Stitch Gallery draws the **real needle path** from each embroidery file instead of showing a generic icon.

It handles jump and trim stitches so designs render as separate stitch paths instead of looking like tangled lines.

For `.pes` files, it also reads the embedded thread colors and uses those colors in the preview. `.dst` files do not contain color information, so each color block gets a stand-in thread color. Those colors are placeholders, not the real thread.

### Step through a folder

With a design open, press the left and right arrow keys to move to the previous or next design in the folder, and Esc to close. The arrows pause while the slider, speed menu or a text field has focus, since those use the arrow keys too.

### Watch it sew

Open a design and press **Play** to watch it stitch in order, as the machine would. Drag the slider to jump to any point, and pick 1x to 20x speed. The finished color blocks dim, the current block stays bold with a dot at the needle, and a line under the slider tells you which color block and stitch you are on.

### Recolor a design

Open a design and click a colored dot under the slider to choose a color block. Then click a thread from the palette, or use **Custom** to pick any color. This is the quickest way to give a `.dst` design real colors. **Reset colours** puts the original colors back.

Tick **Show jumps** to draw the travel moves between stitch runs as dashed red lines. Recolors work during playback and are saved with the design, so the grid thumbnail and the preview show them after a reload.

Recoloring changes only how the gallery draws the design. Your `.dst` and `.pes` files are never modified, and the new colors are stored in your browser. To get a recolored design into a stitch file, change the thread in your embroidery software.

### Favorite designs

Click the star on a card, or in the preview, to favorite a design. The **Favorites** row in the sidebar shows every favorite from all folders, with a count.

Favorites and recolors are stored in your browser, keyed by file path and file size. They come back when you reopen the page in the same browser and link the same folder. They are lost if you clear site data, use a private window, open the gallery in another browser, or move the HTML file. **Clear cache** leaves them alone. A file replaced by one of a different size starts clean.

The gallery says this in the sidebar, and shows a one-time message the first time you save something. If your browser cannot store data at all (a private window, for example), the sidebar says so and the message tells you the change lasts only until you close the page. Nothing is blocked either way.

### Check a design's details

Click a design to see its stitch count, color changes, number of thread colors, jumps, size in millimeters, thread length and an estimated run time.

* **Run time** is the stitch count at your machine speed, plus 20 seconds for each color change. The default is 1,000 stitches per minute. Change **Machine speed** under the preview and the gallery remembers it.
* **Thread length** counts only real stitches, not the travel between sections.
* `.dst` files have color-change codes but no thread colors, so Colors reads "not in file".
* Trims are not counted separately yet, so run time can read a few seconds short for designs with many trims.

### Sort a folder

Use the **Sort** menu above the grid to order designs by name, largest or smallest file, or newest or oldest. It applies to folders, search results and Favorites, and the gallery remembers your choice. Name sorting puts `Flower_2` before `Flower_10`.

File size and date come from the file listing, so sorting works on cloud-only files without downloading them. While you sort by size or date, each card also shows its file size and date. A file whose details cannot be read sorts last.

### Find a design fast

Type in the search box (or press `/`) to search every folder at once. Every word you type must appear in the file name or its folder path. Each result shows its folder, and clicking the folder opens it. Press `Esc` to clear the search.

### Pick up where you left off

In Chrome and Edge, the gallery remembers the last folder you opened. Next time, click **Reopen** on the start screen and approve read access.

Each design's thumbnail and size are cached in your browser, so a folder you have already viewed appears without reading any files. The cache lives in your browser only. **Clear cache** in the header removes it and the remembered folder.

### Keep everything local

Nothing is uploaded anywhere. Stitch data is read and rendered in your browser, in memory.

Stitch Gallery also handles cloud-backed folders. The gallery reads only the file names while it scans, and it reads a design's contents only when that design's card comes near the screen. If a file in OneDrive, iCloud, or Dropbox has not been downloaded to your computer, opening it can trigger a download. The gallery waits up to 30 seconds for each file and works on four at a time. A file that has not arrived by then is marked **cloud-only**, and the rest of the page keeps working. The first time you open a large cloud-only folder, thumbnails appear as the files finish downloading.

The folder structure is scanned once when you open it, so moving between folders afterward is fast.

---

## Usage

1. Download `stitch-gallery.html`.
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

These formats are listed with a "preview not supported yet" note and can still be favorited, but not previewed: `.jef`, `.exp`, `.vp3`, `.hus`, `.xxx`, `.sew`, `.pec`, `.vip`, `.shv`, `.pcs` and `.emd`.

Unsupported files still appear in the gallery, but show a **can't preview** placeholder.

---

## How it works

Everything runs from a single HTML file with inline CSS and JavaScript. There is no server, build process, or external library.

* A hand-written binary parser reads DST and PEC/PES stitch data directly.
* A folder-tree model preserves the real folder structure.
* The File System Access API reads folder and file names without immediately reading every file's contents. Stitch data is read only when needed, which prevents cloud-backed folders from stalling during the initial scan.
* Each design is drawn to an HTML canvas, scaled to fit the preview, and colored using its embedded thread palette when one is available, or stand-in colors when it has none.
* Cards render only near the visible part of the page. Cards that scroll far away release their canvas, so a folder of thousands of designs stays light.
* Drag-and-drop provides a fallback when live folder access is unavailable.

---

## Known limits

* Only `.dst` and `.pes` files are currently parsed.
* Thread colors require a `.pes` file with an embedded color table.
* `.dst` colors are placeholders, because DST contains no color data.
* Folder selection works best in Chromium-based browsers such as Chrome and Edge.
* Firefox and Safari fall back to a standard file picker and do not provide the same live folder-tree access. They have not been tested.

The result is a simple workflow: **point Stitch Gallery at an existing embroidery folder, and immediately see the designs inside it without changing, uploading, or reorganizing your files.**

---

## Tests

The gallery needs nothing installed. The tests are for anyone changing the file readers. They use the test runner built into Node (18 or newer; run here on Node 24) and need no packages.

```bash
node --test tests/*.test.mjs
```

The tests load the readers straight out of `stitch-gallery.html` and check them against small sample files in `tests/fixtures`. The samples are built from known stitches, so they contain no one's real designs. They cover stitch positions, jumps, color changes, the thread palette, the flipped DST axis and the size limits of both formats. `node tests/make-fixtures.mjs` rebuilds the sample files.

To check a real folder, run the same readers over it:

```bash
node tests/audit-library.mjs "/path/to/embroidery folder"
```

It lists files that fail to read, come out empty or measure over a metre. It skips cloud-only files, so it never downloads anything.
