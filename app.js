const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const pullBar = $$('.pull-bar')

const PLAYER_STORAGE_KEY = 'personal'

const app = {
    isDark: true,
    currentPage: 0,

    // Create a new object in localStorage that save data from the user's action 
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    getParentForm: function(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    },

    // Function toggle active btn when scroll page
    scrollPage: function() {
        window.onscroll = () => {
            $$('.section').forEach(sec => {
                let top = window.scrollY
                let height = sec.offsetHeight
                let offset = sec.offsetTop - 250

                if (top >= offset && top < offset + height) {
                    // Get btn from id of section
                    $(`[data-id="${sec.id}"]`).classList.add('active-btn')

                } else $(`[data-id="${sec.id}"]`).classList.remove('active-btn')
            }) 
        }
    },

    pageTransition: function() {
        // handling active-btn and active page
        $$('.control').forEach((control, index) => {
            // Fix for case: first access to Web. Because in this case app.config is undefined
            if (app.config.currentPage) {
                app.currentPage = app.config.currentPage
            }

            // Load config when reload browser
            if (index === app.currentPage) {
                control.classList.add('active-btn')
                $(`#${control.dataset.id}`).classList.add('active')
            } else {
                control.classList.remove('active-btn')
                $(`#${control.dataset.id}`).classList.remove('active')
            }

            control.addEventListener('click', function(e) {
                if (index !== app.currentPage) {
                    $('.active-btn').classList.remove('active-btn')
                    control.classList.add('active-btn')

                    $('.active').classList.remove('active')
                    $(`#${control.dataset.id}`).classList.add('active')
                    app.setConfig("currentPage", index)
                } else {
                    app.setConfig("currentPage", index)
                }

                // Scroll to active page when click this button that control this page
                window.scrollTo(0, $(`#${control.dataset.id}`).offsetTop - 20)
                app.currentPage = app.config.currentPage
            })
        })
    },

    progressSkill: function() {
        pullBar.forEach((bar, index) => {
            const barParent = app.getParentForm(bar, '.progress')
            bar.oninput = function () {
                barParent.querySelector('.textPercent').innerHTML =`${bar.value}%`
                barParent.querySelector('.bar-width').style.width = bar.value + '%'
                // update value of each progress bar
                app.setConfig(`${index}`, bar.value)
            }

            // Fix for case: first access to Web. Because in this case app.config is undefined 
            if (app.config[index]) {
                bar.value = app.config[index]
            }

            // Load config when reload browser
            barParent.querySelector('.textPercent').innerHTML =`${bar.value}%`
            barParent.querySelector('.bar-width').style.width = bar.value + '%'
        })
    },

    changeTheme: function() {
        $('.theme').onclick = () => {
            app.isDark = !app.isDark
            $('.dark-btn').classList.toggle('active-theme', app.isDark)
            $('.sun-btn').classList.toggle('active-theme', !app.isDark)
            $('.main').classList.toggle('sun-model', app.isDark)
            app.setConfig("isDark", app.isDark)
        }
        app.isDark = app.config.isDark
        if (app.isDark) {
            $('.dark-btn').classList.add('active-theme')
            $('.main').classList.add('sun-model')
        } else {
            $('.sun-btn').classList.add('active-theme')
        }
    },

    showMenu: function() {
        $('.menu').onclick = () => {
            $('.controls').classList.toggle('hidden-menu')
        }
    },

    start: function() {
        this.pageTransition()

        this.scrollPage()

        this.progressSkill()

        this.changeTheme()

        this.showMenu()
    }

}

app.start()



