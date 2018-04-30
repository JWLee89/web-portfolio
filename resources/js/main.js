// In order to save some time, we will build this using Vue.js
(function() {

    // The navigation Vue Model
    var navigationVm;

    // Create recursive submenu component
    Vue.component('submenu-component', {
        inherit: true,
        props: ['title', 'content', 'submenus', 'href'],
        template: "#submenu-template",
        data: function() {
            return {
                isActive: false
            };
        },
        computed: {
            hasSubMenus: function () {
                return this.submenus && this.submenus.length;
            }
        },
        methods: {
            toggleNav: function() {
                // Set highest ancestor to active
                var parent = this.$parent;
                var topMenu;
                while (parent.$parent != null) {
                    topMenu = parent;
                    parent = parent.$parent;
                }

                parent.$children.forEach(function(vm) {
                    vm.isActive = false;
                });

                // Set top menu to active
                if (topMenu) topMenu.isActive = true;

                this.isActive = true;
                navigationVm.content = this.content;
            }
        }
    });

    // Vue model for navigation
    navigationVm = new Vue({
        el: ".header-wrapper",
        data: function() {
            return {
                content: null,
                // This is the menu hierarchy
                // Dummy data
                menuList: [
                    {
                        title: "<i class='fa fa-user-circle'></i>&nbsp;&nbsp;<span>About</span>",
                        href: "#about",
                        content: "Home decorations right here"
                    },
                    {
                        title: "<i class='fa fa-book'></i>&nbsp;&nbsp;<span>Projects</span>",
                        href: "#projects",
                        content: "Home decorations right here"
                    },
                    {
                        title: "<i class='fa fa-gavel'></i>&nbsp;&nbsp;<span>Skills</span>",
                        href: "#skills",
                        content: "Home decorations right here"
                    },
                    {
                        title: "<i class='fa fa-envelope-open'></i>&nbsp;&nbsp;<span>Contact</span>",
                        href: "#contact",
                        content: "Basic contact form"
                    },
                    {
                        title: "<i class='fa fa-wordpress'></i>&nbsp;&nbsp;<span>Blog</span>",
                        href: "https://www.thecodingdelight.com",
                        content: "no content"
                    }
                ]
            };
        },
        methods: {
            // For now, we will toggle a modal
            search: function() {
                toggleSearchModal();
            }
        }
    });

    var searchModal = document.getElementById("searchNotAvailable");
    var modalCloseElements = document.querySelectorAll(".modal-blanket, .modal-close");
    var modalEnabled = false;

    /**
     * Handle a user-defined action
     * @param {NodeListOf<Element>} elements a List of HTML nodes
     * @param {Function} actionCb The action to perform. First parameter is the actual HTML element.
     * */
    function processElements(elements, actionCb) {
        // Event listener for click outside
        Array.prototype.forEach.call(modalCloseElements, actionCb);
    }

    /**
     * Initialize Modal Event Listener
     * */
    function initModalEventListener() {
        // Event listener for click outside
        processElements(modalCloseElements, function(element) {
            element.addEventListener('click', function() {
                if (modalEnabled) {
                    toggleSearchModal();
                }
            });
        });
    }

    /**
     * Add classes to a collection of HTML elements
     * @param {NodeListOf<Element>} elements An array-like list of HTML elements
     * @param {String} className The name of the class to add.
     * */
    function addClasses(elements, className) {
        processElements(elements, function(element) {
            element.classList.add(className);
        });
    }

    /**
     * Remove classes from a collection of HTML elements
     * @param {NodeListOf<Element>} elements An array-like list of HTML elements
     * @param {String} className The name of the class to remove.
     * */
    function removeClasses(elements, className) {
        processElements(elements, function(element) {
            element.classList.remove(className);
        });
    }

    // Toggle the modal
    function toggleSearchModal() {
        modalEnabled = !modalEnabled;
        if (modalEnabled)  {
            searchModal.classList.add("active");
            addClasses(modalCloseElements, "active");
            // modalBlanket.classList.add("modal-blanket-active");
        } else {
            searchModal.classList.remove("active");
            removeClasses(modalCloseElements, "active");
            // modalBlanket.classList.remove("modal-blanket-active");
        }
    }

    // Create event listener for our modal
    initModalEventListener();

    // Vue Component for the carousel
    // Child component of the projectTabVm
    var carouselComponent = {
        props: ['carousels', 'title', 'description', 'technologies', 'demo-link', 'repository-link'],
        template: "#carousel-template",
        data: function() {
            return {
                currentIndex: 0
            }
        },
        methods: {
            isActive: function(index) {
                return this.currentIndex === index;
            },
            move: function(index) {
                this.currentIndex = index;
            },
            moveBack: function() {
                if (this.currentIndex === 0) {
                    this.currentIndex = this.carousels.length - 1;
                } else {
                    this.currentIndex--;
                }
                this.move(this.currentIndex);
            },
            moveForward: function() {
                if (this.currentIndex === this.carousels.length - 1) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex++;
                }
                this.move(this.currentIndex);
            }
        }
    };

    // The go to top navigation button that appears on the bottom right
    // corner of the page.
    var toTopBtn = document.querySelector('.go-to-top');

    /**
     * On clicking the button, scroll user up to the top
     * @param {Number} ms The milliseconds taken to perform animation.
     * */
    function initScrollUpEvent(ms) {
        toTopBtn.addEventListener('click', function(evt) {
            document.body.scrollTop = 0;
        });
    }

    // Add 600 millisecond animation to scrollup event
    // TODO: Work on the animation later on
    initScrollUpEvent(600);

    /**
     * Add fixed class to navbar when users scroll down
     * */
    function initWindowScrollEvent() {
        // Listen for scroll events
        window.onscroll = function() { stick() };

        var navbar = document.querySelector('.header-wrapper');
        var sticky = navbar.offsetTop + 70; // 70 is the height of the footer

        function stick() {
            if (window.pageYOffset >= sticky) {
                toTopBtn.style.opacity = 1;
               // navbar.classList.add("fixed-top");
            } else {
                toTopBtn.style.opacity = 0;
              //  navbar.classList.remove("fixed-top");
            }
        }
    }

    initWindowScrollEvent();

    var HTML_CSS = "HTML5 AND CSS3";
    var HTML_CSS_JS = "HTML5, CSS3 AND VANILLA JAVASCRIPT";

    // Vue model for tabs since I don't really like the hard coded tab component
    // Ironically, we are retrieving hard-coded data, but at least it is structured
    // and can easily be migrated into a database in the future.
    var projectTabVm = new Vue({
        el: ".portfolio-container",
        data: function() {
            return {
                activeTabIndex: 0,
                tabs: [
                    {
                        title: "Calculator",
                        technologies: HTML_CSS_JS,
                        description: "A simple calculator. Behind the scenes, we are not using JavaScript's <code>eval</code> function. Instead, we are using a stack to perform arithmetic operations.",
                        demoLink: "https://jwlee89.github.io/bov-web-components/bov-css-project-1-calculator/",
                        repositoryLink: "https://github.com/JWLee89/bov-web-components/tree/master/bov-css-project-1-calculator",
                        carousels: [
                            {
                                content: "<img src='resources/images/calculator.jpg' class='img' alt='calculator img'>"
                            },
                            {
                                content: "<img src='resources/images/calculator.gif' alt='calculator' style='width: 100%; height: auto;'>"
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-1-calculator/'></iframe>"
                            }
                        ]
                    },
                    {
                        title: "Forms",
                        technologies: HTML_CSS,
                        description: "Basic forms using HTML and CSS.",
                        demoLink: "https://jwlee89.github.io/bov-web-components/bov-css-project-1-calculator/",
                        repositoryLink: "https://github.com/JWLee89/bov-web-components/tree/master/bov-css-project-4-forms",
                        carousels: [
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-4-forms/1.%20sign-up-form/'></iframe>"
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-4-forms/2.%20shipping-billing-address-form/'></iframe>",
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-4-forms/3.%20scheduling-form/'></iframe>"
                            }
                        ]
                    },
                    {
                        title: "Reactive Accordion",
                        technologies: HTML_CSS_JS,
                        description: "A reactive accordion that updates its contents when the data changes.",
                        demoLink: "https://jwlee89.github.io/bov-web-components/bov-css-project-3-accordion/",
                        repositoryLink: "https://github.com/JWLee89/bov-web-components/tree/master/bov-css-project-3-accordion",
                        carousels: [
                            {
                                content: "<img class='img' src='resources/images/accordion-1.jpg'>"
                            },
                            {
                                content: "<img class='img' src='resources/images/accordion-2.jpg'>"
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-3-accordion/'></iframe>"
                            },
                        ]
                    },
                    {
                        title: "Reactive Image Gallery",
                        technologies: HTML_CSS_JS,
                        description: "A reactive image gallery that updates its contents automatically when the data changes.",
                        demoLink: "https://jwlee89.github.io/bov-web-components/reactive-image-gallery/",
                        repositoryLink: "https://github.com/JWLee89/bov-web-components/tree/master/reactive-image-gallery",
                        carousels: [
                            {
                                content: "<img class='img' src='resources/images/reactive-gallery.jpg'>"
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/reactive-image-gallery/'></iframe>"
                            },
                        ]
                    },
                    {
                        title: "Shopping Cart",
                        technologies: HTML_CSS_JS,
                        description: "A page with a simple list of items, along with the feature to add items to the cart.",
                        demoLink: "https://jwlee89.github.io/bov-web-components/bov-css-project-5-product-listing/",
                        repositoryLink: "https://github.com/JWLee89/bov-web-components/tree/master/bov-css-project-5-product-listing",
                        carousels: [
                            {
                                content: "<img class='img' src='resources/images/shopping-cart.jpg'>"
                            },
                            {
                                content: "<iframe class='iframe-content' src='https://jwlee89.github.io/bov-web-components/bov-css-project-5-product-listing/'></iframe>"
                            },
                        ]
                    }
                ]
            }
        },
        methods: {
            isActive: function(index) {
                return this.activeTabIndex === index;
            },
            toggleTabs: function(activeTabIndex) {
                this.activeTabIndex = activeTabIndex;
            }
        },
        components: {
            'carousel-component': carouselComponent
        }
    });

    /**
     * Chart Component
     * ========================
     * */

        // Some of these properties will be hard-coded
        // Since it is highly unlikely that this will be re-used
        // For more dynamic charts, a separate library like d3.js or highcharts might be better suited.
    var chartComponent = {
            template: "#chart-template",
            props: ['skills', 'isCentered'],
            data: function() {
                return {
                    yAxisLabels: [
                        'Expert', 'Proficient', 'Competent', 'Learning'
                    ]
                }
            },
            methods: {
                // Calculate the bar height depending on the degree of proficiency.
                barHeight: function() {

                }
            }
        };

    /**
     * Skills Vue Model
     * =========================
     * */
    var skillsVm = new Vue({
        el: ".skills-section",
        data: function() {
            return {
                frontEndDevelopment: 50,
                backEndDevelopment: 50,
                frontEndSkills: [
                    {
                        name: "JavaScript",
                        color: '#FFAD41',
                        proficiency: 3,
                        tooltip: "Been writing JavaScript for 3+ years. I can build my own library / framework should the need arise."
                    },
                    {
                        name: "HTML/CSS",
                        color: '#38BAF0',
                        proficiency: 2,
                        tooltip: "If there is a image file with a UI layout, I can create it from scratch without relying on libraries / frameworks."
                    },
                    {
                        name: "Vue.js",
                        color: '#69D12B',
                        proficiency: 2,
                        tooltip: "I have used Vue.js in a real-world project. Should the need arise, I can quickly pick up other features that I haven't used."
                    },
                    {
                        name: "d3.js",
                        color: '#FA8CB0',
                        proficiency: 2,
                        tooltip: "I have used d3.js in a real-world project. Picking up new libraries / frameworks is only a matter of time. I am a quick learner."
                    },
                    {
                        name: "jQuery",
                        color: '#EFE210',
                        proficiency: 3,
                        tooltip: "I have used jQuery in many real-world projects."
                    }
                ],
                backEndSkills: [
                    {
                        name: "JavaScript",
                        color: '#FFAD41',
                        proficiency: 2,
                        tooltip: "Been writing JavaScript for 3+ years. However, I have not yet written code in Node.js. I can pick it up easily though."
                    },
                    {
                        name: "Java",
                        color: '#38BAF0',
                        proficiency: 3,
                        tooltip: "Been writing Java code for 3+ years."
                    },
                    {
                        name: "Spring Framework",
                        color: '#69D12B',
                        proficiency: 3,
                        tooltip: "Been working with Spring MVC applications for 3+ years."
                    },
                    {
                        name: "C#",
                        color: '#FA8CB0',
                        proficiency: 3,
                        tooltip: "I have used C# in a real-world project to build a desktop application. Prior to building it, I spent two weeks brushing up on fundamentals."
                    },
                    {
                        name: "Databases",
                        color: '#EFE210',
                        proficiency: 3,
                        tooltip: "I have used a wide variety of databases such as HSQLDB, Apache Derby, MySQL, Oracle 11g, PostGreSQL and SQLite"
                    }
                ],
                otherSkills: [
                    {
                        name: "Public Speaking",
                        color: '#FFAD41',
                        proficiency: 2,
                        tooltip: "Not the best at it, but I am improving."
                    },
                    {
                        name: "Writing",
                        color: '#38BAF0',
                        proficiency: 2,
                        tooltip: "I am not a natural, but my writing has steadily improved thanks to my blog."
                    },
                    {
                        name: "Settlers of Catan",
                        color: '#69D12B',
                        proficiency: 2,
                        tooltip: "A leisurely player of Settlers. I get fairly competitive when playing!"
                    },
                    {
                        name: "Reading books",
                        color: '#FA8CB0',
                        proficiency: 3,
                        tooltip: "I like reading books ~~"
                    }
                ]
            }
        },
        computed: {
            frontEndDevelopmentPercentage: function() {
                return this.frontEndDevelopment + "%";
            },
            backEndDevelopmentPercentage: function() {
                return this.backEndDevelopment + "%";
            },
        },
        components: {
            "chart-component": chartComponent
        }
    });
})();