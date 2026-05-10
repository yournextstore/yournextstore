#!/bin/bash
set -euo pipefail

#
# Theme Generator Script
# Iterates through reference design images in IMAGES_DIR. For each image:
#   1. Claude vision analyzes the image -> JSON (brand, palette, sections, image prompts)
#   2. fal.ai generates fresh high-quality theme images from those prompts
#   3. SVG backgrounds are generated from the extracted palette
#   4. Claude Code redesigns the storefront on a new theme-N branch
#

# ── Configuration ──────────────────────────────────────────────
IMAGES_DIR="/Users/jordan/Desktop/YourNextStore/yournextstore/store images"
PROJECT_DIR="/Users/jordan/Desktop/YourNextStore/yournextstore"
SCRATCH_DIR="/Users/jordan/Desktop/YourNextStore/.theme-scratch"
FAL_MODEL="fal-ai/flux-pro/v1.1-ultra"
MAX_IMAGES=6

# ── Preflight checks ──────────────────────────────────────────
if [[ -z "${FAL_KEY:-}" ]]; then
  echo "ERROR: FAL_KEY is not set."
  echo "Export it: export FAL_KEY=..."
  exit 1
fi

if ! command -v claude &>/dev/null; then
  echo "ERROR: claude CLI not found in PATH."
  exit 1
fi

mkdir -p "$SCRATCH_DIR"

# ── Helper: analyze a reference image with Claude vision ───────
analyze_image() {
  local img="$1"
  local out="$2"

  echo "  Analyzing reference image with Claude vision..."

  CLAUDECODE= claude -p --model sonnet --output-format text \
    "Look at the attached design reference image at this absolute path: ${img}
Use the Read tool on that path to view it.

Return ONLY a single valid JSON object (no prose, no markdown fences, no commentary). Use this exact shape:
{
  \"brand_name\": string,
  \"industry\": string,
  \"vibe\": string,
  \"palette\": string[],
  \"heading_font_suggestion\": string,
  \"body_font_suggestion\": string,
  \"sections\": string[],
  \"image_prompts\": string[]
}

Constraints:
- palette: 4-6 hex codes that match the reference image's actual colors.
- sections: top-to-bottom layout description, e.g. 'announcement bar', 'sticky nav with centered logo', 'hero with left text + right product photo', 'three-column feature row', etc.
- image_prompts: EXACTLY 6 vivid text-to-image prompts for FLUX, suitable for hero banners / collection cards / promo tiles that match this brand. Focus on lighting, composition, materials, environment, color palette. Avoid specific human faces. Each prompt should be a single dense paragraph." \
    > "${out}.raw" 2>/dev/null || true

  python3 - <<PYEOF
import json, re, sys
try:
    raw = open("${out}.raw").read()
except Exception:
    raw = ""
m = re.search(r"\{.*\}", raw, re.S)
data = {}
if m:
    try:
        data = json.loads(m.group(0))
    except Exception:
        data = {}
if not data:
    data = {
        "brand_name": "Your Next Store",
        "industry": "general",
        "vibe": "modern, clean, editorial",
        "palette": ["#0f172a", "#1e293b", "#64748b", "#f1f5f9"],
        "heading_font_suggestion": "Inter",
        "body_font_suggestion": "Inter",
        "sections": ["announcement bar", "sticky nav", "hero", "product grid", "footer"],
        "image_prompts": [
            "Editorial commercial product photography, soft studio lighting, neutral backdrop, premium feel",
            "Lifestyle hero scene, golden hour lighting, shallow depth of field, modern minimal composition",
            "Flat lay arrangement of premium goods on natural texture, top-down, soft shadows",
            "Abstract gradient background, smooth color transitions, subtle grain, contemporary aesthetic",
            "Architectural interior with warm natural light streaming through large windows, minimalist styling",
            "Macro close-up of premium material texture, dramatic lighting, high detail",
        ],
    }
json.dump(data, open("${out}", "w"), indent=2)
print("  Brand:", data.get("brand_name", "?"))
print("  Industry:", data.get("industry", "?"))
print("  Palette:", ", ".join(data.get("palette", [])[:6]))
print("  Sections:", len(data.get("sections", [])))
print("  Image prompts:", len(data.get("image_prompts", [])))
PYEOF
}

# ── Helper: generate themed images with fal.ai (text-to-image) ──
generate_themed_images() {
  local analysis_file="$1"
  local target_dir="$2"

  mkdir -p "$target_dir"
  rm -f "${target_dir}"/scraped-*.png "${target_dir}"/scraped-*.jpg "${target_dir}"/scraped-*.webp "${target_dir}"/hero-bg-*.svg 2>/dev/null || true

  # Pull the prompt list out as a TSV (one prompt per line) for safe iteration
  local prompts_file="${SCRATCH_DIR}/_prompts.txt"
  python3 - <<PYEOF > "$prompts_file"
import json
with open("${analysis_file}") as f:
    data = json.load(f)
for p in (data.get("image_prompts") or [])[:${MAX_IMAGES}]:
    print(p.replace("\n", " ").strip())
PYEOF

  local count=0
  while IFS= read -r prompt; do
    [[ -z "$prompt" ]] && continue
    [[ $count -ge $MAX_IMAGES ]] && break

    echo "  [$((count+1))] $(echo "$prompt" | cut -c1-90)..."

    local payload
    payload=$(python3 -c "
import json, sys
print(json.dumps({
    'prompt': sys.argv[1],
    'aspect_ratio': '16:9',
    'num_images': 1,
    'output_format': 'png',
    'safety_tolerance': '5',
    'enable_safety_checker': False,
}))
" "$prompt")

    local result
    result=$(curl -s --max-time 180 -X POST "https://fal.run/${FAL_MODEL}" \
      -H "Authorization: Key $FAL_KEY" \
      -H "Content-Type: application/json" \
      -d "$payload" 2>/dev/null || echo "{}")

    local gen_url
    gen_url=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin)['images'][0]['url'])" 2>/dev/null || echo "")

    if [[ -n "$gen_url" && "$gen_url" != "" ]]; then
      curl -sL --max-time 30 -o "${target_dir}/scraped-${count}.png" "$gen_url" 2>/dev/null || true
      local fsize
      fsize=$(stat -f%z "${target_dir}/scraped-${count}.png" 2>/dev/null || echo 0)
      if [[ "$fsize" -gt 1024 ]]; then
        echo "       [OK] Generated ($(( fsize / 1024 ))KB)"
        count=$((count + 1))
        continue
      fi
      rm -f "${target_dir}/scraped-${count}.png"
    fi

    echo "$result" | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    print('       [WARN]', d.get('detail', d.get('error', 'generation failed')))
except:
    print('       [WARN] generation failed')
" 2>/dev/null || true
    # Skip this index entirely on failure (no fallback). Bump count so filenames stay aligned with the prompt list.
    count=$((count + 1))
  done < "$prompts_file"

  local actual
  actual=$(ls -1 "${target_dir}"/scraped-*.png 2>/dev/null | wc -l | tr -d ' ')
  echo "  Total images written: ${actual}"
}

# ── Helper: generate abstract SVG backgrounds from palette ─────
generate_svg_backgrounds() {
  local target_dir="$1"
  local analysis_file="$2"

  echo "  Generating SVG backgrounds..."

  local colors
  colors=$(python3 -c "
import json
with open('${analysis_file}') as f:
    data = json.load(f)
palette = data.get('palette') or []
fallback = ['#1a1a2e', '#16213e', '#0f3460', '#e94560']
out = (palette + fallback)[:6]
print(json.dumps(out))
" 2>/dev/null || echo '["#1a1a2e","#16213e","#0f3460","#e94560"]')

  local c1 c2 c3 c4
  c1=$(echo "$colors" | python3 -c "import sys,json; c=json.load(sys.stdin); print(c[0] if len(c)>0 else '#1a1a2e')")
  c2=$(echo "$colors" | python3 -c "import sys,json; c=json.load(sys.stdin); print(c[1] if len(c)>1 else '#16213e')")
  c3=$(echo "$colors" | python3 -c "import sys,json; c=json.load(sys.stdin); print(c[2] if len(c)>2 else '#0f3460')")
  c4=$(echo "$colors" | python3 -c "import sys,json; c=json.load(sys.stdin); print(c[3] if len(c)>3 else '#e94560')")

  cat > "${target_dir}/hero-bg-1.svg" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="g2" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${c4}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1440" height="900" fill="url(#g1)"/>
  <circle cx="1000" cy="250" r="400" fill="url(#g2)"/>
  <ellipse cx="200" cy="700" rx="350" ry="250" fill="${c2}" opacity="0.15"/>
  <ellipse cx="1200" cy="650" rx="300" ry="200" fill="${c4}" opacity="0.1"/>
</svg>
SVGEOF

  cat > "${target_dir}/hero-bg-2.svg" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1440" height="600" fill="url(#bg2)"/>
  <g opacity="0.06" fill="none" stroke="${c4}" stroke-width="1">
    <circle cx="200" cy="150" r="120"/>
    <circle cx="400" cy="300" r="80"/>
    <circle cx="700" cy="100" r="160"/>
    <circle cx="1000" cy="400" r="100"/>
    <circle cx="1200" cy="200" r="140"/>
    <circle cx="600" cy="450" r="90"/>
  </g>
</svg>
SVGEOF

  cat > "${target_dir}/hero-bg-3.svg" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
  <rect width="1440" height="400" fill="${c1}"/>
  <path d="M0,200 C360,100 720,300 1080,150 C1260,75 1440,200 1440,200 L1440,400 L0,400 Z" fill="${c2}" opacity="0.3"/>
  <path d="M0,280 C240,200 480,320 720,250 C960,180 1200,300 1440,260 L1440,400 L0,400 Z" fill="${c3}" opacity="0.2"/>
</svg>
SVGEOF

  echo "  Created 3 SVG backgrounds (hero-bg-1.svg, hero-bg-2.svg, hero-bg-3.svg)"
}

# ── Helper: build the Claude prompt file ─────────────────────────
build_prompt_file() {
  local analysis_file="$1"
  local prompt_file="$2"
  local screenshot_path="$3"

  local site_name
  site_name=$(python3 -c "import json; print(json.load(open('$analysis_file')).get('brand_name','the reference brand'))" 2>/dev/null || echo "the reference brand")

  local img_list=""
  img_list=$(cd "$PROJECT_DIR/public" && ls -1 scraped-*.png hero-bg-*.svg 2>/dev/null | sort || echo "")

  cat > "$prompt_file" <<HEADER
FIRST: Look at the design reference image. Use the Read tool to view: ${screenshot_path}
This image shows the visual aesthetic, palette, and layout you should adapt for the storefront.

You are designing a Your Next Store theme inspired by this reference (visually similar to "${site_name}").
Our store name stays "Your Next Store" — never use the reference brand's name in the UI.

CRITICAL RULES:
- Match the reference image's visual design closely: layout structure, section order, spacing, typography style, color palette, and overall vibe.
- Study the reference carefully. Identify the sections from top to bottom and recreate each one in the same order.
- The store name MUST always be "Your Next Store" (or "YNS").
- The store description/tagline should match the reference's industry vibe.

AVAILABLE IMAGES IN public/:
${img_list}
Use these as "/<filename>" (e.g. "/scraped-0.png", "/hero-bg-1.svg").

IMAGE QUALITY STRATEGY — IMPORTANT:
- For HERO sections and FULL-WIDTH BANNERS: Prefer using CSS gradients, Tailwind gradient classes, or the SVG backgrounds (hero-bg-1.svg, hero-bg-2.svg, hero-bg-3.svg) as background images. You can also create inline SVGs directly in React components for custom abstract backgrounds. This ensures crisp, high-quality visuals at any resolution.
- For PRODUCT IMAGES: These come from Commerce Kit automatically — do NOT hardcode scraped images for products.
- For DECORATIVE SECTIONS (collection cards, promo banners): Use the scraped-*.png files (FAL-generated, high quality) with next/image and proper sizing.
- For OVERLAYS on images: Use CSS backdrop-blur, gradient overlays (bg-gradient-to-r), and opacity to make any image look polished.
- NEVER stretch small images to fill large sections. If an image is too small, use a CSS gradient or SVG background instead.

SECTION-BY-SECTION COPY INSTRUCTIONS:
For each section visible on the reference image (top to bottom), create an equivalent section with:
- The SAME layout structure (full-width vs contained, grid columns, flex direction)
- The SAME visual weight (font sizes, spacing, padding)
- The SAME color treatment (background colors, text colors, overlays)
- The SAME interactive patterns (hover effects, animations)
- The SAME number of items shown (if they show 4 products per row, you show 4)

Here is the structured analysis of the reference image (palette, fonts, sections, etc.):

HEADER

  cat "$analysis_file" >> "$prompt_file"

  cat >> "$prompt_file" <<'FOOTER'

IMPLEMENTATION CHECKLIST — do ALL of these:
1. FIRST: Read the reference image file to see the exact visual design.
2. globals.css: Apply the exact color palette from the analysis JSON above (use browser-accurate hex/oklch values). Define CSS gradients for hero/banner backgrounds matching the reference's color feel.
3. Google Font: Use the heading_font_suggestion and body_font_suggestion from the analysis JSON (or closest available Google Font).
4. Header/nav: Match the reference's exact layout — logo position, nav link style, icon placement.
5. Announcement bar: Match the reference's announcement bar style if present.
6. Hero section: Match the reference's exact layout. For the background, use CSS gradients or SVG backgrounds (hero-bg-*.svg) instead of raster images for best quality. Layer text with proper overlays.
7. Product grid: Match exact columns, card style, image aspect ratio, typography, hover effects.
8. Every homepage section: Recreate each section listed in the analysis JSON's "sections" array in the SAME ORDER. For decorative/banner sections, prefer CSS gradients + SVG patterns over low-res raster images.
9. Footer: Match the reference's exact column layout, link groups, newsletter form if present.
10. Product page: Match trust badges, features section to the reference's industry.
11. Use scraped-*.png images (FAL-generated, high quality, on-brand) for collection cards and promo sections. Use SVG/CSS for large background areas.
12. Run: npx next build (must pass)
13. Run: npx biome check --write .

Do NOT change the core Commerce Kit integration, cart system, or routing structure. Only change UI components, styling, and static content.
FOOTER

  local psize
  psize=$(wc -c < "$prompt_file" | tr -d ' ')
  echo "  Prompt saved (${psize} bytes)"
}

# ── Main Loop ────────────────────────────────────────────────────
echo "============================================"
echo "  Theme Generator - YourNextStore"
echo "============================================"
echo ""

if [[ ! -d "$IMAGES_DIR" ]]; then
  echo "ERROR: Images directory not found: $IMAGES_DIR"
  exit 1
fi

IMAGES=()
while IFS= read -r -d '' f; do
  IMAGES+=("$f")
done < <(find "$IMAGES_DIR" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) -print0 | sort -z)

if [[ ${#IMAGES[@]} -eq 0 ]]; then
  echo "ERROR: No reference images found in $IMAGES_DIR"
  exit 1
fi

echo "Found ${#IMAGES[@]} reference image(s) to process."
echo ""

cd "$PROJECT_DIR"

# Find the highest existing theme-N branch to continue from
existing_max=$(git branch --list 'theme-*' | sed 's/.*theme-//' | sort -n | tail -1 | tr -d ' ')
theme_num=${existing_max:-0}

echo "Starting from theme-$((theme_num + 1)) (found $theme_num existing theme branches)."
echo ""

for src_image in "${IMAGES[@]}"; do
  theme_num=$((theme_num + 1))

  branch_name="theme-${theme_num}"
  src_basename=$(basename "$src_image")

  echo "──────────────────────────────────────────"
  echo "  Theme ${theme_num}/${#IMAGES[@]}: ${src_basename}"
  echo "  Branch: ${branch_name}"
  echo "──────────────────────────────────────────"

  # 1. Create branch from main
  echo "[1/7] Creating branch ${branch_name} from main..."
  git checkout main 2>/dev/null || git checkout -b main
  git checkout -B "$branch_name"
  echo "  On branch: $(git branch --show-current)"

  # 2. Analyze reference image with Claude vision
  echo "[2/7] Analyzing reference image with Claude vision..."
  analysis_file="${SCRATCH_DIR}/theme-${theme_num}-analysis.json"
  analyze_image "$src_image" "$analysis_file"

  # 3. Generate themed images with fal.ai (text-to-image)
  echo "[3/7] Generating themed images with fal.ai (${FAL_MODEL})..."
  generate_themed_images "$analysis_file" "${PROJECT_DIR}/public"

  # 4. Generate SVG backgrounds from palette
  echo "[4/7] Generating SVG backgrounds..."
  generate_svg_backgrounds "${PROJECT_DIR}/public" "$analysis_file"

  # 5. Copy reference image into project so Claude Code can read it
  cp "$src_image" "${PROJECT_DIR}/reference-screenshot.png"
  echo "  Reference image copied to project root"

  # 6. Build the prompt file
  echo "[5/7] Building Claude prompt..."
  local_prompt_file="${SCRATCH_DIR}/theme-${theme_num}-prompt.txt"
  build_prompt_file \
    "$analysis_file" \
    "$local_prompt_file" \
    "${PROJECT_DIR}/reference-screenshot.png"

  # 7. Run Claude Code to redesign
  echo "[6/7] Running Claude Code redesign (this may take several minutes)..."

  CLAUDECODE= claude -p \
    --dangerously-skip-permissions \
    --model opus \
    --max-budget-usd 10 \
    "$(cat "$local_prompt_file")" \
    2>&1 | tee "${SCRATCH_DIR}/theme-${theme_num}-claude-output.txt"

  echo ""
  echo "  Claude Code finished."

  # Clean up reference screenshot before commit
  rm -f "${PROJECT_DIR}/reference-screenshot.png"

  # 8. Git add, commit, push, back to main
  echo "[7/7] Committing and pushing..."
  git add .
  if git diff --cached --quiet; then
    echo "  No changes to commit. Skipping."
  else
    git commit -m "$(cat <<EOF
Theme ${theme_num} redesign based on reference image ${src_basename}

Automated script redesign
Branch: ${branch_name}
EOF
)"
    echo "  Committed."
  fi
  git push -u origin "$branch_name" --force 2>&1 || echo "  Push failed (no remote or auth issue). Continuing..."
  git checkout main
  echo "  Back on main."

  echo ""
  echo "  Theme ${theme_num} complete!"
  echo ""
done

echo "============================================"
echo "  All themes generated!"
echo "  Scratch files: ${SCRATCH_DIR}"
echo "============================================"
