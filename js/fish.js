class Seafood {
    constructor() {
        this.screen = document.getElementById('screen');
        this._init();
        this.allCategories;
        this.allGoods;
        document.getElementById('buttons').addEventListener('click', (evt) => {
            evt.preventDefault();
            let e = evt.target

            if (e.name === 'choose') {
                let checkBtn = e.dataset.choose;

                if (checkBtn === '1') {
                    this.iKnow();
                } else {
                    this.needHelp();
                }
            }
        })
    }
    _init() {
        this.getCategories();
        this.getGoods();
    }
    async getCategories() {
        let response = await fetch('data/categories.json');
        this.allCategories = await response.json();
    }

    async getGoods() {
        let response = await fetch('data/goods.json');
        this.allGoods = await response.json();
    }

    iKnow() {
        this.screen.innerHTML = '';
        let mainStr;
        let strFirstCode = `
        <section class="type-list__style">
        <p class="type-list__title">Отметьте нужную категорию, или несколько</p>
        <ul class="type-list__items">`;

        let strLastCode = `
        </ul>
                <div class="type-list__button">
                    <button class="btn-common type-list__btn" id="catNext">Дальше</button>
                </div>
            </section>`;

        let mainCode = '';

        this.allCategories.forEach((e) => {
            mainCode = mainCode + `<li class="type-list__item">
            <input class="type-list__checkbox" type="checkbox" name="type-list" id="${e.id}">
            <label for="${e.id}" class="type-list__text">${e.name}</label>
        </li>`
        });

        mainStr = strFirstCode + mainCode + strLastCode;
        this.screen.insertAdjacentHTML('beforeend', mainStr);

        document.getElementById('catNext').addEventListener('click', () => {
            console.log('Дальшеееее');
            let checkboxArr = document.querySelectorAll('input[type=checkbox]:checked');
            this.chooseCategories(checkboxArr, this.allGoods);
        })

    }

    chooseCategories(allCats, allGoods) {
        let strFirstCode = `<section class="category__style">`;
        let strMainCode = '';
        let strLastCode = `
        <div class="category__common-button">
                    <button class="category__last-btn">К заказу</button>
                </div>
            </section>`;

        allCats.forEach((e) => {
            // console.log(this.allCategories[e.id - 1].name);
            strMainCode = strMainCode + `<div class="category__item">
            <p class="category__title">${this.allCategories[e.id - 1].name}</p>`
            allGoods.forEach((index) => {
                if (index.cat_id == e.id) {
                    strMainCode = strMainCode + `
                    <div class="category__card">
                        <p class="category__subtitle">${index.name}</p>
                        <div class="category__img">
                            <img src="img/category__img.png" alt="${index.name}">
                        </div>
                        <div class="category__price">
                            <div class="category__price-left">
                                <p class="category__price-kg">${index.price} ₽/кг</p>
                                <p class="category__price-netto">${index.netto}</p>
                            </div>
                            <p class="category__price-final"></p>
                        </div>
                        <p class="category__desc">${index.desc}</p>
                        <div class="category__button">
                            <button class="category__btn">Добавить в заказ</button>
                        </div>
                    </div>
                    `
                }
            });
            strMainCode = strMainCode + `</div>`;
        });

        let strAllCode = strFirstCode + strMainCode + strLastCode;
        this.screen.innerHTML = '';
        this.screen.insertAdjacentHTML('beforeend', strAllCode);
    }

    needHelp() {
        console.log('Подскажите111');
    }

}
let chText = new Seafood();