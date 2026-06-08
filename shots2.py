import os
from playwright.sync_api import sync_playwright

OUT = r"c:\Users\majog\Desktop\Especializacion\Incorporacion de las TIC en la enseñanza\Entregable 2\Documentos\capturas"
os.makedirs(OUT, exist_ok=True)
BASE = "https://marlongomez9603-netizen.github.io/red-mantenimiento-unipaz"
VP = {"width": 1440, "height": 900}


def shot(page, name):
    page.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=False)
    print("OK", name)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ---------- Paginas publicas + login (sin sesion) ----------
    ctx = browser.new_context(viewport=VP, device_scale_factor=2)
    pg = ctx.new_page()
    publicas = [
        ("01_inicio", "/"),
        ("02_modelo_addie", "/modelo-instruccional/"),
        ("03_actividades", "/actividades/"),
        ("04_actividad_A1", "/actividades/bd-activos/"),
        ("05_actividad_A2", "/actividades/plan-preventivo/"),
        ("06_actividad_A3", "/actividades/ordenes-kpi/"),
        ("11_evaluacion", "/evaluacion/"),
        ("12_acceso", "/acceso/"),
        ("13_ingresar", "/ingresar/"),
    ]
    for name, path in publicas:
        pg.goto(BASE + path)
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(900)
        shot(pg, name)
    ctx.close()

    # ---------- Estudiante: opera el CMMS ----------
    ctx = browser.new_context(viewport=VP, device_scale_factor=2)
    pg = ctx.new_page()
    pg.goto(BASE + "/ingresar/")
    pg.wait_for_load_state("networkidle")
    pg.get_by_role("button", name="Estudiante opera el CMMS").click()
    pg.wait_for_url("**/cmms/**", timeout=30000)
    pg.wait_for_load_state("networkidle")
    pg.wait_for_timeout(1800)
    shot(pg, "07_cmms_activos")
    for tab, name in [("Planes", "08_cmms_planes"), ("Órdenes", "09_cmms_ordenes"), ("Indicadores", "10_cmms_indicadores")]:
        pg.get_by_role("button", name=tab, exact=True).click()
        pg.wait_for_timeout(900)
        shot(pg, name)
    ctx.close()

    # ---------- Docente: panel de seguimiento ----------
    ctx = browser.new_context(viewport=VP, device_scale_factor=2)
    pg = ctx.new_page()
    pg.goto(BASE + "/ingresar/")
    pg.wait_for_load_state("networkidle")
    pg.get_by_role("button", name="Docente revisa el trabajo").click()
    pg.wait_for_url("**/panel-docente/**", timeout=30000)
    pg.wait_for_load_state("networkidle")
    pg.wait_for_timeout(1800)
    # expandir el primer estudiante
    try:
        pg.get_by_text("Estudiante Demo", exact=False).first.click()
        pg.wait_for_timeout(900)
    except Exception as e:
        print("no se pudo expandir:", e)
    shot(pg, "14_panel_docente")
    ctx.close()

    browser.close()
print("Listo. Capturas en:", OUT)
