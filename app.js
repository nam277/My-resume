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

    pageTransition: function() {
        // handling active-btn and active page
        $$('.control').forEach((control, index) => {
            control.addEventListener('click', function(e) {
                // active-btn
                $('.active-btn').classList.remove('active-btn')
                this.classList.add('active-btn')

                // update currentPage into localStorage
                app.setConfig("currentPage", index)
                
                // active page
                $('.active').classList.remove('active')
                $(`#${control.dataset.id}`).classList.add('active')
            })

            // Set currentPage of app from localStorage
            app.currentPage = app.config.currentPage

            // Filter index of control that equal currentPage. Handling active-bn and render it to browser 
            if (index === app.currentPage) {
                control.classList.add('active-btn')
                $(`#${control.dataset.id}`).classList.add('active')
            }
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

            // Get value of each progress bar and render it for textPercent and style.width when refresh browser
            bar.value = app.config[index]
            barParent.querySelector('.textPercent').innerHTML =`${app.config[index]}%`
            barParent.querySelector('.bar-width').style.width = app.config[index] + '%'
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

        this.progressSkill()

        this.changeTheme()

        this.showMenu()
    }

}

app.start()



