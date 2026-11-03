"""Regression checks for direct manipulation, focus, visual scaffolding and the trail."""
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1194, 'height': 834}, has_touch=True, reduced_motion='reduce')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:8000/')
    page.evaluate('navigator.serviceWorker.ready')
    assert page.locator('.trail-stop').count() == 6
    assert page.locator('.trail-stop[aria-current="step"]').count() == 1
    # Pick objects directly, rather than through the adjustment buttons.
    page.get_by_role('button', name='¡Vamos a explorar!').click()
    page.evaluate('window.originalTitle = document.querySelector("#mission-title")')
    page.evaluate('window.originalControl = document.querySelector(".object-toolbar [data-action=add]")')
    for count in range(1, 6):
        page.locator('.supply-apple').first.tap()
        assert page.locator('.basket .object').count() == count
        assert page.locator('.supply-apple').count() == 9 - count
    assert page.evaluate('window.originalTitle === document.querySelector("#mission-title")')
    assert page.evaluate('window.originalControl === document.querySelector(".object-toolbar [data-action=add]")')
    page.locator('.basket .object').first.tap()
    assert page.locator('.basket .object').count() == 4
    # The live control remains focused for keyboard use and announces the count.
    page.get_by_role('button', name='Añadir manzana', exact=True).focus()
    page.keyboard.press('Enter')
    assert page.locator(':focus').get_attribute('data-action') == 'add'
    assert page.locator('.count-label').inner_text().startswith('5 manzanas')
    assert page.locator('.just-picked').count() == 1
    assert page.locator('.just-picked').evaluate('(el) => getComputedStyle(el).animationName') == 'none'
    page.get_by_role('button', name='Una pista').click()
    assert page.locator('.visual-hint .hint-apple').count() == 5
    assert page.get_by_role('button', name='Una pista').get_attribute('aria-expanded') == 'true'
    # Checkpoint restores the visual scaffold as well as the object count.
    context.set_offline(True)
    page.reload()
    page.get_by_role('button', name='Continuar mi aventura').click()
    context.set_offline(False)
    assert page.locator('.visual-hint').is_visible()
    page.get_by_role('button', name='Comprobar').click()
    assert page.get_by_role('progressbar').get_attribute('aria-valuenow') == '1'
    assert page.locator('.basket .object:enabled').count() == 0
    page.get_by_role('button', name='Seguir el sendero').click()
    page.get_by_role('button', name='Pausar').click()
    assert 'Dos amigos más' in page.locator('.trail-stop.current').inner_text()
    assert page.locator('.trail-stop.done').count() == 1
    # Every scene renders and remains usable at narrow widths, also with larger text.
    for index in range(6):
        state = {'version': 2, 'completed': [], 'largeText': True, 'active': {'index': index, 'value': 0, 'hint': True, 'attempts': 1}}
        page.evaluate('(p) => localStorage.setItem("mategenio-v2", JSON.stringify(p))', state)
        page.reload()
        page.get_by_role('button', name='Continuar mi aventura').click()
        for width, height in [(834, 1194), (390, 844), (320, 740)]:
            page.set_viewport_size({'width': width, 'height': height})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (index, width)
            for control in page.locator('button:visible').all():
                r = control.bounding_box()
                assert r['width'] >= 44 and r['height'] >= 44, (index, width, control.inner_text(), r)
        if index in (0, 2, 4):
            page.set_viewport_size({'width': 1194, 'height': 834})
            page.screenshot(path=f'/workspace/artifacts/mategenio-scene-{index}.png', full_page=True)
    assert not errors, errors
    print('PASS: direct object touch/return, stable DOM/focus, illustrated hints, checkpoint hints, correct progress, trail, 6 scenes at 834/390/320px, large text, touch targets, no JS errors')
    browser.close()
