/**
 * MIT License
 *
 * Copyright (c) 2023 VacantThinker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * @returns {Promise<void>}
 */
async function startFn() {
  async function storageGet(k) {
    try {
      let objGet = await browser.storage.local.get(k);
      let v = objGet[k]
      return v;
    } catch (e) {
      return null;
    }
  }

  async function storageSet(k, v) {
    let objNew = {}
    objNew[k] = v;
    await browser.storage.local.set(objNew)
  }

  function storageKey() {
    return {
      GIST_HTML_URL: 'GIST_HTML_URL',
    }
  }

  function storageKeySettingGithub() {
    return {
      GIST_ID: 'GIST_ID',
      TOKEN: 'TOKEN',
      FILENAME: 'FILENAME',
    }
  }

  function setupButtonClick(k, callback) {
    let sel = `#${k}`
    let element = document.querySelector(sel)
    element.addEventListener('click', async (ev) => {
      await callback();
    })
  }

  /**
   * input
   * type="text"
   * type="checkbox"
   *
   * @param k
   * @returns {Promise<void>}
   */
  async function setInputValue(k, funcCheckbox) {
    let valueStorage = await storageGet(k)
    let selector = `#${k}`
    let element = document.querySelector(selector);
    let typeInput = element.getAttribute('type');

    let typeObj = {
      text: {
        func: function () {
          let qualifiedName = "value";
          element.setAttribute(qualifiedName, valueStorage)
          element.addEventListener("change",
            async (ev) => {
              let value = ev.target[qualifiedName];
              if (value) {
                await storageSet(k, value)
              }
            })

          return qualifiedName
        }
      },
      checkbox: {
        func: async function () {
          let qualifiedName = "checked";
          valueStorage && element.setAttribute(qualifiedName, 'checked')

          async function funcChangeCheckbox() {
            let value = element.hasAttribute(qualifiedName)
            await storageSet(k, value)

            if (typeof funcCheckbox === 'function') {
              funcCheckbox(k, element, qualifiedName, value)
            }
          }

          element.addEventListener("change", async (ev) => {
            await funcChangeCheckbox();
          })

          element.parentElement.addEventListener('click',
            async (ev) => {

              let value = element.hasAttribute(qualifiedName)
              if (value) {
                element.removeAttribute(qualifiedName,)
              } else {
                element.setAttribute(qualifiedName, qualifiedName)
              }
              await funcChangeCheckbox();

            })

          return qualifiedName
        }
      },
    }

    await typeObj[typeInput].func()

    // todo end
  }

  // todo initial value from local storage
  for (const k of Object.values(storageKeySettingGithub())) {
    await setInputValue(k);
  }

  setupButtonClick(storageKey().GIST_HTML_URL, async function () {
      browser.runtime.sendMessage({
        act: "actTabCreateGistHtml",
      })
    }
  );

}

startFn().then()

