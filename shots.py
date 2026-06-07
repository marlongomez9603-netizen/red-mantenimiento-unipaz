import os
from playwright.sync_api import sync_playwright

OUT = r"c:\Users\majog\Desktop\Especializacion\Incorporacion de las TIC en la enseñanza\Entregable 2\Documentos\capturas"
os.makedirs(OUT, exist_ok=True)
BASE = "https://marlongomez9603-netizen.github.io/red-mantenimiento-unipaz"

pages = [
    ("01_inicio", "/", None),
    ("02_modelo_addie", "/modelo-instruccional/", None),
    ("03_actividades", "/actividades/", None),
    ("04_actividad_A1", "/actividades/bd-activos/", None),
    ("05_actividad_A2", "/actividades/plan-preventivo/", None),
    ("06_actividad_A3", "/actividades/ordenes-kpi/", None),
    ("07_cmms_activos", "/cmms/", None),
    ("08_cmms_planes", "/cmms/", "Planes"),
    ("09_cmms_ordenes", "/cmms/", "Órdenes"),
    ("10_cmms_indicadores", "/cmms/", "Indicadores"),
    ("11_evaluacion", "/evaluacion/", None),
    ("12_acceso", "/acceso/", None),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    for name, path, tab in pages:
        page.goto(BASE + path)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(900)  # dejar correr animaciones de carga
        if tab:
            page.get_by_role("button", name=tab, exact=True).click()
            page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=False)
        print("OK", name)
    browser.close()
print("Capturas en:", OUT)
