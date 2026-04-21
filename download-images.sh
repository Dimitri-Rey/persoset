#!/usr/bin/env bash
# Télécharge des photos pro propres dans ./img/
# Lance-le depuis ton terminal local :  bash download-images.sh
#
# Les URLs Unsplash ci-dessous pointent vers des photos stables,
# libres de droits (licence Unsplash). Si l'une d'elles casse,
# remplace-la par ta propre photo sous le même nom de fichier.

set -e

mkdir -p img
cd img

# Helper
get() {
  local name="$1"
  local url="$2"
  echo "→ $name"
  if [ -f "$name" ]; then
    echo "  déjà présent, skip"
    return
  fi
  curl -fsSL -A "Mozilla/5.0" "$url" -o "$name" || {
    echo "  ✗ échec — remplace manuellement $name"
    return 0
  }
  echo "  ✓ téléchargé"
}

# ---- Hero : gaming laptop en ambiance sombre
get "hero.jpg" \
  "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=1600&q=85&auto=format&fit=crop"

# ---- Specs ----
get "recoil16.jpg" \
  "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&q=85&auto=format&fit=crop"

get "cpu-275hx.jpg" \
  "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=85&auto=format&fit=crop"

get "rtx5090.jpg" \
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=85&auto=format&fit=crop"

get "ram-ddr5.jpg" \
  "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=85&auto=format&fit=crop"

get "oasis.jpg" \
  "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=85&auto=format&fit=crop"

get "nvme.jpg" \
  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=85&auto=format&fit=crop"

# ---- Galerie ----
get "gallery-setup.jpg" \
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&auto=format&fit=crop"

get "gallery-oasis.jpg" \
  "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=1200&q=85&auto=format&fit=crop"

get "gallery-keyboard.jpg" \
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=85&auto=format&fit=crop"

get "gallery-topdown.jpg" \
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=85&auto=format&fit=crop"

get "gallery-liquid.jpg" \
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&q=85&auto=format&fit=crop"

get "gallery-code.jpg" \
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=85&auto=format&fit=crop"

echo ""
echo "====================================================="
echo "  Terminé. Images téléchargées dans ./img/"
echo "====================================================="
echo ""
echo "Pour les VRAIES photos produit (pas de stock) :"
echo ""
echo "  • PC Spécialiste Recoil 16 :"
echo "    https://www.pcspecialist.co.uk/notebooks/recoil-16/"
echo "    (clic droit → Enregistrer l'image sous img/recoil16.jpg)"
echo ""
echo "  • XMG Oasis Mk2 :"
echo "    https://www.xmg.gg/en/xmg-oasis-mk2/"
echo "    (→ img/oasis.jpg  et  img/gallery-oasis.jpg)"
echo ""
echo "  • NVIDIA RTX 5090 :"
echo "    https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/"
echo "    (→ img/rtx5090.jpg)"
echo ""
echo "  • Intel Core Ultra 9 275HX :"
echo "    https://www.intel.com/content/www/us/en/products/sku/242293/"
echo "    (→ img/cpu-275hx.jpg)"
echo ""
