from playwright.sync_api import sync_playwright
import re
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']); c=b.new_context();p=c.new_page();p.goto('http://127.0.0.1:8000/')
 p.get_by_role('button',name='Familias').click();n=re.findall(r'\d+',p.locator('label[for="gate-value"]').inner_text());p.locator('#gate-value').fill(str(sum(map(int,n))));p.get_by_role('button',name='Entrar',exact=True).click()
 p.get_by_role('button',name='Borrar progreso',exact=True).click();p.get_by_role('button',name='Conservar',exact=True).click();assert not p.locator('dialog').is_visible()
 p.get_by_role('button',name='Borrar progreso',exact=True).click();p.get_by_role('button',name='Sí, borrar',exact=True).click();assert '0/6' in p.locator('main').inner_text()
 p.evaluate("localStorage.setItem('mategenio-v2','broken')");p.reload();assert not p.locator('#storage-warning').is_hidden();p.get_by_role('button',name='¡Vamos a explorar!').click();assert p.evaluate("localStorage.getItem('mategenio-v2-recovery')")=='broken'
 # Keyboard-only access to main action and stable focus after a wrong answer.
 p.get_by_role('button',name='Comprobar').focus();p.keyboard.press('Enter');assert p.locator(':focus').get_attribute('data-action')=='check'
 c2=b.new_context();p2=c2.new_page();p2.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('unavailable')}})");p2.goto('http://127.0.0.1:8000/');p2.get_by_role('button',name='¡Vamos a explorar!').click();assert 'No se ha podido guardar' in p2.locator('#storage-warning').inner_text()
 print('PASS: reset confirmation/cancel, corrupt-save recovery in browser, keyboard focus, unavailable storage')
 b.close()
