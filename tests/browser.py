"""Run with a local server on port 8000: python3 tests/browser.py."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1194,'height':834},device_scale_factor=1,has_touch=True)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_viewport_size({'width':1194,'height':834})
    page.goto('http://127.0.0.1:8000/')
    page.evaluate('navigator.serviceWorker.ready')
    Path('/workspace/artifacts').mkdir(exist_ok=True)
    page.screenshot(path='/workspace/artifacts/mategenio-home.png',full_page=True)
    assert page.locator('h1').inner_text().startswith('El bosque')
    page.get_by_role('button',name='¡Vamos a explorar!').click()
    # Wrong answers offer another attempt; hint usage is saved.
    page.get_by_role('button',name='Comprobar').click()
    assert 'Todavía no' in page.locator('#feedback').inner_text()
    page.get_by_role('button',name='Una pista').click()
    for _ in range(5):page.get_by_role('button',name='Añadir manzana').click()
    page.reload()
    page.get_by_role('button',name='Continuar mi aventura').click()
    assert '5 manzanas' in page.locator('.count-label').inner_text()
    page.screenshot(path='/workspace/artifacts/mategenio-adventure.png',full_page=True)
    page.get_by_role('button',name='Comprobar').click()
    page.get_by_role('button',name='Seguir el sendero').click()
    for _ in range(2):page.get_by_role('button',name='Añadir manzana').click()
    page.get_by_role('button',name='Comprobar').click();page.get_by_role('button',name='Seguir el sendero').click()
    page.get_by_role('button',name='Claro 2').click()
    page.get_by_role('button',name='Comprobar').click();page.get_by_role('button',name='Seguir el sendero').click()
    for _ in range(3):page.get_by_role('button',name='Quitar una manzana',exact=True).click()
    page.get_by_role('button',name='Comprobar').click();page.get_by_role('button',name='Seguir el sendero').click()
    page.get_by_role('button',name='8',exact=True).click()
    page.get_by_role('button',name='Comprobar').click();page.get_by_role('button',name='Seguir el sendero').click()
    for _ in range(6):page.get_by_role('button',name='Añadir manzana').click()
    page.get_by_role('button',name='Comprobar').click();page.get_by_role('button',name='Ver mi tesoro').click()
    assert 'El bosque crece' in page.locator('h1').inner_text()
    page.get_by_role('button',name='Ver mis tesoros').click()
    assert 'Tuya por explorar' in page.locator('main').inner_text()
    # Gate, parent recommendations, export, preferences.
    page.get_by_role('button',name='Familias').click()
    page.locator('#gate-value').fill('0');page.get_by_role('button',name='Entrar',exact=True).click()
    assert 'Revisa' in page.locator('#gate-error').inner_text()
    nums=re.findall(r'\d+',page.locator('label[for="gate-value"]').inner_text())
    page.locator('#gate-value').fill(str(sum(map(int,nums))));page.get_by_role('button',name='Entrar',exact=True).click()
    assert 'Explorado con apoyo' in page.locator('main').inner_text()
    page.get_by_label('Texto del juego más grande').check()
    with page.expect_download() as info:page.get_by_role('button',name='Descargar progreso').click()
    assert info.value.suggested_filename=='mategenio-progreso.json'
    page.get_by_role('button',name='Volver a la aventura').click();page.reload()
    assert page.locator('body').evaluate('(el)=>el.classList.contains("large-text")')
    # Offline reload, including the app modules and legacy practice.
    context.set_offline(True);page.reload();page.get_by_role('button',name='Volver a explorar').click()
    assert page.locator('#mission-title').inner_text()=='Un picnic para los amigos'
    context.set_offline(False)
    # Responsive layouts and touch target audit.
    for width,height in [(834,1194),(390,844)]:
        page.set_viewport_size({'width':width,'height':height})
        page.get_by_role('button',name='Pausar').click()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.screenshot(path=f'/workspace/artifacts/mategenio-{width}.png',full_page=True)
        page.get_by_role('button',name='Continuar mi aventura').click()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        for box in page.locator('button:visible').all():
            rect=box.bounding_box();assert rect['height']>=44,box.inner_text()
    assert not errors,errors
    print('PASS: full adventure, retry, hints, checkpoint, rewards, gate, parent, export, settings, offline, landscape/portrait/mobile, touch targets, no JS errors')
    browser.close()
