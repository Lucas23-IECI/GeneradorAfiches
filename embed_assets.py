"""
embed_assets.py — Generador de Afiches Deportivos
Genera match_poster_standalone.html: un archivo HTML autocontenido
con CSS, imágenes y script de descarga embedidos (sin dependencias externas
salvo Google Fonts y html2canvas CDN).

Uso:
  python embed_assets.py

Limitación: las imágenes personalizadas subidas por el usuario desde el
navegador NO se pueden embeder automáticamente. El standalone se genera
con los assets por defecto del proyecto (FutbolBackground3.png, Foto1.png,
Foto2.png).
"""

import base64
import os
import sys


def image_to_base64(path):
    """Convierte un archivo de imagen a data URI base64."""
    ext_map = {
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.gif':  'image/gif',
    }
    try:
        with open(path, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        ext = os.path.splitext(path)[1].lower()
        mime = ext_map.get(ext, 'image/png')
        return f'data:{mime};base64,{encoded}'
    except FileNotFoundError:
        print(f'  ⚠  Archivo no encontrado: {path} — se deja la referencia original.')
        return path
    except Exception as e:
        print(f'  ⚠  Error convirtiendo {path}: {e}')
        return path


# ─── Plantilla del poster standalone ────────────────────────────
# Solo el poster (sin panel de la app), con botón de descarga.

STANDALONE_TEMPLATE = r"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Afiche Deportivo — Standalone</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
{{CSS}}
  </style>
</head>
<body>
  <main class="page">
    <section class="poster" id="poster" role="img"
             aria-label="Afiche: Años Dorados. Tigre vs Ferro. Domingo 15/02 17:00. Cancha Chiguayante Sur.">

      <div class="top-badges" aria-hidden="true">
        <span class="star"></span><span class="star"></span><span class="star"></span>
        <span class="star"></span><span class="star"></span>
      </div>

      <header class="header">
        <p class="kicker">PARTIDO RECOPA 2026</p>
        <h1 class="title">
          <span class="title--gold">AÑOS</span>
          <span class="title--light">DORADOS</span>
        </h1>
        <div class="meta">
          <div class="pill"><span class="pill__value">DOMINGO 15/02</span></div>
          <div class="pill">
            <span class="pill__label">Hora</span>
            <span class="pill__value">17:00</span>
          </div>
        </div>
        <p class="subtitle">CANCHA CHIGUAYANTE SUR</p>
      </header>

      <div class="divider" aria-hidden="true"></div>

      <section class="matchup" aria-label="Enfrentamiento">
        <article class="team team--left">
          <div class="logo-frame">
            <img class="logo" src="{{LOGO_A}}" alt="Logo equipo A" />
          </div>
          <h2 class="team-name">TIGRE</h2>
          <p class="team-city">Hualqui</p>
        </article>
        <div class="vs" aria-label="versus">
          <div class="vs-badge">VS</div>
          <span class="vs-glow" aria-hidden="true"></span>
        </div>
        <article class="team team--right">
          <div class="logo-frame">
            <img class="logo" src="{{LOGO_B}}" alt="Logo equipo B" />
          </div>
          <h2 class="team-name">FERRO</h2>
          <p class="team-city">Chiguayante</p>
        </article>
      </section>

      <span class="grain" aria-hidden="true"></span>
      <span class="vignette" aria-hidden="true"></span>
      <span class="stadium-lights left" aria-hidden="true"></span>
      <span class="stadium-lights right" aria-hidden="true"></span>
      <span class="pitch" aria-hidden="true"></span>
      <span class="fog" aria-hidden="true"></span>
    </section>
  </main>

  <!-- Botón de descarga -->
  <button id="downloadBtn" style="
    position:fixed; bottom:20px; right:20px; z-index:9999;
    padding:16px 28px; border:none; border-radius:14px;
    font-size:18px; font-weight:900; font-family:inherit;
    color:#000; cursor:pointer;
    background:linear-gradient(135deg,#ffd88a,#f0b43a,#d4981d);
    box-shadow:0 8px 30px rgba(240,180,58,.35);">
    📸 Descargar JPG
  </button>

  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script>
    document.getElementById('downloadBtn').addEventListener('click', function() {
      var poster = document.getElementById('poster');
      var btn = this;
      btn.disabled = true;
      btn.textContent = '⏳ Generando…';

      // Workaround: background-clip:text
      var golds = poster.querySelectorAll('.title--gold');
      var saved = [];
      golds.forEach(function(el) {
        saved.push({ el:el, bg:el.style.background, clip:el.style.webkitBackgroundClip,
          clipS:el.style.backgroundClip, color:el.style.color, sh:el.style.textShadow, f:el.style.filter });
        el.style.background='none'; el.style.webkitBackgroundClip='initial';
        el.style.backgroundClip='initial'; el.style.color='#f0b43a';
        el.style.textShadow='0 2px 4px rgba(0,0,0,0.5)'; el.style.filter='none';
      });

      html2canvas(poster, { scale:2, useCORS:true, allowTaint:true,
        backgroundColor:null, logging:false
      }).then(function(canvas) {
        var a = document.createElement('a');
        a.download = 'Partido_Recopa_2026.jpg';
        a.href = canvas.toDataURL('image/jpeg', 0.92);
        a.click();
      }).catch(function(err) {
        console.error(err);
        alert('Error al exportar. Si usás file://, probá con Live Server o Firefox.');
      }).finally(function() {
        saved.forEach(function(s) {
          s.el.style.background=s.bg; s.el.style.webkitBackgroundClip=s.clip;
          s.el.style.backgroundClip=s.clipS; s.el.style.color=s.color;
          s.el.style.textShadow=s.sh; s.el.style.filter=s.f;
        });
        btn.disabled=false; btn.textContent='📸 Descargar JPG';
      });
    });
  </script>
</body>
</html>
"""


def embed_assets():
    """Genera match_poster_standalone.html con assets embedidos."""
    print('─── Generador de Standalone ───')

    # 1. Leer CSS
    css_path = 'styles.css'
    if not os.path.exists(css_path):
        print(f'❌ No se encontró {css_path}')
        sys.exit(1)

    print(f'  📄 Leyendo {css_path}…')
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()

    # 2. Convertir imágenes a base64
    images = {
        'FutbolBackground3.png': 'FutbolBackground3.png',
        'Foto1.png': 'Foto1.png',
        'Foto2.png': 'Foto2.png',
    }

    b64 = {}
    for key, path in images.items():
        print(f'  🖼  Embediendo {path}…')
        b64[key] = image_to_base64(path)

    # 3. Reemplazar URL del fondo en el CSS
    css_content = css_content.replace(
        'url("FutbolBackground3.png")',
        f'url("{b64["FutbolBackground3.png"]}")'
    )

    # El CSS del standalone necesita el fondo hardcoded en .poster
    # ya que no hay JS. Agregamos la regla de background al .poster
    poster_bg_rule = f"""
/* Fondo embedido para standalone */
.poster {{
  background:
    linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.30)),
    url("{b64['FutbolBackground3.png']}") center/cover no-repeat,
    radial-gradient(900px 520px at 50% 18%, rgba(120,180,255,.20) 0%, rgba(0,0,0,0) 60%),
    radial-gradient(900px 520px at 50% 100%, rgba(70,170,90,.18) 0%, rgba(0,0,0,0) 55%) !important;
}}
"""
    css_content += poster_bg_rule

    # 4. Ensamblar HTML
    html = STANDALONE_TEMPLATE
    html = html.replace('{{CSS}}', css_content)
    html = html.replace('{{LOGO_A}}', b64['Foto1.png'])
    html = html.replace('{{LOGO_B}}', b64['Foto2.png'])

    # 5. Escribir archivo
    output = 'match_poster_standalone.html'
    print(f'  💾 Escribiendo {output}…')
    with open(output, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = os.path.getsize(output) / 1024
    print(f'  ✅ ¡Listo! {output} ({size_kb:.0f} KB)')
    print('  Podés abrirlo directamente en el navegador.')


if __name__ == '__main__':
    embed_assets()

