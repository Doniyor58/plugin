const SIZE = {
    'S': 'S',
    'M': 'M',
    'L': 'L',
};

const VARIANT = {
    'RED': 'RED',
    'WHITE': 'WHITE'
};

const LOGO_SIZE = {
    [SIZE.S]: '24',
    [SIZE.M]: '30',
    [SIZE.L]: '36',
};

const SPINNER_SIZE = {
    [SIZE.S]: '24',
    [SIZE.M]: '26',
    [SIZE.L]: '28',
};


const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


class AlfaPlugin {
    constructor({ view, partner }) {
        const { size = 'M', variant = 'WHITE', root } = view;

        this.size = this.isCorrectSize(size) ? size.toUpperCase() : SIZE.L;
        this.variant = this.isCorrectVariant(variant) ? variant.toUpperCase() : VARIANT.WHITE;

        this.element = document.createElement('button');
        this.logo = document.createElement('svg');
        this.span = document.createElement('span');
        this.spinner = document.createElement('div');
        this.span.innerText = 'Купить в рассрочку';

        this.element.insertAdjacentElement('beforeend', this.logo);
        this.element.insertAdjacentElement('beforeend', this.span);
        this.element.insertAdjacentElement('beforeend', this.spinner);

        this.alfaPluginStyleSheet = document.createElement('style');
        document.head.appendChild(this.alfaPluginStyleSheet);
        this.styleSheet = this.alfaPluginStyleSheet.sheet;

        this.insertNecessaryRules();
        this.configureLayout();
        this.addClickHandler();

        const { successRedirectLink, failureRedirectLink } = partner

        this.successRedirectLink = successRedirectLink
        this.failureRedirectLink = failureRedirectLink;

        root.insertAdjacentElement('beforeend', this.element)
    }

    isCorrectSize(size) {
        return Object.values(SIZE).includes(size.toUpperCase());
    }

    isCorrectVariant(variant) {
        return Object.values(VARIANT).includes(variant.toUpperCase());
    }

    insertNecessaryRules() {
        this.styleSheet.insertRule(`
            .alfa__btn__hide {
                display: none;
            }
        `);

        this.styleSheet.insertRule(
            `.alfa__btn__base {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                
                outline: none;
                border: 1px solid #ccc;
                border-radius: 6px;
                cursor: pointer;
            }`
        );

        this.styleSheet.insertRule(`
            .alfa__btn__spinner {
                display: inline-block;
                width: ${SPINNER_SIZE[this.size]}px;
                height: ${SPINNER_SIZE[this.size]}px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: #333;
                animation: spin 1s ease-in-out infinite;
            }
        `);

        this.styleSheet.insertRule(`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
        `);

        this.styleSheet.insertRule(
            `.alfa__btn__white {
                background: #fff;
                color: #000;
            }`
        );

        this.styleSheet.insertRule(
            `.alfa__btn__red {
                background: #ef3024;
                color: #fff;
            }`
        );
    }

    configureLayout() {
        this.element.classList.add('alfa__btn__base');
        this.element.classList.add(`alfa__btn__${this.variant.toLowerCase()}`);

        this.addLogo();
        this.customizeSize();
        this.createSpinner();
    }

    addLogo() {
        this.logo.style.height = LOGO_SIZE[this.size] + 'px';
        const fill = this.variant === VARIANT.RED ? '#fff' : '#ef3124';

        this.logo.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="_Слой_1" viewBox="0 0 370 370" width=${LOGO_SIZE[this.size]} height=${LOGO_SIZE[this.size]}>
                <defs>
                    <style>.cls-1{fill:none;} .cls-2{clip-path:url(#clippath);} .cls-3{fill: ${fill};}</style>
                    <clipPath id="clippath"> <rect class="cls-1" width="370" height="370"/></clipPath>
                </defs> 
                <rect class="cls-3" x="114.28" y="258.75" width="141.44" height="29.39"/>
                <g class="cls-2"> <path class="cls-3" d="M210.89,94.41c-4.03-12.03-8.68-21.53-24.61-21.53s-20.87,9.46-25.12,21.53l-43.76,124.41h29.02l10.1-29.58h55.84l9.37,29.58h30.86l-41.71-124.41Zm-45.91,69.85l19.84-58.96h.73l18.74,58.96h-39.31Z"/></g>
            </svg>`
    }

    createSpinner() {
        this.spinner.classList.add('alfa__btn__spinner', 'alfa__btn__hide');
    }

    toggleSpinnerVisibility() {
        this.spinner.classList.toggle('alfa__btn__hide');
    }

    toggleLogoVisibility() {
        this.logo.classList.toggle('alfa__btn__hide');
    }

    customizeSize() {
        switch (this.size) {
            case SIZE.S:
                this.styleSheet.insertRule(`
                    .alfa__btn__s {
                        width: 156px;
                        min-height: 36px;
                        padding: 2px 6px 2px 2px;
                        font-size: 12px;
                    }
                `);

                this.element.classList.add('alfa__btn__s');
                return this;

            case SIZE.M:
                this.styleSheet.insertRule(`
                    .alfa__btn__m {
                        width: 180px;
                        min-height: 46px;
                        padding: 4px 8px 4px 4px;
                        font-size: 14px;
                    }
                `);

                this.element.classList.add('alfa__btn__m');
                return this;

            case SIZE.L:
            default:
                this.styleSheet.insertRule(`
                    .alfa__btn__l {
                        width: 210px;
                        min-height: 50px;
                        padding: 6px 12px 6px 6px;
                        font-size: 16px;
                    }
                `);

                this.element.classList.add('alfa__btn__l');
                return this;
        }
    }

    disableButton(isDisabled) {
        if (isDisabled) {
            this.element.disabled = true;
            this.span.classList.add('alfa__btn__hide');
            this.element.style.cursor = 'not-allowed';

            return this;
        }

        this.element.disabled = false;
        this.element.style.cursor = '';
        this.span.classList.remove('alfa__btn__hide');
    }

    toggleDisableButton() {
        this.disableButton(!this.element.disabled);
    }

    togglePendingProcess() {
        this.toggleDisableButton();
        this.toggleLogoVisibility();

        this.toggleSpinnerVisibility();
    }

    addClickHandler() {
        this.element.addEventListener('click', async (event) => {
            try {
                this.togglePendingProcess();

                await wait(1_000);
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                const data =  await response.json();

                window.open(this.successRedirectLink, '_self');
            } catch (e) {
                console.log('### Error: ', e);

                window.open(this.failureRedirectLink, '_self');
            } finally {
                this.togglePendingProcess();
            }
        });
    }
}
