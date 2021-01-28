class Seafood {
    constructor() {
        this.screen = document.getElementById('screen');
        this._init();
        this.allCategories;
        this.allGoods;
        this.orderGoods = [];
        this.dinnerType;
        this.sendMsg = '';
        this.dataOrder = 'Заказ:';
        this.clInfo = '';

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
            let checkboxArr = document.querySelectorAll('input[type=checkbox]:checked');
            this.chooseCategories(checkboxArr, this.allGoods);
        })

    }

    chooseCategories(allCats, allGoods) {
        let strFirstCode = `<section class="category__style" id="orderitems">`;
        let strMainCode = '';
        let strLastCode = `
        <div class="category__common-button">
                    <button class="category__last-btn" id="order">К заказу</button>
                </div>
            </section>`;

        allCats.forEach((e) => {
            strMainCode = strMainCode + `<div class="category__item">
            <p class="category__title">${this.allCategories[e.id - 1].name}</p>`
            allGoods.forEach((index) => {
                if (index.cat_id == e.id) {
                    strMainCode = strMainCode + `
                    <div class="category__card">
                        <p class="category__subtitle">${index.name}</p>
                        <div class="category__img">
                            <img src="img/goods/${index.img}" alt="${index.name}" width="100%" height="auto">
                        </div>
                        <div class="category__price">
                            <div class="category__price-left">
                                <p class="category__price-kg">${index.price} ₽/кг</p>
                                <p class="category__price-netto">${index.netto}</p>
                            </div>
                            <p class="category__price-final"></p>
                        </div>
                        <p class="category__desc">${index.desc}</p>
                        <div class="category__button" id="${index.good_id}">
                            <button class="category__btn" name="ordergood" data-good="${index.good_id}">Добавить в заказ</button>
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

        document.getElementById('orderitems').addEventListener('click', (evt) => {
            evt.preventDefault();
            let e = evt.target

            if (e.name === 'ordergood') {
                this.orderGoods.push(e.dataset.good);
                document.getElementById(e.dataset.good).innerHTML = '';
                document.getElementById(e.dataset.good).innerHTML = '<p class="category__add">Добавлено</p>';
            }
        });

        document.getElementById('order').addEventListener('click', (e) => {
            e.preventDefault();
            this.contact();
        })
    }

    contact() {
        this.screen.innerHTML = '';
        let strMainCode = `
        <section class="form__style">
            <p class="form__title">Дополнительная информация</p>
            <div class="form__container">
                <p class="form__lable">Как к вам можно обращаться?</p>
                <input class="form__input" type="text" placeholder="Как к вам можно обращаться?" id="name">
                <p class="form__lable">Ваш телефон?</p>
                <input class="form__input" type="text" placeholder="Ваш телефон" id="tel">
                <p class="form__lable">Адрес доставки?</p>
                <input class="form__input" type="text" placeholder="Адрес доставки" id="address">
                <p class="form__lable">Дата и удобное время доставки?</p>
                <input class="form__input" type="text" placeholder="Дата и удобное время доставки" id="deldate">
                <p class="form__lable">Для уточнения заказа нам необходимо вам позвонить или написать <br>(если не сможете ответить). <br>Когда это лучше всего сделать?</p>
                <input class="form__input" type="text" placeholder="Дата и удобное время" id="calldate">
                <p class="form__lable">Кто порекомендовал к нам обратиться?</p>
                <input class="form__input" type="text" placeholder="Кто порекомендовал" id="recom">
            </div>
            <div class="form__button">
                <button class="form__btn" id="rightorder">Всё верно. Жду заказ</button>
            </div>
        </section>`;
        this.screen.insertAdjacentHTML('beforeend', strMainCode);

        // let dataOrder = 'Заказ:';
        let i = false;
        this.orderGoods.forEach((index) => {
            (i) ? this.dataOrder = `${this.dataOrder},`: this.dataOrder = this.dataOrder, i = true;
            this.dataOrder = `${this.dataOrder} ${this.allGoods.find(x => x.good_id == index).name}`;
        });

        // let clInfo = '';
        document.getElementById('rightorder').addEventListener('click', () => {
            this.clInfo = `${this.clInfo}Имя: ${document.getElementById('name').value} **** Телефон: ${document.getElementById('tel').value} **** Адрес доставки: ${document.getElementById('address').value} **** Дата и время доставки: ${document.getElementById('deldate').value} **** Лучшее время для звонка: ${document.getElementById('calldate').value} **** Кто порекомендовал: ${document.getElementById('recom').value}`;
            this.sendTelegram();
            this.datasend(document.getElementById('name').value);
        })
    }
    datasend(zakaz, klient, name) {
        this.screen.innerHTML = '';
        (name != '') ? name = name + ',': name = name;
        let strMainCode = `
            <section class="order__style">
                <div class="order__final">
                    <p class="order__name">${name}</p>
                    <p class="order__thnx">спасибо!</p>
                    <p class="order__text">Ваш заказ поступил Михаилу. В ближайшее время он позвонит/напишет Вам для подтверждения заказа.</p>
                    <div class="order__img">
                        <img src="img/white-fish.png" alt="">
                        <img src="img/white-fish.png" alt="">
                        <img src="img/white-fish.png" alt="">
                        <img src="img/white-fish.png" alt="">
                    </div>
                </div>
                <div class="cover__title">
                    <h1 class="cover__title-h1">Рекомендую!</h1>
                    <h2 class="cover__title-h2">Морепродукты с Севера</h2>
                </div>
                <img class="cover__img" src="img/cover-bg-img.png" alt="Морепродукты с Севера" width="100%" height="auto">
                
            </section>
        `;
        // <p class="order__ref-link">Скопируйте ссылку, чтобы рекомендовать нас своим</p>
        this.screen.insertAdjacentHTML('beforeend', strMainCode);
    }
    needHelp() {
        let strMainCode = `
            <section class="event__style">
                <div class="event__container" id="dinner">
                    <p class="event__text">Для какого события выбираете морепродукты?</p>
                    <p class="event__item" name="dinner" data-dinner="1">Обычный ужин дома</p>
                    <p class="event__item" name="dinner" data-dinner="2">Праздничный ужин</p>
                    <p class="event__item" name="dinner" data-dinner="3">В подарок</p>
                </div>
            </section>
        `;
        this.screen.innerHTML = '';
        this.screen.insertAdjacentHTML('beforeend', strMainCode);
        document.getElementById('dinner').addEventListener('click', (evt) => {
            evt.preventDefault();
            let e = evt.target;
            this.dinnerType = e.dataset.dinner;
            this.guestsBudget();
        })
    }

    guestsBudget() {
        let strMainCode = `
            <section class="clarify__style">
                <div class="clarify__inputs">
                    <div class="clarify__input-label">
                        <p class="clarify__text">Сколько планируется гостей?</p>
                        <input class="clarify__input" type="text" placeholder="Сколько планируется гостей" id="guest">
                    </div>
                    <div class="clarify__input-label">
                        <p class="clarify__text">Какой планируете бюджет?</p>
                        <input class="clarify__input" type="text" placeholder="Какой планируете бюджет" id="budget">
                    </div>
                </div>
                <div class="clarify__checks">
                    <div class="clarify__check-label">
                        <input class="clarify__checkbox" type="checkbox" id="suprise">
                        <label class="clarify__label" for="suprise">Удивить гостей <br>(подберём что–то необычное)</label>
                    </div>
                    <div class="clarify__check-label">
                        <input class="clarify__checkbox" type="checkbox" id="gift">
                        <label class="clarify__label" for="gift">Подарочная упаковка</label>
                    </div>
                </div>
                <div class="clarify__button">
                    <button class="clarify__btn" id="questsbudget">Дальше</button>
                </div>
            </section>
        `;

        this.screen.innerHTML = '';
        this.screen.insertAdjacentHTML('beforeend', strMainCode);


        let suprise = document.getElementById('suprise');
        let gift = document.getElementById('gift');

        document.getElementById('questsbudget').addEventListener('click', () => {
            let guest = document.getElementById('guest').value;
            let budget = document.getElementById('budget').value;
            this.sendMsg = `Количество гостей: ${guest}. **** Примерный бюджет: ${budget}`;
            if (suprise.checked) { this.sendMsg = this.sendMsg + `Нужно удивить гостей (что–то необычное). `; };

            if (gift.checked) { this.sendMsg = this.sendMsg + ` Завернуть в подарочную упаковку.`; }
            this.contact();
        })
    }
    sendTelegram() {
        let numbers = ['80268845', '1034923687'];
        const token = '1465657620:AAHl6h6W5wQE3mU-PeRbMRYgGarcT5xfwuw';
        // const chatId = '';
        let msg = this.sendMsg + this.dataOrder + this.clInfo;
        numbers.forEach((e) => {
            let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${e}&text=`;
            let xhhtp = new XMLHttpRequest();
            xhhtp.open("GET", url + msg, true);
            xhhtp.send();
        })

    }

}
let Fish = new Seafood();